import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAllowedOrigin } from './http';
import { bindingCaller, CF_DEFAULT_MODEL } from './model';
import { callerFromEnv } from './pages';
import { handleTanya } from './tanya';

const input = { messages: [{ role: 'user' as const, content: 'halo' }], temperature: 0, max_tokens: 10 };

describe('bindingCaller (Cloudflare Pages Workers AI binding)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('reads both response shapes and hides thinking', async () => {
    const a = bindingCaller({ run: async () => ({ response: '<think>x</think>Halo!' }) });
    expect(await a.call(input, 1000)).toEqual({ status: 200, content: 'Halo!' });
    const b = bindingCaller({ run: async () => ({ choices: [{ message: { content: 'Hai' } }] }) });
    expect(await b.call(input, 1000)).toEqual({ status: 200, content: 'Hai' });
  });

  it('passes the model and switches thinking off', async () => {
    const run = vi.fn(async () => ({ response: 'ok' }));
    await bindingCaller({ run }).call(input, 1000);
    expect(run).toHaveBeenCalledWith(CF_DEFAULT_MODEL, expect.objectContaining({ chat_template_kwargs: { enable_thinking: false }, max_tokens: 10 }));
  });

  it('reports a used-up daily allocation as 429', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const c = bindingCaller({
      run: async () => {
        throw new Error('3036: Account limited: you have used up your daily free allocation of 10,000 neurons');
      },
    });
    expect((await c.call(input, 1000)).status).toBe(429);
  });
});

describe('callerFromEnv', () => {
  it('prefers the AI binding, then REST tokens, else nothing', () => {
    expect(callerFromEnv({ AI: { run: async () => ({}) } })?.name).toBe('binding');
    expect(callerFromEnv({ CF_ACCOUNT_ID: '0123456789abcdef0123456789abcdef', CF_API_TOKEN: 't' })?.name).toBe('cloudflare');
    expect(callerFromEnv({ DEEPSEEK_API_KEY: 'k' })?.vision).toBe(false);
    expect(callerFromEnv({})).toBeNull();
  });
});

describe('Cloudflare Pages origin and tutor route', () => {
  it('allows the Pages site and its previews', () => {
    expect(isAllowedOrigin('https://segiempatku.pages.dev')).toBe(true);
    expect(isAllowedOrigin('https://abc123.segiempatku.pages.dev')).toBe(true);
    expect(isAllowedOrigin('https://segiempatku.pages.dev.evil.com')).toBe(false);
  });

  it('answers through the binding', async () => {
    const caller = bindingCaller({ run: async () => ({ response: 'TAHAP: Memahami situasi\nApa yang ditanya?' }) });
    const req = new Request('https://segiempatku.pages.dev/api/tanya', {
      method: 'POST',
      headers: { origin: 'https://segiempatku.pages.dev', 'Content-Type': 'application/json', 'cf-connecting-ip': '5.5.5.5' },
      body: JSON.stringify({
        context: { topic: 'Persegi', question: 'Keliling 4 × 4?', correctAnswer: '16 cm', solutionSteps: ['K = 4 × 4'], attempts: 0, solutionShown: false },
        messages: [{ role: 'user', content: 'bingung' }],
      }),
    });
    const res = await handleTanya(req, caller);
    expect(await res.json()).toEqual({ reply: 'Apa yang ditanya?', stage: 'orientasi' });
  });
});
