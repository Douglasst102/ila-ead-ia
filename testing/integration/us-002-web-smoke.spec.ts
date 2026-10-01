/**
 * US-002 AC 01 — WebApp acessível (requer container web no ar).
 */
const WEB_URL = (process.env.WEB_URL ?? 'http://localhost:3000').replace(/\/$/, '');

describe('US-002 AC 01: Frontend no Compose', () => {
  it('GET / na Web retorna 200', async () => {
    const res = await fetch(WEB_URL);
    expect(res.status).toBe(200);
  });
});
