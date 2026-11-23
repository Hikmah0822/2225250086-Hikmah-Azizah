/**
 * How the server reaches the AI model. Shared by the Cloudflare Pages Functions (`functions/`)
 * and the older Netlify Functions (`netlify/functions/`).
 *  - binding: Cloudflare Workers AI bound to the Pages project (free daily allocation; no token).
 *  - cloudflare: Workers AI REST API (CF_ACCOUNT_ID + CF_API_TOKEN), e.g. from Netlify.
 *  - deepseek: paid fallback (DEEPSEEK_API_KEY); text only.
 * Keys only ever live in the hosting provider's environment, never in the app.
 */
export type ChatPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string; detail?: 'auto' | 'low' | 'high' } };
export interface ChatMessageIn {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatPart[];
}

export interface ModelInput {
  messages: ChatMessageIn[];
  temperature: number;
  max_tokens: number;
}

/** status 200 = ok; 402/429 = quota used up; anything else = provider error. */
export interface ModelResult {
  status: number;
  content: string;
}

export interface ModelCaller {
  name: 'binding' | 'cloudflare' | 'deepseek';
  model: string;
  /** Can read images (Foto Soal). */
  vision: boolean;
  call(input: ModelInput, timeoutMs: number): Promise<ModelResult>;
}

/** Good Indonesian, reads images, ~18 Neurons per tutor reply → about 500 free questions a day. */
export const CF_DEFAULT_MODEL = '@cf/google/gemma-4-26b-a4b-it';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export interface Provider {
  name: 'cloudflare' | 'deepseek';
  url: string;
  key: string;
  model: string;
}

export type Env = Record<string, string | undefined>;

/** Cloudflare (free) first, then DeepSeek (paid). Null = not configured. */
export function pickProvider(env: Env): Provider | null {
  const account = env.CF_ACCOUNT_ID?.trim();
  const token = env.CF_API_TOKEN?.trim();
  // The account id goes into the URL, so accept only its real format (32 hex characters).
  if (account && token && /^[0-9a-f]{32}$/i.test(account)) {
    return {
      name: 'cloudflare',
      url: `https://api.cloudflare.com/client/v4/accounts/${account}/ai/v1/chat/completions`,
      key: token,
      model: env.CF_AI_MODEL?.trim() || CF_DEFAULT_MODEL,
    };
  }
  const deepseek = env.DEEPSEEK_API_KEY?.trim();
  if (deepseek) return { name: 'deepseek', url: DEEPSEEK_URL, key: deepseek, model: env.DEEPSEEK_MODEL?.trim() || 'deepseek-flash' };
  return null;
}

/** Strip a reasoning model's hidden thinking. */
const noThinking = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, '');

/** OpenAI-compatible REST call (Workers AI REST or DeepSeek). */
export function restCaller(p: Provider): ModelCaller {
  return {
    name: p.name,
    model: p.model,
    vision: p.name === 'cloudflare',
    async call(input, timeoutMs) {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${p.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: p.model,
          ...input,
          // Reasoning models think before answering; switch thinking off on Workers AI.
          ...(p.name === 'cloudflare' ? { chat_template_kwargs: { enable_thinking: false } } : {}),
          stream: false,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) {
        // Status and provider message only; never the student's text or photo.
        console.error(`${p.name} error`, res.status, (await res.text()).slice(0, 300));
        return { status: res.status, content: '' };
      }
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return { status: 200, content: noThinking(data.choices?.[0]?.message?.content ?? '') };
    },
  };
}

/** The Workers AI binding of a Cloudflare Pages project (`env.AI`). */
export interface AiBinding {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

export function bindingCaller(ai: AiBinding, model = CF_DEFAULT_MODEL): ModelCaller {
  return {
    name: 'binding',
    model,
    vision: true,
    async call(input, timeoutMs) {
      try {
        const out = await Promise.race([
          ai.run(model, { ...input, chat_template_kwargs: { enable_thinking: false } }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
        ]);
        const o = (out ?? {}) as { response?: unknown; choices?: { message?: { content?: unknown } }[] };
        const text = typeof o.response === 'string' ? o.response : o.choices?.[0]?.message?.content;
        return { status: 200, content: noThinking(typeof text === 'string' ? text : '') };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('workers-ai error', msg.slice(0, 300));
        if (msg === 'timeout') throw e;
        // Daily free allocation used up / rate limited.
        return { status: /allocation|neuron|limit|429|capacity/i.test(msg) ? 429 : 502, content: '' };
      }
    },
  };
}
