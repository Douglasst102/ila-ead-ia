# Lente: clean code e design

**Data/hora:** 2026-10-01 10:25 (UTC-3)  
**Escopo:** US-002 — módulos `http-api`, `database`, scripts Docker, `apps/web/lib`, testes smoke.  
**Referência de estilo:** monólito NestJS inicial (poucos módulos); Next App Router mínimo.

## Resumo executivo

A organização em `HttpApiModule`, `DatabaseModule` e `api-config.ts` está **acima** do boilerplate inicial e facilita evolução. Há **duplicação** de retry de Postgres entre Prisma e script de migração, catches silenciosos nos pings dificultam diagnóstico, e entrypoints com `npm install` aumentam dívida operacional.

## Pontos fortes

- Exclusão explícita de `/health` e `/ready` do prefixo global em `main.ts` — clara e alinhada ao OpenAPI.
- `getApiV1BaseUrl` / `getApiOrigin` centralizam contrato §2.1 — evita espalhar concatenação de paths.
- Smoke test enxuto, legível, sem supertest desnecessário.

## Problemas e sugestões

### Alto

#### CC-001 — Duplicação de “connect with retry” Postgres

**Perfil sugerido:** backend  
**Problema:** mesma política (30 × 2s) em `PrismaService` e `apply-data-migrations.mjs`.  
**Sugestão:** extrair módulo Node compartilhado `scripts/db-wait.mjs` ou usar só entrypoint migrate antes do Nest (Prisma retry só como safety net).

```19:37:apps/api/src/database/prisma.service.ts
  async connectWithRetry(
    maxAttempts = Number(process.env.DB_CONNECT_RETRIES ?? DEFAULT_RETRIES),
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
```

```17:30:apps/api/scripts/apply-data-migrations.mjs
async function connectWithRetry(connectionString) {
  const client = new pg.Client({ connectionString });
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
```

### Médio

#### CC-002 — `HealthService` concentra três clientes de infra

**Perfil sugerido:** backend  
Aceitável na US-002; quando crescer, separar `PostgresHealthIndicator`, `MinioHealthIndicator`, `AmqpHealthIndicator` (padrão Nest Terminus ou ports).

#### CC-003 — Catches vazios nos pings

**Perfil sugerido:** backend  
**Sugestão:** log `debug` com motivo (sem credenciais) para operação em Docker.

```89:91:apps/api/src/http-api/health.service.ts
    } catch {
      return false;
    }
```

#### CC-004 — Entrypoint sempre roda quatro passos pesados

**Perfil sugerido:** DevOps  
Migrate + `prisma generate` + `npm install` em **cada** restart — correto para volumes stale, mas lento; documentar ou guard por checksum.

### Baixo

#### CC-005 — Tipagem smoke test sem `ReadyStatus`

**Perfil sugerido:** QA  
Adicionar interface mínima para `body.checks` melhorar regressão de contrato.

#### CC-006 — `HealthController` log label `{/api/v1}` no Nest

Log de bootstrap mostra `HealthController {/api/v1}` apesar das rotas na raiz — cosmético, confunde debug.

## Dívida técnica introduzida ou ampliada

- Migração híbrida SQL manual + Prisma parcial (`AuthUser` only).
- Dependência de fallback HTTP para MinIO dev (CloudServer).
- Dois caminhos prod web (`runner` standalone vs `runner-npm`).

## Checklist rápido para o autor antes do merge

- [ ] Unificar retry DB ou documentar por que duplicado.
- [ ] Alinhar 503 `/ready` com filtro global de exceções (futuro `ApiError`).
- [ ] Reduzir ruído de startup (entrypoint condicional).
