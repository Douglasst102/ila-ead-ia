/**
 * US-002 — normalização de NEXT_PUBLIC_API_URL (CON-007).
 */
import {
  getApiOrigin,
  getApiV1BaseUrl,
  normalizeApiV1Base,
} from '../../apps/web/lib/api-config';

describe('api-config (US-002)', () => {
  const envKey = 'NEXT_PUBLIC_API_URL';

  afterEach(() => {
    delete process.env[envKey];
  });

  it('AC 02 / integração: normaliza URL legada sem /api/v1', () => {
    expect(normalizeApiV1Base('http://localhost:3001')).toBe(
      'http://localhost:3001/api/v1',
    );
  });

  it('mantém URL já versionada', () => {
    expect(normalizeApiV1Base('http://localhost:3001/api/v1/')).toBe(
      'http://localhost:3001/api/v1',
    );
  });

  it('getApiOrigin deriva host para /health', () => {
    process.env[envKey] = 'http://localhost:3001/api/v1';
    expect(getApiOrigin()).toBe('http://localhost:3001');
    expect(getApiV1BaseUrl()).toBe('http://localhost:3001/api/v1');
  });
});
