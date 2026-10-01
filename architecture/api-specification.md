# Especificação de APIs — SAD-ILA

**Versão:** 1.0 (contratos de alto nível)  
**Data:** 2026-10-01  
**Base path:** `/api/v1`  
**Estilo:** REST JSON  
**Auth:** `Authorization: Bearer <JWT>` salvo rotas marcadas como públicas  
**OpenAPI detalhada:** etapa **Technical Analyst** (schemas, exemplos, códigos de erro completos)  
**Rastreio:** RF-001–091, RFN-006, RFN-040, RFN-041, user stories US-001–041  

Documentação gerada pelo NestJS em `/api/docs` (Swagger UI). Em produção, exigir autenticação ou restringir rede (RFN-006).

---

## 1. Convenções

| Tema | Regra |
|------|--------|
| Versão | Breaking change → `/api/v2` + changelog |
| IDs | UUID v4 nas URLs |
| Tempo | ISO-8601 UTC |
| Paginação | `?page=1&pageSize=20` (default pageSize ≤ 50) |
| Erros | `{ "code": "string", "message": "string", "correlationId": "uuid" }` — **sem** revelar existência de e-mail no login |
| Idempotência | Header `Idempotency-Key` em `POST /processos` (Should, RFN-041) |
| Upload | `multipart/form-data`; limite `MAX_UPLOAD_MB` |
| Jobs | `202 Accepted` + `{ jobId, statusUrl }` ; cliente faz polling |
| HITL | Decisão de sugestão **idempotente** no mesmo par `(sugestaoId, decisao)` |

### 1.1 Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 | Leitura / update |
| 201 | Criação síncrona |
| 202 | Job aceito (IA, export) |
| 204 | Logout / sem corpo |
| 400 | Validação |
| 401 | Token ausente/expirado |
| 403 | RBAC |
| 404 | Recurso inexistente **ou** não visível (não vazar IDs de storage) |
| 409 | Conflito (título de curso duplicado, transição de estado inválida) |
| 413 | Upload acima do limite |
| 422 | Regra de negócio (ex.: avanço QE com sugestões pendentes) |
| 429 | Rate limit futuro (Could) |
| 503 | Dependência crítica down (`/ready`); IA indisponível **não** derruba API — ver jobs |

### 1.2 RBAC (matriz mínima v1)

| Recurso | `revisor` | `admin_cursos` | `admin_sistema` |
|---------|-----------|----------------|-----------------|
| Auth `/me`, logout | sim | sim | sim |
| Cursos GET | sim | sim | sim |
| Cursos POST/PATCH | não | sim | sim |
| Materiais de apoio | leitura+download; upload se política = admin_cursos (Must: admin_cursos; revisor **Should** no detalhe técnico) | CRUD | CRUD |
| Processos / HITL / QE / relatório | sim (próprios ou da organização lógica v1 = todos autenticados da instância piloto) | sim | sim |
| Usuários | não | não | sim |
| `/health` | público | público | público |

Ajuste fino de “revisor pode fazer upload de material de apoio” fica para o Technical Analyst; **escritas de curso** são `admin_cursos`+ (RF-011).

JWT claims: `sub`, `email`, `roles`, `iat`, `exp` (RFN-002).

---

## 2. Operação

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| GET | `/health` | público | Liveness do processo |
| GET | `/ready` | público | Postgres up (RabbitMQ/MinIO Should) |

Fora de `/api/v1` é aceitável (`GET /health` na raiz do ApiBff) para orquestração. US-002.

---

## 3. Auth (RF-001–004, US-001, US-004)

| Método | Caminho | Auth | Descrição |
|--------|---------|------|-----------|
| POST | `/api/v1/auth/login` | público | Body `{ email, senha }` → `{ accessToken, expiresAt, user }` |
| POST | `/api/v1/auth/logout` | JWT | Invalida no cliente; denylist Should (RFN-002) |
| GET | `/api/v1/auth/me` | JWT | Usuário corrente e papéis |

Login inválido: **401** genérico (RF-001). Não enumerar usuários.

---

## 4. Usuários — admin_sistema (RF-005, US-006)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/usuarios` | Listagem paginada |
| POST | `/api/v1/usuarios` | Cadastro: email, nome, papel, senha inicial |
| PATCH | `/api/v1/usuarios/{id}` | Atualizar papel, nome; desativar (`ativo: false`) |
| GET | `/api/v1/usuarios/{id}` | Detalhe (sem hash de senha) |

Senha **nunca** retornada. Persistência só hash (RFN-003).

---

## 5. Cursos (RF-010–012, US-008–010)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/cursos` | Lista: título, descrição resumida, indicadores Could |
| POST | `/api/v1/cursos` | `{ titulo, descricao }` — título único (409) |
| GET | `/api/v1/cursos/{id}` | Hub: curso + resumo de materiais / processos |
| PATCH | `/api/v1/cursos/{id}` | Edição admin_cursos (Should MVP se não houver RF explícito de edição — **lacuna**: RF lista cadastro/consulta; PATCH opcional v1) |

Tamanhos máximos de título/descrição via env.

---

