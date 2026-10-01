# Lente: segurança de aplicações (AppSec)

**Data/hora:** 2026-10-01 10:25 (UTC-3)  
**Escopo:** US-002 — health endpoints, scripts de migração, entrypoints Docker, variáveis públicas frontend.  
**Superfície de ataque do trecho:** limitada (endpoints públicos de probe, scripts de bootstrap, sem auth ainda).

## Resumo executivo

Não há segredos hardcoded nos trechos revisados; `.env` está no `.gitignore`. Os principais riscos são **operacionais/dev**: `npm install` a cada start do contêiner (integridade de supply chain) e **exposição ampliada** de `/ready` (detalhe de dependências internas). Endpoints de health sem rate limit são aceitáveis na US-002, mas documentar para produção.

## Mapa de superfície de ataque (o que o trecho altera)

| Superfície | Alteração |
|------------|-----------|
| `GET /health`, `GET /ready` | Públicos, sem auth (esperado) |
| Entrypoint `npm install` | Rede externa npm registry |
| `apply-data-migrations.mjs` | SQL arbitrário do volume/arquivo |
| `NEXT_PUBLIC_*` | Exposto ao browser (apenas URL pública) |
| AMQP/S3 pings | Credenciais via env no backend |

## Achados

### Médio

#### SEC-001 — `npm install` em todo restart do contêiner (dev)

**Perfil sugerido:** DevOps  
**Local:** `apps/api/scripts/docker-entrypoint.sh`, `apps/web/scripts/docker-entrypoint.sh`  
**Exploração:** compromisso do registry npm ou MITM na rede do dev → código malicioso no volume `*_node_modules`.  
**Impacto:** limitado a ambiente de desenvolvimento, mas **alto** se dev usar credenciais reais no `.env`.  
**Remediação:** preferir `npm ci` com lockfile no build; entrypoint só sincronizar se `package.json` mudou (hash).

```4:5:apps/api/scripts/docker-entrypoint.sh
echo "[entrypoint] Sincronizando dependências npm..."
npm install
```

### Baixo

#### SEC-002 — `/ready` vaza topologia interna

**Perfil sugerido:** backend  
**Descrição:** corpo 200/503 inclui `checks.postgres|minio|rabbitmq`.  
**Impacto:** reconhecimento para atacante externo (se API exposta).  
**Remediação:** em produção, resposta mínima ou auth no endpoint (RFN-006 futuro).

```30:33:apps/api/src/http-api/health.service.ts
    return {
      status: allOk ? 'ready' : 'not_ready',
      checks,
    };
```

#### SEC-003 — Migração SQL lida do filesystem

**Perfil sugerido:** dados + DevOps  
**Pré-condição:** atacante consegue escrever em `data/migrations` montado no contêiner.  
**Impacto:** execução de SQL como role da app (dev bind-mount).  
**Remediação:** migrações baked-in na imagem prod; volume ro em dev já ok.

### Informativo

#### SEC-004 — Health endpoints sem rate limiting

Esperado para probes; monitorar abuso em piloto (DoS leve).

#### SEC-005 — Segredos e `.gitignore`

`.env.example` contém placeholders; `.gitignore` ignora `.env` — conforme RFN.

## Falsos positivos evitados

- Ping MinIO via `fetch` interno **não** é SSRF aberto: host fixo por `MINIO_ENDPOINT` (env controlado pelo operador).
- Prisma `$queryRaw\`SELECT 1\`` — sem concatenação de entrada externa.

## Verificações recomendadas

- Scan de imagem (Trivy) após `docker build` api/web.
- Confirmar que `.env` real não está tracked (`git status`).
- Teste manual: resposta `/ready` não deve incluir stack traces (Nest default — ok).
