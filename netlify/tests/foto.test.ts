import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../functions/foto.mts';

const IMG = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

const request = (origin: string, payload: unknown = { image: IMG }) =>
  new Request('https://segiempatku.netlify.app/api/foto-soal', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json', 'x-nf-client-connection-ip': `9.9.9.${Math.floor(Math.random() * 250)}` },
    body: JSON.stringify(payload),
  });

const answer = {
  status: 'ok',
  question: 'Persegi panjang 9 cm × 4 cm. Berapa kelilingnya?',
  known: ['p = 9 cm', 'l = 4 cm'],
  asked: 'keliling',
  steps: [{ stage: 'laksana', text: 'K = 2 × (9 + 4) = 26 cm.' }],
  finalAnswer: '26 cm',
  check: 'Keliling lebih besar dari 2 × 9.',
};

describe('foto-soal function', () => {
  beforeEach(() => {
    process.env.CF_ACCOUNT_ID = '0123456789abcdef0123456789abcdef';
    process.env.CF_API_TOKEN = 'cf-token';
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.CF_ACCOUNT_ID;
    delete process.env.CF_API_TOKEN;
    delete process.env.DEEPSEEK_API_KEY;
  });

  it('sends the photo to the vision model and returns the parsed solution', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(answer) } }] }), { status: 200 }),
    );
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { kind: string; solution: { finalAnswer: string } };
    expect(body.kind).toBe('solution');
    expect(body.solution.finalAnswer).toBe('26 cm');
    const sent = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(JSON.stringify(sent.messages[1].content)).toContain('image_url');
  });

  it('rejects unknown origins and bad images without calling the AI', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    expect((await handler(request('https://evil.example.com'))).status).toBe(403);
    expect((await handler(request('https://localhost', { image: 'not-an-image' }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('needs Cloudflare (DeepSeek cannot read images)', async () => {
    delete process.env.CF_ACCOUNT_ID;
    delete process.env.CF_API_TOKEN;
    process.env.DEEPSEEK_API_KEY = 'ds';
    const res = await handler(request('https://localhost'));
    expect(res.status).toBe(503);
  });

  it('asks once more when the model corrects itself mid-solution', async () => {
    const wrong = { ...answer, steps: [{ stage: 'laksana', text: 'x = 13. Tunggu, mari hitung ulang: x = 10.' }] };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(wrong) } }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(answer) } }] }), { status: 200 }));
    const res = await handler(request('https://segiempatku.netlify.app'));
    const body = (await res.json()) as { solution: { steps: { text: string }[] } };
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(body.solution.steps[0].text).not.toContain('Tunggu');
  });

  it('explains an unusable model reply', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: 'maaf' } }] }), { status: 200 }));
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toContain('foto ulang');
  });
});
