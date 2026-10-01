# Infraestrutura SAD-ILA

Ambiente local: **Windows + Docker Desktop** (regra `.cursor/rules/ambiente.mdc`). Comandos `npm`/`npx` devem rodar **dentro** dos contêineres `web` e `api`.

## Pré-requisitos

- Docker Desktop 4.x+ com engine Linux (`desktop-linux`)
- Docker Compose v2 (`docker compose`)
- Arquivo `.env` na **raiz** do repositório (copie de `.env.example`)

```powershell
cd c:\Users\dougl\OneDrive\Documents\Codes\ila-ead-ia
Copy-Item .env.example .env
```

## Desenvolvimento

Subir stack (postgres, minio, rabbitmq, api, web):

```powershell
docker compose -f infrastructure/docker-compose.dev.yml --env-file .env up -d --build
```

Ollama (profile opcional `ai`):

```powershell
docker compose -f infrastructure/docker-compose.dev.yml --env-file .env --profile ai up -d ollama
```

### URLs de teste

| Serviço | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API liveness | http://localhost:3001/health |
| API readiness | http://localhost:3001/ready |
| Healthcheck Compose (api) | probe em `/ready` (readiness) |
| RabbitMQ UI | http://localhost:15672 |
| S3 (MinIO / CloudServer dev) | http://localhost:9000 |
| Postgres | `localhost:5432` (credenciais em `.env`) |

Validação rápida:

```powershell
curl.exe http://localhost:3001/health
curl.exe http://localhost:3001/ready
curl.exe http://localhost:3000
```

Logs:

```powershell
docker compose -f infrastructure/docker-compose.dev.yml logs -f api web
```

Parar:

```powershell
docker compose -f infrastructure/docker-compose.dev.yml --env-file .env down
```

## Produção (Compose)

Build de imagens runner (sem bind mounts):

```powershell
docker compose -f infrastructure/docker-compose.prod.yml --env-file .env up -d --build
```

Em COMGAP, HTTPS termina no reverse proxy; não exponha credenciais de MinIO/RabbitMQ na internet.

No Compose **prod**, MinIO e RabbitMQ ficam **somente na rede interna** (sem portas publicadas no host). Ver `security/revisao-us-002-appsec.md`.

## Estrutura

| Caminho | Conteúdo |
|---------|----------|
| `docker-compose.dev.yml` | Dev com hot reload |
| `docker-compose.prod.yml` | Imagens multi-stage |
| `dockerfiles/` | Dockerfiles `api` e `web` |
| `environments/.env.example` | Catálogo de variáveis |
| `analysis.md` | Análise de infra e host |
| `ci-cd/` | Documentação CI |
| `kubernetes/` | Manifests stub |

Aplicações: `apps/web` (Next.js), `apps/api` (NestJS).

## Init PostgreSQL

O DDL `data/migrations/001_initial_schema.sql` é montado em `/docker-entrypoint-initdb.d/` **apenas na primeira criação** do volume `postgres_data`. Espelho lógico em `technical/data-models/schema.sql`. Para reaplicar schema, remova o volume ou use migrações incrementais / ORM na implementação completa.
