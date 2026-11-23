/**
 * "Bacakan soal" (EL05): read text aloud in Indonesian.
 * - Android app: native text-to-speech via @capacitor-community/text-to-speech.
 * - Browser: the Web Speech API, hardened for Chrome on Android:
 *   voices load late, cancel() right before speak() drops the utterance, an unavailable
 *   language fails silently, and long texts can stop halfway.
 * Math symbols are turned into words first so they are read correctly.
 */
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

/** Turn math notation into spoken Indonesian. Pure function (unit-tested). */
export function toSpeech(text: string): string {
  return (
    text
      // Money: Rp1.350.000 → 1350000 rupiah (read as a number, not "R P")
      .replace(/Rp\s?(\d[\d.,]*)/g, (_m, n: string) => `${n.replace(/\./g, '')} rupiah`)
      .replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2')
      .replace(/cm²/g, ' sentimeter persegi')
      .replace(/m²/g, ' meter persegi')
      .replace(/(\d)\s?cm\b/g, '$1 sentimeter')
      .replace(/(\d)\s?m\b/g, '$1 meter')
      .replace(/(\d)\s?kg\b/g, '$1 kilogram')
      .replace(/∠\s?([A-Z]{1,3})/g, 'sudut $1 ')
      .replace(/(\d)\s?°/g, '$1 derajat')
      .replace(/°/g, ' derajat')
      .replace(/½/g, ' setengah ')
      // Fractions written a/b (shown stacked on screen): "240/7" → "240 per 7"
      .replace(/(\S+?)\s*\/\s*(\S+)/g, '$1 per $2')
      .replace(/×/g, ' kali ')
      .replace(/(\d)\s?:\s?(\d)/g, '$1 dibagi $2')
      .replace(/(\s)−(\s)|(\s)-(\s)/g, ' dikurangi ')
      .replace(/\+/g, ' tambah ')
      .replace(/=/g, ' sama dengan ')
      .replace(/≈/g, ' kira-kira ')
      .replace(/≥/g, ' paling sedikit ')
      .replace(/∥/g, ' sejajar ')
      .replace(/⊥/g, ' tegak lurus ')
      .replace(/d₁/g, 'd satu')
      .replace(/d₂/g, 'd dua')
      .replace(/…/g, ' titik-titik ')
      .replace(/(\d),(\d)/g, '$1 koma $2')
      // Segment names like AB, AC, BD: spell them out (A B)
      .replace(/\b([A-D])([A-D])\b/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/** Split into short pieces (sentences, then commas) so long texts are not cut off. */
export function splitForSpeech(text: string, max = 180): string[] {
  const out: string[] = [];
  for (const sentence of text.split(/(?<=[.?!])\s+|\n+/)) {
    const s = sentence.trim();
    if (!s) continue;
    if (s.length <= max) {
      out.push(s);
      continue;
    }
    let cur = '';
    for (const part of s.split(/(?<=,)\s+|\s+/)) {
      if ((cur + ' ' + part).trim().length > max && cur) {
        out.push(cur.trim());
        cur = part;
      } else cur = `${cur} ${part}`;
    }
    if (cur.trim()) out.push(cur.trim());
  }
  return out;
}

/** Best Indonesian voice. Android may report "id_ID" (underscore) or "in-ID" (old code). */
export function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const isId = (v: SpeechSynthesisVoice) => /^(id|in)([-_]|$)/i.test(v.lang) || /indonesia/i.test(v.name);
  const ids = voices.filter(isId);
  return ids.find((v) => v.localService) ?? ids[0] ?? null;
}

export interface SpeakHandlers {
  onEnd?: () => void;
  /** Reading failed; message is shown to the student, optionally with a link (e.g. open in Chrome). */
  onError?: (message: string, link?: { label: string; href: string }) => void;
  /** Reading works but with a caveat (e.g. no Indonesian voice installed). */
  onInfo?: (message: string) => void;
}

export const MSG_NO_ID_VOICE =
  'HP-mu belum punya suara Bahasa Indonesia, jadi dibacakan dengan suara bawaan. Pasang di Setelan → Bahasa → Output text-to-speech → Google → Bahasa Indonesia.';
export const MSG_SILENT =
  'Suara tidak keluar. Coba naikkan volume media, matikan mode senyap, lalu ketuk lagi. Jika tetap diam, pasang aplikasi "Speech Services by Google" dari Play Store.';

export const MSG_SAMSUNG =
  'Browser Samsung Internet belum bisa membacakan suara. Buka SegiempatKu di Chrome, atau pakai aplikasi SegiempatKu (APK).';

/** Samsung Internet (Android) exposes speechSynthesis but usually produces no sound. */
export const isSamsungInternet = (ua: string): boolean => /SamsungBrowser/i.test(ua);

/** Android intent link that opens this site in Chrome (falls back to the same page). */
export function chromeIntentUrl(href: string): string {
  const url = new URL(href);
  return `intent://${url.host}${url.pathname}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
}

let voicesCache: SpeechSynthesisVoice[] = [];
let session = 0;
/** Keep utterances referenced: Chrome may garbage-collect them and never fire onend. */
let live: SpeechSynthesisUtterance[] = [];

function webSynth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

// Voices load asynchronously (empty on the first call in Chrome): warm them up early.
const initSynth = webSynth();
if (initSynth) {
  const load = () => {
    const v = initSynth.getVoices();
    if (v.length) voicesCache = v;
  };
  load();
  initSynth.addEventListener?.('voiceschanged', load);
}

/**
 * Browser reading. Exported with an injectable synth/voices for unit tests.
 * `watchdogMs`: if nothing has started by then, report MSG_SILENT.
 */
export function speakWeb(
  synth: SpeechSynthesis,
  voices: SpeechSynthesisVoice[],
  text: string,
  h: SpeakHandlers = {},
  Utterance: typeof SpeechSynthesisUtterance = SpeechSynthesisUtterance,
  watchdogMs = 3500,
): void {
  const token = ++session;
  const chunks = splitForSpeech(toSpeech(text));
  const voice = pickVoice(voices);
  if (!voice && voices.length > 0) h.onInfo?.(MSG_NO_ID_VOICE);
  let started = false;
  let done = false;
  live = [];

  const finish = (err?: string) => {
    if (done || token !== session) return;
    done = true;
    if (err) h.onError?.(err);
    else h.onEnd?.();
  };

  const play = (i: number, useLang: boolean) => {
    if (token !== session || done) return;
    if (i >= chunks.length) return finish();
    const u = new Utterance(chunks[i]);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang.replace('_', '-');
    } else if (useLang) u.lang = 'id-ID';
    u.rate = 0.95;
    u.onstart = () => {
      started = true;
    };
    u.onend = () => {
      started = true;
      play(i + 1, useLang);
    };
    u.onerror = (e: SpeechSynthesisErrorEvent) => {
      if (token !== session) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return finish();
      // No Indonesian voice: Chrome refuses "id-ID". Retry with the default voice.
      if (useLang && !voice && !started) {
        h.onInfo?.(MSG_NO_ID_VOICE);
        return play(i, false);
      }
      finish(MSG_SILENT);
    };
    live.push(u);
    synth.speak(u);
  };

  synth.resume?.();
  if (synth.speaking || synth.pending) {
    // Chrome Android drops an utterance queued right after cancel(): wait a moment.
    synth.cancel();
    setTimeout(() => play(0, true), 150);
  } else play(0, true);

  if (watchdogMs > 0)
    setTimeout(() => {
      if (token === session && !done && !started && !synth.speaking) {
        synth.cancel();
        finish(MSG_SILENT);
      }
    }, watchdogMs);
}

export const speechSupported = (): boolean => Capacitor.isNativePlatform() || webSynth() !== null;

export async function speak(text: string, h: SpeakHandlers = {}): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const spoken = toSpeech(text);
    try {
      await TextToSpeech.stop();
      const { supported } = await TextToSpeech.isLanguageSupported({ lang: 'id-ID' }).catch(() => ({ supported: true }));
      if (!supported) h.onInfo?.(MSG_NO_ID_VOICE);
      await TextToSpeech.speak({ text: spoken, lang: supported ? 'id-ID' : 'en-US', rate: 0.95, category: 'playback' });
      h.onEnd?.();
    } catch {
      h.onError?.(MSG_SILENT);
    }
    return;
  }
  const synth = webSynth();
  if (!synth) return h.onError?.(MSG_SILENT);
  const voices = voicesCache.length ? voicesCache : synth.getVoices();
  if (isSamsungInternet(navigator.userAgent)) {
    // Still try (newer versions may work), but explain the real fix if it stays silent.
    return speakWeb(synth, voices, text, {
      ...h,
      onError: () => h.onError?.(MSG_SAMSUNG, { label: 'Buka di Chrome', href: chromeIntentUrl(window.location.href) }),
    });
  }
  speakWeb(synth, voices, text, h);
}

export async function stopSpeaking(): Promise<void> {
  session++;
  if (Capacitor.isNativePlatform()) await TextToSpeech.stop().catch(() => undefined);
  else webSynth()?.cancel();
}
