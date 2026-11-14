// GET /api/health: a tiny check that a deploy is live and which environment it is.
// Returns only non-secret facts. Never add DATABASE_URL, SESSION_SECRET or any other
// secret to this response (a test checks this).
export default async function health() {
  return Response.json(
    {
      status: 'ok',
      env: process.env.APP_ENV || 'unknown',
      time: new Date().toISOString(),
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export const config = { path: '/api/health' };
