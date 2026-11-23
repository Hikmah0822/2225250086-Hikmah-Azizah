/** POST /api/tanya — "Tanya Beru" AI tutor (chat). */
import { buildTutorMessages, cleanReply, parseReply, validateTutorRequest } from '../src/lib/tutorPrompt';
import { QUOTA_MESSAGE, clientId, corsHeaders, isAllowedOrigin, json, rateLimited } from './http';
import type { ModelCaller } from './model';

export async function handleTanya(req: Request, caller: ModelCaller | null): Promise<Response> {
  const origin = req.headers.get('origin') ?? '';
  const cors = corsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'Metode tidak diizinkan.' }, cors);
  if (!isAllowedOrigin(origin)) return json(403, { error: 'Akses ditolak.' }, cors);
  if (!caller) return json(503, { error: 'not-configured' }, cors);
  if (rateLimited(clientId(req))) return json(429, { error: 'Beru perlu istirahat sebentar. Coba lagi beberapa menit lagi, ya.' }, cors);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Format permintaan tidak valid.' }, cors);
  }
  const checked = validateTutorRequest(body);
  if (!checked.ok) return json(400, { error: checked.error }, cors);

  try {
    const res = await caller.call(
      {
        messages: buildTutorMessages(checked.value),
        temperature: 0.4,
        // Workers AI: room in case thinking stays on; DeepSeek replies are short.
        max_tokens: caller.name === 'deepseek' ? 350 : 1500,
      },
      25000,
    );
    if (res.status !== 200) {
      const message = res.status === 402 || res.status === 429 ? QUOTA_MESSAGE : 'Beru sedang tidak bisa dihubungi. Coba lagi nanti.';
      return json(502, { error: message }, cors);
    }
    const { stage, reply: raw } = parseReply(res.content);
    const reply = cleanReply(raw);
    if (!reply) {
      console.error('Empty reply', caller.name, caller.model);
      return json(502, { error: 'Beru tidak menemukan jawaban. Coba tanya dengan kalimat lain.' }, cors);
    }
    return json(200, { reply, stage }, cors);
  } catch (e) {
    console.error('Tutor request failed', e instanceof Error ? e.message : 'unknown');
    return json(504, { error: 'Beru terlalu lama berpikir. Coba lagi, ya.' }, cors);
  }
}
