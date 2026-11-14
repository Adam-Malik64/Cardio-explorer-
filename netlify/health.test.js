// @vitest-environment node
// Tests for the /api/health Netlify Function. (Kept outside netlify/functions/, because
// Netlify deploys every file in that folder as a function.)
import { afterEach, describe, expect, it, vi } from 'vitest';
import health, { config } from './functions/health.mjs';

afterEach(() => vi.unstubAllEnvs());

describe('/api/health', () => {
  it('is routed to /api/health', () => {
    expect(config.path).toBe('/api/health');
  });

  it('returns ok, the environment name and a timestamp as uncached JSON', async () => {
    vi.stubEnv('APP_ENV', 'staging');
    const res = await health();
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/application\/json/);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const body = await res.json();
    expect(body).toEqual({ status: 'ok', env: 'staging', time: expect.any(String) });
    expect(Number.isNaN(Date.parse(body.time))).toBe(false);
  });

  it('reports "unknown" when APP_ENV is not set', async () => {
    vi.stubEnv('APP_ENV', '');
    expect((await (await health()).json()).env).toBe('unknown');
  });

  it('never leaks secret values', async () => {
    const secrets = {
      DATABASE_URL: 'postgres://user:pa55@db/x',
      SESSION_SECRET: 'session-shh',
      TURNSTILE_SECRET_KEY: 'turnstile-shh',
      STRIPE_SECRET_KEY: 'sk_test_shh',
      STRIPE_WEBHOOK_SECRET: 'whsec_shh',
      NETLIFY_AUTH_TOKEN: 'nfp_shh',
    };
    for (const [k, v] of Object.entries(secrets)) vi.stubEnv(k, v);
    const text = await (await health()).text();
    for (const v of Object.values(secrets)) expect(text).not.toContain(v);
  });
});
