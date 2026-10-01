# Especificações de integração — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Rastreio:** RFN-006, RFN-010, RFN-011, RF-090–091, RFN-041, ADR-005, ADR-008, ADR-009  

---

## 1. Mapa de integrações

```mermaid
flowchart LR
  Web[WebApp Next.js]
  BFF[ApiBff NestJS]
  PG[(PostgreSQL)]
  MINIO[(MinIO S3)]
  RMQ[RabbitMQ]
  IA[Provedor IA Ollama]

  Web -->|HTTPS REST JSON JWT| BFF
  BFF --> PG
  BFF --> MINIO
  BFF --> RMQ
  BFF -->|HTTPS timeout 180s| IA
```

Não há integração LMS, IdP COMAER (v1), nem chamada browser → IA/MinIO.

---

## 2. Frontend → BFF

### 2.1 Protocolo

| Aspecto | Especificação |
|---------|---------------|
| Base URL | `{API_PUBLIC_URL}/api/v1` (env `NEXT_PUBLIC_API_URL`) |
| Formato | JSON UTF-8 |
| Auth | Header `Authorization: Bearer {accessToken}` |
| Upload | `multipart/form-data` |
| Jobs | Resposta **202**; polling `GET /jobs/{id}` a cada 2–5s (backoff até 30s) |
| Idempotência | Header `Idempotency-Key` em `POST /processos` (UUID recomendado) |

### 2.2 CORS (RFN-006)

Configurado no **BFF** (`CORS_ORIGINS`):

- **dev (Docker Desktop Windows):** `http://localhost:3000` (porta WebApp do Compose).
- **piloto/prod:** origens explícitas do host WebApp COMGAP; sem wildcard `*` se credenciais forem usadas no futuro.

Métodos: `GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`.  
Headers expostos: `X-Correlation-Id` (Should).

### 2.3 Armazenamento JWT no Next.js (RFN-050)

- Token **efêmero:** memória React context ou `sessionStorage` (preferível a `localStorage` para reduzir persistência XSS).
- **Sem** persistência de `.docx`/PDF no browser (sem IndexedDB de documentos).
- Logout: remover token client-side + `POST /auth/logout`.
- Refresh: não há v1 — redirect `/login` em **401** global (interceptor fetch).

### 2.4 Tratamento de erros no cliente

| HTTP | Ação UI |
|------|---------|
| 401 | Login |
| 403 | Mensagem RBAC |
| 409 | Conflito estado / título duplicado |
| 413 | Limite upload RFN-010 |
| 422 | Regra negócio (sugestões pendentes, AI_DISABLED) |
| 503 | Manutenção / ready fail |

Corpo: `{ code, message, correlationId }`.

---

## 3. BFF → PostgreSQL

| Aspecto | Detalhe |
|---------|---------|
| Driver | TCP via ORM (Prisma/TypeORM) |
| URL | `DATABASE_URL` (rede interna Compose `postgres:5432`) |
| Pool | Default ORM; max connections alinhado a 1 réplica piloto |
| Transações | Facades críticas: confirmar preparação, decisão HITL + auditoria, encerramento |
| Migrações | Versionadas no repositório backend |

**Windows/Docker:** cliente roda **dentro** do contêiner `api`; host acessa Postgres só via port mapping se necessário para debug.

---

## 4. BFF → MinIO (S3 API)

| Aspecto | Detalhe |
|---------|---------|
| SDK | `@aws-sdk/client-s3` ou `minio` npm |
| Endpoint | `MINIO_ENDPOINT` (ex. `http://minio:9000`) |
| Credenciais | `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` — só backend |
| Bucket | `MINIO_BUCKET` único |
| Keys | `cursos/{cursoId}/materiais/{uuid}`, `processos/{processoId}/{tipo}/{uuid}` |

**Upload:** stream multipart HTTP → put object; validar MIME antes do put.  
**Download:** get object → stream HTTP response com `Content-Disposition: attachment`.  
**Falha MinIO:** upload **503**; `/ready` Should falhar.

**Isolamento (ADR-011):** URLs pré-assinadas **não** expostas ao browser v1; sempre proxy BFF + RBAC.

---

## 5. BFF → RabbitMQ (AMQP)

