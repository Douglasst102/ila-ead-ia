# Relatório consolidado de testes (incremental)

**Última execução:** 2026-10-01 10:45 (UTC-3)  
**Ambiente:** Docker Desktop (Windows); stack `sad-ila` no host; Jest em `node:20-alpine` com `host.docker.internal`  
**Comando:** `npm test` em `/app/testing` (ver `test-strategy.md`)

---

## Story validada nesta rodada

| Campo | Valor |
|-------|--------|
| **US** | US-002 — Ambiente Docker e health checks |
| **Exit code** | 0 |

---

## 1. Acumulado por User Story

| User Story | Unitário | Integração | E2E | **Subtotal** | Observação |
|------------|----------|------------|-----|--------------|------------|
| US-001 | 0 | 0 | 0 | **0** | Login ainda não implementado — sem testes |
| **US-002** | **6** | **7** | **0** | **13** | Ver detalhamento abaixo |
| **Total geral** | **6** | **7** | **0** | **13** | |

### US-002 — detalhe desta rodada

| Nível | Passou | Falhou | Pulado | Total |
|-------|--------|--------|--------|-------|
| Unitário | 6 | 0 | 0 | 6 |
| Integração | 6 | 0 | 1 | 7 |
| E2E | — | — | — | 0 |

**Suites:** 5 passed, 5 total · **Tempo:** ~7,2 s

| Teste | AC | Resultado |
|-------|-----|-----------|
| `api-config` ×3 | AC 02 / env | ✅ |
| `migration-path` ×3 | segurança migrações | ✅ |
| `us-002-ac01-health` ×2 | AC 01 | ✅ |
| `us-002-ac01-health` 503 ApiError | opcional | ⏭ skip (sem `API_URL_BROKEN_MINIO`) |
| `us-002-ac02-env` ×3 | AC 02 | ✅ |
| `us-002-web-smoke` ×1 | AC 01 | ✅ |

---

## 2. Histórico incremental (somatório após cada US)

| Data | US entregue | +Testes | **Total acumulado** | Status |
|------|-------------|---------|---------------------|--------|
| 2026-10-01 | US-002 | 13 | **13** | ✅ Verde |

*(Próxima linha esperada: US-001 ou US-003 conforme ordem de implementação.)*

---

## 3. Falhas e bugs

Nenhuma falha nesta execução.  
Bugs: ver `bug-reports.md` (vazio).

---

## 4. Cobertura

Cobertura Jest (`--coverage`) não executada nesta rodada — smoke e contratos prioritários para US-002.  
Próximo passo: habilitar cobertura no CI quando US-003 consolidar API.

---

## 5. Regressões

N/A — primeira rodada documentada com suíte cumulativa (apenas US-002).

---

## 6. Como reproduzir

```powershell
# Na raiz do repo (stack no ar)
docker run --rm -v "${PWD}:/app" -w /app/testing --add-host=host.docker.internal:host-gateway `
  -e API_URL=http://host.docker.internal:3001 `
  -e WEB_URL=http://host.docker.internal:3000 `
  node:20-alpine sh -c "npm ci && npm test"
```

Smoke rápido (só HTTP):

```powershell
cd testing; npm run test:smoke-compose
```
