/**
 * Netlify Function: POST /api/foto-soal — "Foto Soal" (old host; the app now uses Cloudflare
 * Pages, see `functions/`). Logic lives in `server/foto.ts`.
 */
import { pickProvider, restCaller } from '../../server/model';
import { handleFoto } from '../../server/foto';

export default async function handler(req: Request): Promise<Response> {
  const provider = pickProvider(process.env);
  return handleFoto(req, provider ? restCaller(provider) : null);
}

export const config = { path: '/api/foto-soal' };
