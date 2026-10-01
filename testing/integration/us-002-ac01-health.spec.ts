/**
 * US-002 AC 01 — stack / health / readiness (requer API no ar).
 */
const API_URL = (process.env.API_URL ?? 'http://localhost:3001').replace(/\/$/, '');

type ReadyBody = {
  status: string;
  checks?: { postgres?: boolean; minio?: boolean; rabbitmq?: boolean };
};

async function fetchJson(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  const body = await res.json();
  return { status: res.status, body };
}

describe('US-002 AC 01: Stack e health checks', () => {
  it('GET /health retorna 200 (liveness, sem DB)', async () => {
    const { status, body } = await fetchJson('/health');
    expect(status).toBe(200);
    expect(body.status).toBe('ok');
  });

  it('GET /ready retorna 200 com Postgres Must e Should MinIO/RabbitMQ', async () => {
    const { status, body } = await fetchJson('/ready');
    const ready = body as ReadyBody;
    expect(status).toBe(200);
    expect(ready.status).toBe('ready');
    expect(ready.checks?.postgres).toBe(true);
    expect(ready.checks?.minio).toBe(true);
    expect(ready.checks?.rabbitmq).toBe(true);
  });

  it('GET /ready 503 expõe ApiError quando API_URL_BROKEN_MINIO definido', async () => {
    const brokenUrl = process.env.API_URL_BROKEN_MINIO;
    if (!brokenUrl) {
      return;
    }
    const res = await fetch(`${brokenUrl.replace(/\/$/, '')}/ready`);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.code).toBe('SERVICE_NOT_READY');
    expect(typeof body.correlationId).toBe('string');
  });
});
