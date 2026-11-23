/** Browser side of Asisten Belajar Beru: calls our Netlify Function (never the AI provider directly). */
import { Capacitor } from '@capacitor/core';
import type { ChatMessage, TutorContext, TutorGuidance } from './tutorPrompt';
import type { RmtStageId } from './tutorPedagogy';
import type { PhotoParse } from './photoSolve';

/** Same site on the web; the published site from the Android app. Override with VITE_TUTOR_URL. */
export function tutorEndpoint(): string {
  const override = import.meta.env.VITE_TUTOR_URL as string | undefined;
  if (override) return override;
  return Capacitor.isNativePlatform() ? 'https://segiempatku.pages.dev/api/tanya' : '/api/tanya';
}

/** "Foto Soal" endpoint, next to /api/tanya. */
export function photoEndpoint(): string {
  return tutorEndpoint().replace(/\/api\/tanya$/, '/api/foto-soal');
}

export type PhotoResult = { ok: true; result: PhotoParse } | { ok: false; message: string };

export async function solvePhoto(image: string): Promise<PhotoResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, message: 'Foto Soal butuh internet. Sambungkan internet dulu, ya.' };
  }
  try {
    const res = await fetch(photoEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
      signal: AbortSignal.timeout(60000),
    });
    const data = (await res.json().catch(() => ({}))) as Partial<PhotoParse> & { error?: string };
    if (res.ok && data.kind) return { ok: true, result: data as PhotoParse };
    if (data.error === 'not-configured' || res.status === 404) return { ok: false, message: 'Foto Soal belum diaktifkan.' };
    return { ok: false, message: data.error ?? 'Beru sedang tidak bisa membaca foto. Coba lagi nanti.' };
  } catch {
    return { ok: false, message: 'Beru tidak bisa dihubungi. Periksa internetmu, lalu coba lagi.' };
  }
}

/** Shrink a photo to a JPEG data URL (long side ≤ 1280 px) so it uploads fast on mobile data. */
export async function compressPhoto(file: Blob, maxSide = 1280, quality = 0.8): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('bad image'));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type TutorResult =
  | { ok: true; reply: string; stage: RmtStageId | null }
  /** `unavailable` = no AI key or no internet: the chat switches to guided mode. */
  | { ok: false; message: string; unavailable: boolean };

export async function askTutor(context: TutorContext, messages: ChatMessage[], guidance?: TutorGuidance): Promise<TutorResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ok: false, unavailable: true, message: 'Tidak ada internet, jadi Beru memakai mode terpandu.' };
  }
  try {
    const res = await fetch(tutorEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, messages, guidance }),
      signal: AbortSignal.timeout(30000),
    });
    const data = (await res.json().catch(() => ({}))) as { reply?: string; stage?: RmtStageId | null; error?: string };
    if (res.ok && data.reply) return { ok: true, reply: data.reply, stage: data.stage ?? null };
    if (data.error === 'not-configured' || res.status === 404) {
      return { ok: false, unavailable: true, message: 'Asisten AI belum diaktifkan, jadi Beru memakai mode terpandu.' };
    }
    return { ok: false, unavailable: false, message: data.error ?? 'Beru sedang tidak bisa dihubungi. Coba lagi nanti.' };
  } catch {
    return { ok: false, unavailable: true, message: 'Beru tidak bisa dihubungi, jadi Beru memakai mode terpandu.' };
  }
}