| Aspecto | Detalhe |
|---------|---------|
| URL | `RABBITMQ_URL` (`amqp://user:pass@rabbitmq:5672`) |
| Filas duráveis | `revisao.ia`, `export.documento` |
| Exchange | default direct ou `sadila.jobs` (implementação) |
| Prefetch | `RABBITMQ_PREFETCH` default **1** (max 2) |
| Publisher | Módulo Jobs após confirmar preparação / export / retry |
| Consumer | Mesmo processo NestJS onModuleInit |

### 5.1 Payload mensagens (JSON)

**revisao.ia:**

```json
{
  "jobId": "uuid",
  "processoId": "uuid",
  "correlationId": "uuid"
}
```

**export.documento:**

```json
{
  "jobId": "uuid",
  "exportacaoId": "uuid",
  "processoId": "uuid",
  "formato": "docx"
}
```

### 5.2 Retries (RF-091)

- Falha transient (timeout IA, 5xx Ollama, broker blip): republish até **3** tentativas com backoff 5s, 15s, 45s.
- Falha permanente (4xx adapter, parse inválido): `job.estado = failed`, sem retry automático; usuário `POST .../ia/retry`.
- **Não** retry cego em erro de validação de negócio.

### 5.3 Falha broker

- Publicar job: se Rabbit down → **503** e processo permanece `preparacao_concluida` / estado recuperável; auditoria `ia_fila_indisponivel`.

---

## 6. BFF → Provedor IA (IaFacade)

| Aspecto | Detalhe |
|---------|---------|
| Protocolo | HTTPS REST (Ollama `/api/chat` piloto) |
| Base URL | `AI_PROVIDER_BASE_URL` |
| Chave | `AI_API_KEY` (opcional Ollama local) |
| Timeout | `AI_REQUEST_TIMEOUT_MS` = **180000** |
| Feature flag | `AI_ENABLED` — se false, **não** publica fila |

### 6.1 Circuit breaker

- Janela: 5 falhas em 60s → circuito **open** 60s.
- Open: jobs falham rápido com `error_code = IA_CIRCUIT_OPEN`; processo recuperável (RF-091).
- Half-open: 1 tentativa de probe.

### 6.2 Conteúdo enviado (G-09 / V-02)

- Texto extraído do material (trechos), critérios, metadados processo.
- **Não** enviar arquivo binário completo se extração local existir.
- Log: metadados apenas; sem texto integral.

### 6.3 Falhas

| Cenário | Comportamento |
|---------|---------------|
| Timeout 180s | Job `failed`, `IA_TIMEOUT`; sugestões não criadas |
| 5xx provedor | Retry AMQP; depois failed |
| Circuit open | Failed imediato; UI retry manual |
| AI_ENABLED false | HTTP 403/422 `AI_DISABLED` |

IA indisponível **não** derruba `/health` liveness; pode afetar `/ready` Should se política exigir IA no piloto (default: ready não exige Ollama).

---

## 7. Sincronização vs assíncrono

| Operação | Modo |
|----------|------|
| Login, CRUD curso, listagens | Síncrono |
| Upload arquivo | Síncrono (stream) até persistir MinIO + metadados |
| Confirmar preparação + IA | Síncrono DB + **async** job (202) |
| Análise IA | Assíncrono fila |
| Export docx/pdf | Assíncrono fila |
| Polling job status | Síncrono GET |

---

## 8. Consistência e idempotência

| Operação | Garantia |
|----------|----------|
| POST /processos + Idempotency-Key | Mesma key + user → mesmo processo |
| POST sugestoes/decisao | Repetir mesmo `{decisao}` → **200** idempotente |
| Confirmar preparação | Segunda chamada em estado ≠ rascunho → **409** |
| Export | Novo job a cada POST (não idempotente); download por exportacaoId |

---

## 9. Observabilidade de integração

- Propagar `correlationId` Web → BFF → logs → payload AMQP → logs consumer.
- Métricas Could: duração job IA, tamanho upload, fila depth Rabbit.

---

## 10. Lacunas institucionais

- TLS terminado na borda COMGAP (certificados).
- DPA e endpoint IA produção (G-09).
- Política anti-malware upload (RFN-005 Could).

---

## Histórico

| Versão | Data |
|--------|------|
| 1.0 | 2026-10-01 |
