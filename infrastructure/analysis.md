# Análise de infraestrutura — SAD-ILA

**Data:** 2026-10-01  
**Projeto:** 26SISIAR05LOG (`ila-ead-ia`)  
**Referências:** `architecture/c4-diagrams/02-containers.md`, `architecture/technology-stack.md`, `technical/technical-specifications.md`

---

## 1. Objetivo do deploy v1 (Alternativa A)

Monólito modular **NestJS (ApiBff)** + **Next.js (WebApp)** em Docker Compose no Windows. O frontend fala **somente** com a API REST (`/api/v1`). Postgres, MinIO, RabbitMQ e IA ficam acessíveis apenas pela API.

| Contêiner | Função | RF / RFN |
|-----------|--------|----------|
| `web` | UI Next.js App Router | RF-080, RFN-050 |
| `api` | REST, RBAC futuro, consumer AMQP no mesmo processo | RF-001–091, RFN-011 |
| `postgres` | Transacional + auditoria | RFN-003, ADR-004 |
| `minio` | Object storage S3 | RFN-005, ADR-005 |
| `rabbitmq` | Filas `revisao.ia`, `export.documento` | ADR-009 |
| `ollama` | Provedor IA dev (profile `ai`) | ADR-008, RF-090 |

**Fora do Compose v1:** reverse proxy TLS COMGAP (nota de produção), container QA Playwright (skill `qa-testing`, fase posterior).

---

## 2. Topologia de rede (dev)

Rede Docker `sad-ila-backend` (bridge). DNS interno: `postgres`, `minio`, `rabbitmq`, `api`, `web`, `ollama`.

```
Browser → localhost:3000 (web)
Browser → localhost:3001 (api)  ← fetch health / JWT futuro
api → postgres:5432
api → minio:9000
api → rabbitmq:5672
api → ollama:11434 (se profile ai)
```

Portas publicadas no host (defaults): 3000, 3001, 5432, 9000, 9001, 5672, 15672, 11434 (ollama).

---

## 3. Persistência e init

| Volume | Serviço | Notas |
|--------|---------|-------|
| `postgres_data` | PostgreSQL 16 | Init via `data/migrations/001_initial_schema.sql` na primeira subida |
| `minio_data` | MinIO | Bucket `MINIO_BUCKET` criado na implementação Storage |
| `rabbitmq_data` | RabbitMQ 3.13 | Filas duráveis na app |
| `ollama_data` | Ollama | Modelos pull manual (`ollama pull …`) |

Volumes anônimos nomeados `api_node_modules` / `web_node_modules` evitam sobrescrever `node_modules` do Linux com bind mount do Windows (OneDrive).

---

## 4. Variáveis de ambiente

Catálogo implementado em `.env.example` / `infrastructure/environments/.env.example`, alinhado a `architecture/technology-stack.md` §3:

- Auth: `JWT_*`, `PASSWORD_PEPPER`
- Dados: `DATABASE_URL`
- Storage: `MINIO_*`
- Mensageria: `RABBITMQ_URL`
- IA: `AI_ENABLED`, `AI_PROVIDER_BASE_URL`, …
- HTTP: `CORS_ORIGINS`, `MAX_UPLOAD_MB`

**Política:** nenhum secret no código; `.env` no `.gitignore`.

---

## 5. Imagens e versões pinadas (Compose)

| Imagem | Tag / nota |
|--------|------------|
| `node` | `20-alpine` (LTS, Nest 10 + Next 14) |
| `postgres` | `16-alpine` |
| `zenko/cloudserver:latest` | **Dev fallback** S3-compatible (porta container 8000 → host 9000) quando `minio/minio` no Hub está bloqueado; produção COMGAP deve usar MinIO oficial |
| `rabbitmq` | `3.13-management-alpine` |
| `ollama/ollama` | `0.5.4` (profile `ai`) |

Atualizações: revisar release notes trimestralmente; MinIO/RabbitMQ exigem backup antes de major upgrades.

---

## 6. Ambiente host Windows (auditoria 2026-10-01)

Comandos executados na máquina de desenvolvimento:

| Componente | Versão observada | Avaliação |
|------------|------------------|-----------|
| Docker Client | 28.5.2 | Atual |
| Docker Engine | 28.5.2 | Atual |
| Docker Desktop | 4.51.0 (210443) | Atual |
| Docker Compose | v2.40.3-desktop.1 | Atual |
| WSL | Distribuição padrão **docker-desktop**, WSL 2, **Running** | OK para backend Linux |

**Recomendações:**

1. Manter Docker Desktop em “Use the WSL 2 based engine” e atualizar via canal stable quando houver security patches.
2. Se builds ficarem lentos em `OneDrive`, considerar clonar o repo fora do OneDrive ou excluir `node_modules` e `.next` da sincronização.
3. Habilitar integração WSL com a distro de dev pessoal apenas se for rodar CLI fora do Desktop; **Compose oficial** usa context `desktop-linux`.
4. Verificar periodicamente: `docker version`, `docker compose version`, `wsl --status`, `wsl -l -v`.

---

## 7. CI/CD (hello-world)

GitHub Actions (`.github/workflows/ci.yml`):

- Valida YAML Compose com `.env.example`
- Build TypeScript Nest + Next em Node 20

Deploy COMGAP, scan de imagens e secrets rotacionados: backlog DevOps produção.

---

## 8. Kubernetes

Manifests stub em `infrastructure/kubernetes/` para alinhamento futuro com stack da casa. **Piloto não exige K8s** (`technology-stack.md` §2.8).

---

## 9. Hello-world entregue

- **API:** `GET /api/v1/health` → `{ "status": "ok", "service": "api" }`
- **Web:** página inicial com fetch para `NEXT_PUBLIC_API_URL/api/v1/health`

Próximos incrementos DevOps: health `/ready` com deps, bucket MinIO init, filas Rabbit declaradas, container `qa`, pipeline de deploy.

---

## 10. Decisões e suposições

1. Compose files em `infrastructure/`; execução sempre com `-f infrastructure/docker-compose.dev.yml` a partir da raiz.
2. Estrutura de código em `apps/web` e `apps/api` (monorepo leve).
3. Spec técnica cita `GET /health` fora do prefixo; hello-world usa **`/api/v1/health`** conforme pedido do piloto infra — alinhar OpenAPI/US-002 na implementação BFF completa (pode expor ambos).
4. MinIO healthcheck via HTTP `/minio/health/live` (sem `mc` configurado no container).
5. **Bloqueio observado (2026-10-01):** `docker pull minio/minio` retorna *pull access denied* neste host; Compose usa imagem local buildada a partir de `dl.min.io`. Recomenda-se `docker login` no Hub ou mirror institucional se a política COMGAP exigir imagem oficial assinada.
