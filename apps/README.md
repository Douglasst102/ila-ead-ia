# Aplicações SAD-ILA (`apps/`)

Código executável do produto: **WebApp** (Next.js) e **ApiBff** (NestJS).

## Pacotes

| Pasta | Stack | Porta (dev) | Descrição |
|-------|-------|-------------|-----------|
| [`web/`](web/) | Next.js 14 App Router | 3000 | Interface; consome REST em `NEXT_PUBLIC_API_URL` |
| [`api/`](api/) | NestJS 10 + Prisma | 3001 | BFF monolítico modular; health em `/health` e `/ready` |

## Desenvolvimento (Docker — recomendado)

Não é necessário Node no host. Na raiz do repositório:

```powershell
docker compose up -d --build
docker compose logs -f api web
```

Comandos npm **dentro** do contêiner:

```powershell
docker compose exec api npm run build
docker compose exec web npm run lint
```

## Documentação por entrega

| User Story | Guia |
|------------|------|
| US-002 | [`docs/implementation/US-002-ambiente-docker-health.md`](../docs/implementation/US-002-ambiente-docker-health.md) |

## Estrutura ApiBff (US-002+)

```text
apps/api/
├── src/
│   ├── main.ts              # CORS, helmet, prefixo /api/v1
│   ├── http-api/            # Health (US-002)
│   └── database/            # PrismaService + retry
├── prisma/
├── scripts/                 # entrypoint, migrações SQL
└── Dockerfile               # ver infrastructure/dockerfiles/api.Dockerfile
```

## Estrutura WebApp (US-002+)

```text
apps/web/
├── app/                     # App Router
├── lib/api-config.ts        # Base URL /api/v1
├── scripts/docker-entrypoint.sh
└── .env.example
```
