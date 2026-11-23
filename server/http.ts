/** Origin check, CORS, JSON responses and a simple rate limit, shared by every API route. */

/** Web app (Cloudflare Pages, old Netlify site), Android app (Capacitor: https://localhost) and local development. */
export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (['https://segiempatku.pages.dev', 'https://segiempatku.netlify.app', 'https://localhost', 'http://localhost'].includes(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  // Cloudflare Pages previews: https://<hash>.segiempatku.pages.dev
  if (/^https:\/\/[a-z0-9-]+\.segiempatku\.pages\.dev$/.test(origin)) return true;
  // Netlify deploy previews: https://<id>--segiempatku.netlify.app
  return /^https:\/\/[a-z0-9-]+--segiempatku\.netlify\.app$/.test(origin);
}

export function corsHeaders(origin: string): Record<string, string> {
  return isAllowedOrigin(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : {};
}

export const json = (status: number, body: unknown, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });

/** Client address on Netlify or Cloudflare. */
export const clientId = (req: Request) =>
  req.headers.get('cf-connecting-ip') ?? req.headers.get('x-nf-client-connection-ip') ?? req.headers.get('x-forwarded-for') ?? 'unknown';

// Best-effort rate limit per client (resets when the server instance restarts).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 40;
const hits = new Map<string, number[]>();
export function rateLimited(client: string, now = Date.now()): boolean {
  const recent = (hits.get(client) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(client, recent);
  return recent.length > MAX_REQUESTS;
}

export const QUOTA_MESSAGE = 'Jatah AI Beru hari ini sudah habis. Pakai tombol bimbingan dulu, ya. Besok bisa lagi.';
