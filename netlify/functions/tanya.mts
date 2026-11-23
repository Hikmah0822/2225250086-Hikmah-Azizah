/**
 * Netlify Function: POST /api/tanya — "Tanya Beru" AI tutor (old host; the app now uses
 * Cloudflare Pages, see `functions/`). Logic lives in `server/tanya.ts`.
 * Provider from Netlify environment variables: CF_ACCOUNT_ID + CF_API_TOKEN (free Workers AI)
 * or DEEPSEEK_API_KEY (paid). Without either, the app uses Beru's free guided mode.
 */
import { pickProvider, restCaller } from '../../server/model';
import { handleTanya } from '../../server/tanya';

export { CF_DEFAULT_MODEL, pickProvider } from '../../server/model';
export { isAllowedOrigin, rateLimited } from '../../server/http';

export default async function handler(req: Request): Promise<Response> {
  const provider = pickProvider(process.env);
  return handleTanya(req, provider ? restCaller(provider) : null);
}

export const config = { path: '/api/tanya' };
