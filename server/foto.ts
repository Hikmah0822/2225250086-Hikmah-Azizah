/**
 * POST /api/foto-soal — "Foto Soal": the vision model reads a photographed segiempat problem
 * and returns a worked solution in RMT stages, with an illustration spec. The photo is
 * forwarded once and never stored or logged.
 */
import { buildPhotoMessages, hasSelfCorrection, parsePhotoReply, RETRY_MESSAGE, validatePhotoRequest } from '../src/lib/photoSolve';
import { QUOTA_MESSAGE, clientId, corsHeaders, isAllowedOrigin, json, rateLimited } from './http';
import type { ChatMessageIn, ModelCaller } from './model';

export async function handleFoto(req: Request, caller: ModelCaller | null): Promise<Response> {
  const origin = req.headers.get('origin') ?? '';
  const cors = corsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'Metode tidak diizinkan.' }, cors);
  if (!isAllowedOrigin(origin)) return json(403, { error: 'Akses ditolak.' }, cors);
  // DeepSeek cannot read images.
  if (!caller || !caller.vision) return json(503, { error: 'not-configured' }, cors);
  if (rateLimited(`foto:${clientId(req)}`)) return json(429, { error: 'Beru perlu istirahat sebentar. Coba lagi beberapa menit lagi, ya.' }, cors);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Format permintaan tidak valid.' }, cors);
  }
  const checked = validatePhotoRequest(body);
  if (!checked.ok) return json(400, { error: checked.error }, cors);

  const started = Date.now();
  const ask = (extra: ChatMessageIn[], timeoutMs: number) =>
    caller.call({ messages: [...buildPhotoMessages(checked.image), ...extra], temperature: extra.length ? 0 : 0.2, max_tokens: 2500 }, timeoutMs);

  try {
    // Reading a photo takes ~10–25 s; give up before the app's own 60 s limit.
    const first = await ask([], 45000);
    if (first.status !== 200) {
      const message = first.status === 402 || first.status === 429 ? QUOTA_MESSAGE : 'Beru sedang tidak bisa membaca foto. Coba lagi nanti.';
      return json(502, { error: message }, cors);
    }
    let parsed = parsePhotoReply(first.content);
    // The model corrected itself mid-solution ("Tunggu, hitung ulang…"): ask once more if time allows.
    const left = 50000 - (Date.now() - started);
    if (parsed?.kind === 'solution' && hasSelfCorrection(parsed.solution) && left > 12000) {
      try {
        const second = await ask(
          [
            { role: 'assistant', content: first.content },
            { role: 'user', content: RETRY_MESSAGE },
          ],
          left,
        );
        const retry = second.status === 200 ? parsePhotoReply(second.content) : null;
        if (retry?.kind === 'solution' && !hasSelfCorrection(retry.solution)) parsed = retry;
      } catch {
        // Keep the first answer if the retry is too slow.
      }
    }
    if (!parsed) return json(502, { error: 'Beru belum berhasil membaca soalnya. Coba foto ulang dengan lebih terang dan lurus.' }, cors);
    return json(200, parsed, cors);
  } catch (e) {
    console.error('foto request failed', e instanceof Error ? e.message : 'unknown');
    return json(504, { error: 'Beru terlalu lama membaca foto. Coba lagi, ya.' }, cors);
  }
}
