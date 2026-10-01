# Lente: regressão e impacto sistêmico

**Data/hora:** 2026-10-01 10:25 (UTC-3)  
**Escopo:** implementação US-002 (Docker, health, migrações, frontend env, smoke tests) — análise estática dos artefatos em `apps/api`, `apps/web`, `infrastructure/`, `testing/`, `docker-compose.yml` (sem diff Git útil: maior parte ainda untracked vs `main`).  
**Estratégia:** leitura de arquivos + comparação com critérios de aceitação US-002 e OpenAPI.

## Resumo executivo

A stack **dev** atende bem liveness/readiness e smoke local, mas há **lacunas de produção** (Postgres prod sem initdb + migrações não embarcadas na imagem), **healthchecks de Compose** que não refletem readiness real, e um **modelo de migração** que não aplica SQL incremental após o primeiro bootstrap. Contrato HTTP de `/ready` em 503 diverge do OpenAPI (`ApiError`).

## Achados por severidade

### P0 — …

#### REG-001 — Compose prod: schema PostgreSQL pode nunca ser aplicado

**Perfil sugerido:** DevOps + dados  
**Cenário:** `docker compose -f infrastructure/docker-compose.prod.yml up` com volume Postgres novo.  
**Evidência:** Postgres prod não monta `data/migrations` em `initdb.d`; entrypoint da API resolve migrações fora da imagem.

```13:15:infrastructure/docker-compose.prod.yml
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
```

```10:12:apps/api/scripts/apply-data-migrations.mjs
const MIGRATIONS_DIR =
  process.env.DATA_MIGRATIONS_DIR ?? path.resolve(__dirname, '../../../data/migrations');
```

No contêiner `runner`, só há conteúdo de `apps/api` — o path default **não** inclui `data/migrations` do repositório. O probe `auth_users` falha vazio → API sobe sem tabelas → `/ready` pode falhar ou Prisma quebra em US futuras.

**Mitigação:** copiar `data/migrations` na imagem prod, definir `DATA_MIGRATIONS_DIR`, ou montar volume/initdb no Postgres prod; alinhar com dev.

---

### P1 — …

#### REG-002 — Healthcheck Docker da API = liveness, não readiness

**Perfil sugerido:** DevOps + backend  
**Cenário:** Nest sobe e responde `/health` enquanto Postgres ainda não aceita conexão (janela curta) ou dependências Should estão down; Compose marca `api` **healthy**; `web` sobe via `depends_on: service_healthy`.

```106:111:infrastructure/docker-compose.dev.yml
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3001/health"]
```

AC US-002 menciona stack “healthy” e `/ready` 200 após banco — o orquestrador **não** usa `/ready`.

**Mitigação:** healthcheck opcional em `/ready` ou `start_period` maior + documentar que “healthy” ≠ readiness completa.

#### REG-003 — Migrações: só rodam se `auth_users` ausente

**Perfil sugerido:** dados + backend  
**Cenário:** adicionar `002_foo.sql`; ambiente já tem schema v1 → script **nunca** aplica 002.

```43:47:apps/api/scripts/apply-data-migrations.mjs
    const probe = await client.query(`SELECT to_regclass('public.auth_users') AS rel`);
    if (probe.rows[0]?.rel) {
      console.log('[migrate] Schema já presente (auth_users); nada a aplicar.');
      return;
```

**Mitigação:** tabela `schema_migrations` / Prisma Migrate antes de US que alterem DDL.

#### REG-004 — Resposta 503 de `/ready` vs OpenAPI

**Perfil sugerido:** backend  
**Cenário:** cliente/orquestrador espera corpo `ApiError` em 503; Nest devolve envelope padrão com `ReadyStatus` aninhado em `message`.

```20:26:apps/api/src/http-api/health.controller.ts
  async getReady() {
    const body = await this.health.getReadiness();
    if (body.status !== 'ready') {
      throw new ServiceUnavailableException(body);
    }
    return body;
```

OpenAPI referencia `#/components/responses/ServiceUnavailable` → schema `ApiError`.

**Mitigação:** `@Res()` com status 503 e corpo `ReadyStatus`, ou exception filter que mapeie para `ApiError` + extensão documentada.

#### REG-005 — MinIO sem healthcheck no Compose

**Perfil sugerido:** DevOps  
**Cenário:** CloudServer lento ou reiniciando; API fica `not_ready` (503) sem `depends_on` alinhado — flapping de `/ready` e smoke intermitente.

```117:118:infrastructure/docker-compose.dev.yml
      minio:
        condition: service_started
```

**Mitigação:** healthcheck HTTP/S3 no serviço `minio` ou aceitar flapping documentado.

---

### P2 — …

#### REG-006 — AC vs implementação: `/ready` exige MinIO/RabbitMQ, não só Postgres

**Perfil sugerido:** backend + QA  
AC US-002: “`/ready` retorna 200 **somente após conexão com o banco**”. Código exige três checks.

```27:28:apps/api/src/http-api/health.service.ts
    const checks: ReadyChecks = { postgres, minio, rabbitmq };
    const allOk = postgres && minio && rabbitmq;
```

Alinhado à spec técnica/OpenAPI Should, mas **texto do AC** é mais fraco — risco de falso “não conforme” em auditoria.

#### REG-007 — `getApiOrigin()` se `NEXT_PUBLIC_API_URL` sem sufixo `/api/v1`

**Perfil sugerido:** frontend  
`.env` legado `http://localhost:3001` → health chama URL errada.

```11:16:apps/web/lib/api-config.ts
export function getApiOrigin(): string {
  const base = getApiV1BaseUrl();
  if (base.endsWith('/api/v1')) {
    return base.slice(0, -'/api/v1'.length);
  }
  return base;
}
```

**Mitigação:** validação em build ou normalização documentada (breaking para quem não atualizou `.env`).

#### REG-008 — Smoke test não cobre 503 nem checks MinIO/RabbitMQ

**Perfil sugerido:** QA  
Só asserta Postgres implicitamente via status 200; não falha se checks parciais mudarem sem quebrar 200.

---

## Perguntas em aberto

1. Produção COMGAP usará Compose prod ou Kubernetes? Define onde DDL deve viver.
2. CloudServer dev permanece ou migra para MinIO oficial (impacto no ping S3)?

## O que validar antes do merge (checklist acionável)

- [ ] Subir **prod compose** com Postgres vazio e confirmar presença de `auth_users`.
- [ ] Capturar JSON de `GET /ready` com 503 e comparar com OpenAPI.
- [ ] `docker compose up` na raiz com `.env` **sem** `/api/v1` e validar homepage.
- [ ] Adicionar `002_*.sql` de teste e confirmar que **não** aplica (REG-003).
