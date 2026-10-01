# Estratégia de testes — SAD-ILA

**Versão:** 1.0 · **Atualizado:** 2026-10-01

## Pirâmide

| Nível | Ferramenta | Pasta | Quando |
|-------|------------|-------|--------|
| Unitário | Jest | `testing/unit/` | Lógica pura, helpers, validações |
| Integração | Jest + fetch/fs | `testing/integration/` | Contratos HTTP, artefatos repo, smoke Compose |
| E2E | Playwright | `testing/e2e/` | Jornadas completas no browser (a partir de US com UI crítica) |

## Execução (Windows + Docker Desktop)

Stack de app no ar (`docker compose up`). Testes Jest no container Node:

```powershell
docker run --rm `
  -v "${PWD}:/app" -w /app/testing `
  --add-host=host.docker.internal:host-gateway `
  -e API_URL=http://host.docker.internal:3001 `
  -e WEB_URL=http://host.docker.internal:3000 `
  node:20-alpine sh -c "npm ci && npm test"
```

Local (com Node 20+): `cd testing && npm ci && npm test`

## Acumulação por User Story

Cada US adiciona testes sem remover os anteriores. Relatório incremental em `testing/test-results.md`.
