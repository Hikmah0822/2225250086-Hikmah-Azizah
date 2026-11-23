/** Cloudflare Pages Function: POST /api/tanya — "Tanya Beru" (logic in server/tanya.ts). */
import { callerFromEnv, type PagesContext } from '../../server/pages';
import { handleTanya } from '../../server/tanya';

export const onRequest = (ctx: PagesContext): Promise<Response> => handleTanya(ctx.request, callerFromEnv(ctx.env));
