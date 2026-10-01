# Revisão AppSec — US-002 (Ambiente Docker e health checks)

**Data:** 2026-10-01  
**Escopo:** ApiBff health/readiness, migrações SQL, entrypoints Docker, Compose dev/prod, WebApp env público.  
**Referências:** RFN-006, ADR-005, OpenAPI `/health`, `/ready`.

## Resumo executivo

Superfície de ataque **limitada** (sem auth ainda). Conformidade boa em **segredos via `.env`** e **SQL parametrizado** nas migrações. Correções aplicadas nesta revisão: **helmet**, **mensagens genéricas em prod**, **validação de path de migrações**, **`npm ci --ignore-scripts`**, **MinIO sem portas expostas no Compose prod**.

## Superfície analisada

| Componente | Risco | Status |
|------------|-------|--------|
| `GET /health`, `GET /ready` | Reconhecimento, DoS leve | Aceito (probes); checks ocultos em prod |
| Migrações SQL | Injeção / path traversal | Mitigado (filename + path resolve) |
| Entrypoint npm | Supply chain | Mitigado (`ci` + `--ignore-scripts`; `prisma generate` explícito) |
| CORS | Misconfig produção | Depende de `CORS_ORIGINS` explícito — **obrigatório em piloto** |
| Compose prod | Exposição MinIO/RabbitMQ | MinIO **sem** portas publicadas; RabbitMQ já interno |
| Dependências npm | CVEs transitivas | Ver seção dependências |

## Achados e tratamento

### Corrigidos nesta revisão

| ID | Severidade | Descrição | Correção |
|----|------------|-----------|----------|
| SEC-US002-01 | Médio | 503 `/ready` listava nomes de dependências em prod | Mensagem genérica se `NODE_ENV=production` |
| SEC-US002-02 | Médio | Migrações: path traversal via nome de arquivo | `migration-path.mjs` + regex `NNN_*.sql` |
| SEC-US002-03 | Médio | Log de erro migrate podia vazar detalhes de conexão | Log apenas `err.message` |
| SEC-US002-04 | Médio | Headers HTTP padrão (X-Powered-By, etc.) | `helmet` + `disable('x-powered-by')` |
| SEC-US002-05 | Médio | MinIO publicado no host em prod | Removido `ports` no `docker-compose.prod.yml` |
| SEC-US002-06 | Médio | Scripts pós-install npm no entrypoint dev | `--ignore-scripts` + `prisma generate` manual |

### Aceitos / backlog (US posteriores)

| ID | Severidade | Descrição | Recomendação |
|----|------------|-----------|--------------|
| SEC-US002-07 | Baixo | Sem rate limit em `/health`/`/ready` | `@nestjs/throttler` ou proxy (US auth/RFN) |
| SEC-US002-08 | Baixo | JWT/auth ausente | Esperado — US-003+ |
| SEC-US002-09 | Informativo | CVEs em devDependencies (Nest CLI, glob) | `npm audit` periódico no CI; não expõe runtime prod se imagem `runner` faz prune |
| SEC-US002-10 | Informativo | `.env.example` com placeholders fracos | OK para dev; **proibir** reuse em prod (documentado) |

## Checklist RFN-006 / segredos

- [x] `.env` no `.gitignore`
- [x] Credenciais MinIO/RabbitMQ/DB só no serviço `api` (Compose)
- [x] Frontend só `NEXT_PUBLIC_*` (URL pública)
- [ ] Piloto: `CORS_ORIGINS`, `JWT_SECRET`, senhas fortes — validação operacional (fora do código)

## Verificações recomendadas

```powershell
# Headers (após subir API)
curl.exe -I http://localhost:3001/health

# Smoke
cd testing; npm run test:smoke-compose

# Audit dependências (container api)
docker compose exec api npm audit --omit=dev
```

## Rastreio

Relacionado a `revision/2026-10-01-1025/` (CON-009, CON-010). Correções de segurança adicionais registradas neste arquivo.
