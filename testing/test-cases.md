# Casos de teste acumulados

## US-001 — Login (pendente implementação)

| ID | AC | Automatizado | Arquivo |
|----|-----|--------------|---------|
| — | — | Não | — |

## US-002 — Ambiente Docker e health checks

| ID | AC | Cenário | Automatizado | Arquivo |
|----|-----|---------|--------------|---------|
| TC-002-01 | AC 01 | `GET /health` → 200 | Sim | `integration/us-002-ac01-health.spec.ts` |
| TC-002-02 | AC 01 | `GET /ready` → 200 + checks | Sim | idem |
| TC-002-03 | AC 01 | Web `GET /` → 200 | Sim | `integration/us-002-web-smoke.spec.ts` |
| TC-002-04 | AC 02 | `.gitignore` ignora `.env` | Sim | `integration/us-002-ac02-env.spec.ts` |
| TC-002-05 | AC 02 | `.env.example` documentado | Sim | idem |
| TC-002-06 | — | Normalização `NEXT_PUBLIC_API_URL` | Sim | `unit/api-config.spec.ts` |
| TC-002-07 | — | Validação path migrações SQL | Sim | `unit/migration-path.spec.js` |
| TC-002-08 | — | 503 `/ready` ApiError (opcional) | Skip sem `API_URL_BROKEN_MINIO` | `us-002-ac01-health.spec.ts` |
