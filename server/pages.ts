/**
 * Cloudflare Pages Functions glue. The project's Workers AI binding (`AI`, see wrangler.toml)
 * is used first: it needs no token and uses the account's free daily allocation.
 * Without the binding, the same env variables as before apply (CF_ACCOUNT_ID + CF_API_TOKEN,
 * or DEEPSEEK_API_KEY), set as encrypted variables in the Pages project.
 */
import { type AiBinding, type Env, type ModelCaller, bindingCaller, CF_DEFAULT_MODEL, pickProvider, restCaller } from './model';

/** The parts of a Pages Functions context that we use; `env.AI` is the Workers AI binding. */
export interface PagesContext {
  request: Request;
  env: Record<string, unknown>;
}

export function callerFromEnv(env: Record<string, unknown>): ModelCaller | null {
  const ai = env.AI as AiBinding | undefined;
  const model = typeof env.CF_AI_MODEL === 'string' && env.CF_AI_MODEL.trim() ? env.CF_AI_MODEL.trim() : CF_DEFAULT_MODEL;
  if (ai && typeof ai.run === 'function') return bindingCaller(ai, model);
  const strings: Env = {};
  for (const [k, v] of Object.entries(env)) if (typeof v === 'string') strings[k] = v;
  const provider = pickProvider(strings);
  return provider ? restCaller(provider) : null;
}
