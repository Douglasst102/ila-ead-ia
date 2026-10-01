# Relatório unificado — revisão US-002

## Capa

| Campo | Valor |
|-------|--------|
| **RUN_ID** | `2026-10-01-1025` |
| **Escopo** | Implementação US-002: Docker Compose, health/readiness ApiBff, migrações SQL, Prisma bootstrap, Next.js env/Dockerfile, smoke tests |
| **Estratégia** | Análise estática de arquivos (Git: apenas `README.md` / `project-context.json` committed; código US-002 majoritariamente untracked) |
| **Branch** | `main` (local) |
| **Lentes** | `regressao-impacto.md`, `seguranca.md`, `clean-code.md` — complementares: regressão cobre contrato/infra; segurança cobre bootstrap/supply chain; clean code cobre manutenção |
| **Execução** | Sequencial |

**Resumo:** A entrega **dev** está funcional (health, ready, smoke, documentação). Antes de considerar US-002 “fechada” para piloto/prod, corrigir **bootstrap de schema no Compose prod**, alinhar **503 `/ready`** ao OpenAPI, e endurecer **estratégia de migrações incrementais** e **healthchecks** do Compose.

---

## Mapa de riscos consolidado

| ID | Área | Sev. global | Resumo | Ação recomendada | Perfil | Evidência |
|----|------|-------------|--------|------------------|--------|-----------|
| CON-001 | regressão | **P0** | Prod: DDL não aplicado (sem initdb + migrations fora da imagem) | Embarcar `data/migrations` na imagem API; `DATA_MIGRATIONS_DIR`; ou initdb no Postgres prod | DevOps + dados | `docker-compose.prod.yml`; `apply-data-migrations.mjs` |
| CON-002 | regressão | P1 | Healthcheck Compose usa `/health`, não `/ready` | Opcional: probe `/ready` ou documentar semântica de healthy | DevOps | `docker-compose.dev.yml` L106-111 |
| CON-003 | regressão | P1 | Migrações SQL não incrementais após v1 | Tabela de versão ou Prisma Migrate | dados + backend | `apply-data-migrations.mjs` L43-47 |
| CON-004 | regressão | P1 | 503 `/ready` ≠ schema `ApiError` OpenAPI | Exception filter ou `@Res()` 503 + corpo documentado | backend | `health.controller.ts` L23-24 |
| CON-005 | regressão | P1 | MinIO sem healthcheck → flapping `/ready` | Healthcheck minio ou retry no smoke CI | DevOps | `docker-compose.dev.yml` L117-118 |
| CON-006 | regressão | P2 | AC US-002 vs três checks no `/ready` | Atualizar AC ou matriz de rastreio | QA + PO | `health.service.ts` L27-28 |
| CON-007 | regressão | P2 | `.env` legado sem `/api/v1` quebra health no web | Validação build + doc migração env | frontend | `api-config.ts` L11-16 |
| CON-008 | regressão | P2 | Smoke test superficial | Assert `checks.minio/rabbitmq` ou cenário 503 | QA | `health-smoke.spec.ts` |
| CON-009 | segurança | Médio | `npm install` a cada start (supply chain dev) | `npm ci` no build; entrypoint condicional | DevOps | `docker-entrypoint.sh` |
| CON-010 | segurança | Baixo | `/ready` expõe checks internos | Resposta reduzida em prod | backend | `health.service.ts` L30-33 |
| CON-011 | código | Alto | Retry Postgres duplicado | Shared helper ou responsabilidade única | backend | Prisma + migrate script |
| CON-012 | código | Médio | Pings silenciosos | Log debug | backend | `health.service.ts` catches |

---

## Simulação de impacto

**CON-001 — Schema ausente em prod**  
Operador sobe `docker-compose.prod.yml` com volume Postgres novo. Initdb não roda DDL; entrypoint procura migrations em path inexistente na imagem. API inicia, Prisma conecta, mas tabelas não existem — `/ready` retorna 503 ou falhas em US-003+. **Onde:** deploy piloto. **Por quê:** artefatos SQL só montados no dev compose.

**CON-002 — Web sobe antes de readiness “completa”**  
Compose marca API healthy via `/health` assim que Nest escuta. Web sobe; usuário vê UI enquanto `/ready` ainda 503 (ex.: RabbitMQ lento). **Onde:** homepage + integrações futuras. **Por quê:** desacoplamento liveness/readiness no orchestrator.

**CON-003 — Migração 002 nunca aplicada**  
Time adiciona `002_add_foo.sql`. Dev com volume existente: script vê `auth_users` e retorna. Ambientes divergem silenciosamente. **Onde:** CI/staging/prod. **Por quê:** probe booleano único.

**CON-004 — Cliente 503 quebra parser**  
Monitor externo espera `{ code, message, correlationId }`; recebe envelope Nest com `message` objeto. Alertas falsos ou integração quebrada. **Onde:** `/ready` 503. **Por quê:** `ServiceUnavailableException(body)`.

**CON-005 — Smoke flake**  
MinIO reinicia; `/ready` 503 intermitente; CI local falha aleatoriamente. **Onde:** `test:smoke-compose`. **Por quê:** sem depends_on healthy minio.

**CON-006 — Auditoria de AC**  
Stakeholder lê AC “só banco”; implementação exige S3/AMQP. Relatório de conformidade US-002 parcial sem alinhamento documental. **Onde:** requisitos. **Por quê:** spec técnica > AC literal.

**CON-007 — Dev com .env antigo**  
`NEXT_PUBLIC_API_URL=http://localhost:3001` → `getApiOrigin()` não strip `/api/v1` → fetch `/health` errado (404). **Onde:** browser. **Por quê:** normalização parcial.

**CON-008 — Regressão não detectada**  
MinIO down mas Postgres up; se lógica mudar para “ready com postgres only”, smoke ainda passa até alguém mudar status code. **Onde:** testes. **Por quê:** asserts mínimos.

**CON-009 — Supply chain dev**  
Atacante ou pacote comprometido no npm; próximo `docker compose up` instala no volume. **Onde:** máquina dev. **Por quê:** entrypoint mutável.

**CON-010 — Reconhecimento**  
Scanner externo mapeia stack via `/ready`. **Onde:** API exposta à internet. **Por quê:** checks nomeados.

**CON-011 — Manutenção retry**  
Alterar timeout DB exige dois arquivos; risco de drift (migrate 30×2s, Prisma idem hoje — ok até mudança). **Onde:** startup. **Por quê:** duplicação.

**CON-012 — Diagnóstico lento**  
Operador vê `minio: false` sem log de causa (403 vs timeout). **Onde:** suporte. **Por quê:** catch vazio.

---

## Handoff

| Quem | Validar / corrigir |
|------|---------------------|
| **DevOps + dados** | CON-001 (prod migrations), CON-005, CON-009 |
| **Backend** | CON-004, CON-010, CON-011, CON-012 |
| **Frontend** | CON-007 (doc/validação env) |
| **QA + PO** | CON-006, CON-008; reexecutar smoke após fixes |
| **Todos** | Dev: `docker compose up`, smoke, prod compose dry-run com Postgres limpo |

Artefatos parciais: `revision/2026-10-01-1025/regressao-impacto.md`, `seguranca.md`, `clean-code.md`.
