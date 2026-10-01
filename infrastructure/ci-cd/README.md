# CI/CD — SAD-ILA

Pipeline principal: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)

| Job | Objetivo |
|-----|----------|
| `validate-compose` | `docker compose config` (dev + prod) com `.env.example` |
| `build-api` | `npm install` + `npm run build` em `apps/api` |
| `build-web` | `npm install` + `npm run build` em `apps/web` |

Deploy COMGAP e promoção staging/prod ficam fora do escopo do piloto hello-world.