## 6. Materiais de apoio (RF-020–021, US-011–012)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/cursos/{cursoId}/materiais` | Lista metadados, ordenada por data |
| POST | `/api/v1/cursos/{cursoId}/materiais` | multipart: arquivo PDF/Word |
| GET | `/api/v1/cursos/{cursoId}/materiais/{id}` | Metadados |
| GET | `/api/v1/cursos/{cursoId}/materiais/{id}/download` | Stream autenticado (não URL MinIO pública) |

Metadados: `nomeOriginal`, `tamanho`, `mime`, `createdAt`, `autorId`, `cursoId`. Storage UUID (RFN-005).

---

## 7. Processos de revisão (RF-022, RF-030–035, US-013, US-020–024)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| POST | `/api/v1/processos` | Inicia processo (`cursoId`, `materialApoioId?`) → 201 + estado `rascunho` |
| GET | `/api/v1/processos/{id}` | Agregado de estado, critérios, arquivos |
| PATCH | `/api/v1/processos/{id}/preparacao` | Curso, critérios, metadados do wizard |
| POST | `/api/v1/processos/{id}/arquivos` | multipart: tipo `qe` \| `material` \| `referencia` |
| POST | `/api/v1/processos/{id}/preparacao/confirmar` | Valida RF-034; estado `preparacao_concluida`; pode enfileirar IA → 202 se job |

Transições inválidas: **409**. Critério normativo sem referências: confirmação exige `cienteLimitacao: true` (RF-034).

Estados: `rascunho`, `preparacao_concluida`, `revisao_ia`, `qe`, `relatorio`, `concluido`.

---

## 8. Jobs e IA (RF-040–041, RF-090–091, US-025–026)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/jobs/{jobId}` | `queued` \| `running` \| `succeeded` \| `failed` |
| POST | `/api/v1/processos/{id}/ia/retry` | Reenfileira se falha (RF-091); 202 |
| GET | `/api/v1/processos/{id}/sugestoes` | Lista persistida (não chama provedor) |

Frontend **não** possui URL do Ollama. Se `AI_ENABLED=false`: `POST .../ia/retry` e job inicial retornam **403** ou **422** com código `AI_DISABLED` (G-09).

Payload interno da Facade (não exposto ao browser): trechos extraídos + critérios + metadados; **não** logar texto integral.

---

## 9. Sugestões HITL (RF-042–044, US-027–029)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| POST | `/api/v1/sugestoes/{id}/decisao` | `{ decisao: "aceita" \| "rejeitada", comentario? }` idempotente |
| PATCH | `/api/v1/sugestoes/{id}/especialista` | Flag + nota de encaminhamento (RF-043) |
| POST | `/api/v1/processos/{id}/etapas/qe` | Avança para QE; **422** se sugestões IA pendentes (RF-044) |

Sugestão: categoria, trecho, texto sugerido, justificativa, estado `pendente|aceita|rejeitada`.

---

## 10. Conferência QE (RF-050–053, US-030–032)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/processos/{id}/qe/matriz` | Itens + status cobertura + nível hierárquico |
| PATCH | `/api/v1/processos/{id}/qe/itens/{itemId}` | Localização, divergências, texto (RF-052) |
| POST | `/api/v1/processos/{id}/qe/concluir` | Estado `qe_concluida` / `relatorio` (RF-053) |

Status item: `contemplado`, `cobertura_parcial`, `nao_localizado`.

---

## 11. Relatórios e exportações (RF-060–063, US-034–036)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/processos/{id}/relatorio` | JSON consolidado para a UI (RF-060) |
| POST | `/api/v1/processos/{id}/exportacoes/docx` | Job 202 — material com aceites aplicados |
| POST | `/api/v1/processos/{id}/exportacoes/pdf` | Job 202 — relatórios PDF (Should RF-062) |
| GET | `/api/v1/exportacoes/{id}/download` | Stream autenticado |
| POST | `/api/v1/processos/{id}/encerrar` | Estado `concluido`; bloqueia edição (RF-063) |

Geração **nunca** aplica trechos não aceitos (RFN-060).

---

## 12. Histórico e auditoria (RF-070–071, US-037–038)

| Método | Caminho | Descrição |
|--------|---------|-----------|
| GET | `/api/v1/processos` | Filtro `cursoId`, `estado`; listagem |
| GET | `/api/v1/processos/{id}/eventos` | Trilha somente leitura (append-only) |

Eventos: tipo, timestamp, `userId`, payload resumido **sem** Word integral.

---

## 13. Facade — composição (RFN-041)

Exemplos de orquestração **no BFF**, invisíveis ao frontend:

- `POST .../preparacao/confirmar` → valida critérios + grava PG + objetos MinIO + publica AMQP + evento auditoria.
- Job IA → Storage (texto extraído) + IaFacade + persistência de sugestões + evento `ia_concluida` ou `ia_falha`.
- Export docx → lê originais MinIO + decisões PG → gera arquivo → MinIO → notifica job succeeded.

---

## 14. Fora desta especificação

- Schemas JSON Schema / componentes OpenAPI nomeados
- Códigos de erro enumerados por endpoint
- Versionamento de campos de QE parseado
- gRPC com o provedor de IA (opcional no adapter; REST Ollama no piloto)

Esses pontos pertencem a `technical/` após este SAD.
