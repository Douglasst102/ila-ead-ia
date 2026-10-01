# Correções pós-revisão (2026-10-01)

| ID | Status | Resumo |
|----|--------|--------|
| CON-001 | ✅ | `data/migrations` embarcado na imagem API; context de build na raiz; prod com `DATA_MIGRATIONS_DIR` e envs BFF |
| CON-002 | ✅ | Healthcheck Compose/Dockerfile da API em `/ready` |
| CON-003 | ✅ | `schema_migrations` + apply incremental; backfill initdb |
| CON-004 | ✅ | 503 `/ready` retorna `ApiError` (`SERVICE_NOT_READY`) |
| CON-005 | ✅ | Healthcheck MinIO (HTTP via node; aceita 403) |
| CON-006 | ✅ | AC US-002 alinhado à spec (Postgres Must + Should) |
| CON-007 | ✅ | `normalizeApiV1Base` + warn no `next.config.mjs` |
| CON-008 | ✅ | Smoke asserta `checks.minio` e `rabbitmq` |
| CON-009 | ✅ | `npm ci` condicional em dev; skip sync em `NODE_ENV=production` |
| CON-010 | ✅ | `/ready` 200 sem `checks` em produção |
| CON-011 | ✅ | `db-connect.mjs` + `db-retry.constants.ts` |
| CON-012 | ✅ | Logs `debug` nos pings de readiness |

### AppSec (pós-revisão security-engineer)

| ID | Status | Resumo |
|----|--------|--------|
| SEC-US002-01–06 | ✅ | Ver `security/revisao-us-002-appsec.md` |
