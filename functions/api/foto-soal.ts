/** Cloudflare Pages Function: POST /api/foto-soal — "Foto Soal" (logic in server/foto.ts). */
import { callerFromEnv, type PagesContext } from '../../server/pages';
import { handleFoto } from '../../server/foto';

export const onRequest = (ctx: PagesContext): Promise<Response> => handleFoto(ctx.request, callerFromEnv(ctx.env));
