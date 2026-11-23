import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler, { CF_DEFAULT_MODEL, isAllowedOrigin, pickProvider } from '../functions/tanya.mts';

const CF_ACCOUNT = '0123456789abcdef0123456789abcdef';

describe('pickProvider', () => {
  it('prefers the free Cloudflare Workers AI, then DeepSeek, else none', () => {
    const cf = pickProvider({ CF_ACCOUNT_ID: CF_ACCOUNT, CF_API_TOKEN: 'cf-token', DEEPSEEK_API_KEY: 'ds' })!;
    expect(cf.name).toBe('cloudflare');
    expect(cf.url).toBe(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/ai/v1/chat/completions`);
    expect(cf.model).toBe(CF_DEFAULT_MODEL);
    expect(pickProvider({ DEEPSEEK_API_KEY: 'ds' })!.name).toBe('deepseek');
    expect(pickProvider({})).toBeNull();
  });
  it('rejects a malformed account id (it is placed in the URL)', () => {
    expect(pickProvider({ CF_ACCOUNT_ID: '../evil', CF_API_TOKEN: 't' })).toBeNull();
  });
});

describe('tanya function with Cloudflare', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.CF_ACCOUNT_ID;
    delete process.env.CF_API_TOKEN;
  });
  it('calls Workers AI with the token and hides any thinking text', async () => {
    process.env.CF_ACCOUNT_ID = CF_ACCOUNT;
    process.env.CF_API_TOKEN = 'cf-token';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: '<think>rahasia</think>\nTAHAP: Memahami situasi\nApa yang ditanya?' } }] }), { status: 200 }),
    );
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(await res.json()).toEqual({ reply: 'Apa yang ditanya?', stage: 'orientasi' });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/ai/v1/chat/completions');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer cf-token');
  });
  it('explains when the free daily quota is used up', async () => {
    process.env.CF_ACCOUNT_ID = CF_ACCOUNT;
    process.env.CF_API_TOKEN = 'cf-token';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('limit', { status: 429 }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(((await res.json()) as { error: string }).error).toContain('habis');
  });
});

const body = {
  context: { topic: 'Persegi panjang', question: 'Keliling 9 × 4?', correctAnswer: '26 cm', solutionSteps: ['K = 2 × (9 + 4) = 26 cm.'], attempts: 0, solutionShown: false },
  messages: [{ role: 'user', content: 'Aku bingung mulai dari mana.' }],
};

const request = (origin: string, payload: unknown = body, method = 'POST') =>
  new Request('https://segiempatku.netlify.app/api/tanya', {
    method,
    headers: { origin, 'Content-Type': 'application/json', 'x-nf-client-connection-ip': `1.2.3.${Math.floor(Math.random() * 250)}` },
    body: method === 'POST' ? JSON.stringify(payload) : undefined,
  });

describe('isAllowedOrigin', () => {
  it('allows the web app, the Android app and localhost only', () => {
    expect(isAllowedOrigin('https://segiempatku.netlify.app')).toBe(true);
    expect(isAllowedOrigin('https://localhost')).toBe(true);
    expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
    expect(isAllowedOrigin('https://abc123--segiempatku.netlify.app')).toBe(true);
    expect(isAllowedOrigin('https://evil.example.com')).toBe(false);
    expect(isAllowedOrigin('https://segiempatku.netlify.app.evil.com')).toBe(false);
    expect(isAllowedOrigin('')).toBe(false);
  });
});

describe('tanya function', () => {
  beforeEach(() => {
    process.env.DEEPSEEK_API_KEY = 'test-key';
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.DEEPSEEK_API_KEY;
  });

  it('forwards to DeepSeek with the server-side key and returns a clean reply', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: '**Coba** ingat: keliling itu pinggiran.' } }] }), { status: 200 }),
    );
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: 'Coba ingat: keliling itu pinggiran.', stage: null });
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://segiempatku.netlify.app');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
    const sent = JSON.parse(init.body as string);
    expect(sent.model).toBe('deepseek-flash');
    expect(sent.messages[0].role).toBe('system');
  });

  it('rejects unknown origins without calling DeepSeek', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const res = await handler(request('https://evil.example.com'));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a missing key clearly', async () => {
    delete process.env.DEEPSEEK_API_KEY;
    const res = await handler(request('https://localhost'));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: 'not-configured' });
  });

  it('rejects invalid requests', async () => {
    const res = await handler(request('https://localhost', { context: {}, messages: [] }));
    expect(res.status).toBe(400);
  });

  it('answers CORS preflight for the Android app', async () => {
    const res = await handler(request('https://localhost', undefined, 'OPTIONS'));
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://localhost');
  });

  it('explains an empty DeepSeek balance', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Insufficient Balance', { status: 402 }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handler(request('https://segiempatku.netlify.app'));
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toContain('sudah habis');
  });
});

describe('tanya function — RMT stage', () => {
  beforeEach(() => {
    process.env.DEEPSEEK_API_KEY = 'test-key';
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.DEEPSEEK_API_KEY;
  });
  it('returns the RMT stage the model reports and passes the hint level into the prompt', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'TAHAP: Mendefinisikan masalah' + String.fromCharCode(10) + 'Apa yang ditanya di soal ini?' } }] }), { status: 200 }),
    );
    const res = await handler(request('https://segiempatku.netlify.app', { ...body, guidance: { difficulty: 'mulai', level: 2 } }));
    expect(await res.json()).toEqual({ reply: 'Apa yang ditanya di soal ini?', stage: 'definisi' });
    const sent = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(sent.messages[0].content).toContain('Tingkat bantuan SEKARANG: 2');
    expect(sent.messages[0].content).toContain('Aku tidak tahu mulai dari mana');
  });
});
