/**
 * Base da API BFF (integration-specs.md §2.1).
 * NEXT_PUBLIC_API_URL = origem pública + `/api/v1` (ex.: http://localhost:3001/api/v1).
 */
export function getApiV1BaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  return normalizeApiV1Base(raw);
}

/** Origem do ApiBff sem path versionado (health `/health`, `/ready`). */
export function getApiOrigin(): string {
  const base = getApiV1BaseUrl();
  return base.slice(0, -'/api/v1'.length);
}

/** Aceita `.env` legado (só host:porta) e normaliza para …/api/v1 (CON-007). */
export function normalizeApiV1Base(raw: string): string {
  let url = raw.trim().replace(/\/$/, '');
  if (!url) {
    return 'http://localhost:3001/api/v1';
  }
  if (/\/api\/v\d+$/i.test(url)) {
    return url;
  }
  return `${url}/api/v1`;
}
