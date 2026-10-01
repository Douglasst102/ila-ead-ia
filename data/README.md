# Dados — SAD-ILA

Artefatos de **arquitetura e engenharia de dados** (fonte operacional para DDL).

| Arquivo | Conteúdo |
|---------|----------|
| `modelo-dados.md` | Modelo conceitual/lógico, glossário, regras, índices |
| `escopo-dados.md` | Mapeamento domínio → PostgreSQL / MinIO / RabbitMQ |
| `migrations/001_initial_schema.sql` | DDL inicial PostgreSQL v1.0 |
| `migrations/` (demais) | Migrações incrementais por US |

Referência espelhada para contratos técnicos: `technical/data-models/` (manter alinhado em releases).

## Migrações incrementais (US-002+)

O serviço **api** aplica arquivos `*.sql` em ordem lexicográfica e registra em `schema_migrations` (criada automaticamente). Idempotente com initdb: se `001` já rodou via Postgres init, o entrypoint faz **backfill** do registro.

```powershell
docker compose exec api npm run migrate:data
```

Detalhes: [US-002](../docs/implementation/US-002-ambiente-docker-health.md).

## Aplicar migração no container (Windows + Docker)

**Primeira subida (volume vazio):** o Compose monta `001_initial_schema.sql` em `docker-entrypoint-initdb.d` — não é necessário passo extra.

**Apply manual** (ex.: outro ambiente):

```powershell
docker exec -i sad-ila-postgres psql -U sadila -d sadila -f - < data/migrations/001_initial_schema.sql
```

No PowerShell, alternativa:

```powershell
Get-Content data/migrations/001_initial_schema.sql -Raw | docker exec -i sad-ila-postgres psql -U sadila -d sadila
```

**Recriar banco do zero (dev — apaga dados):**

```powershell
docker compose -f infrastructure/docker-compose.dev.yml --env-file .env down
docker volume rm sad-ila_postgres_data
docker compose -f infrastructure/docker-compose.dev.yml --env-file .env up -d postgres
```

## Verificação rápida

```powershell
docker exec sad-ila-postgres psql -U sadila -d sadila -c "\dt"
```
