# User Stories Ready for Dev — SAD-ILA

**Versão:** 1.1  
**Data:** 2026-10-01  
**Rastreabilidade:** `requirements-traceability-matrix.md`, `functional-requirements.md`, `technical/` (especificações, OpenAPI, `schema.sql`, integrações)  
**Notas:** Tarefas técnicas refinadas pós-especificação em `technical/`

---

## Personas

| ID | Persona | Descrição |
|----|---------|-----------|
| **P-REV** | Revisor de material didático | Conduz revisão, decide sugestões, confere QE |
| **P-ADM-C** | Administrador de cursos | Cadastra cursos e gerencia materiais |
| **P-ADM-S** | Administrador de sistema (TI) | Provisiona usuários, opera ambiente |
| **P-ESP** | Especialista de conteúdo | Valida lacunas técnicas (interação via revisor) |

---

## Índice de User Stories

| US | Título | Epic | Fase | RF | Dev |
|----|--------|------|------|-----|-----|
| US-001 | Login com e-mail e senha | E1 | MVP | RF-001, RF-002 | |
| US-002 | Ambiente Docker e health checks | E0 | MVP | RFN-020 | ✅ Concluída |
| US-003 | API v1, OpenAPI e CORS | E0 | MVP | RFN-040, RFN-006 | |
| US-004 | Logout | E1 | MVP | RF-004 | |
| US-005 | Proteção de rotas e RBAC | E1 | MVP | RF-003 | |
| US-006 | Provisionamento de usuários | E1 | MVP | RF-005 | |
| US-007 | Logs estruturados e correlation ID | E0 | MVP | RFN-042 | |
| US-008 | Página e listagem de cursos | E2 | MVP | RF-010 | |
| US-009 | Cadastro de curso | E2 | MVP | RF-011 | |
| US-010 | Hub do curso (detalhe) | E2 | MVP | RF-012 | |
| US-011 | Upload de material de apoio | E2 | MVP | RF-020 | |
| US-012 | Listagem e download de materiais | E2 | MVP | RF-021 | |
| US-013 | Iniciar processo de revisão | E2/E3 | MVP | RF-022 | |
| US-014 | Layout shell e navegação responsiva | E8 | MVP | RF-080 | |
| US-020 | Wizard — seleção de curso | E3 | F2 | RF-030 | |
| US-021 | Wizard — upload QE e material Word | E3 | F2 | RF-031 | |
| US-022 | Wizard — referências técnicas | E3 | F2 | RF-032 | |
| US-023 | Wizard — critérios de revisão | E3 | F2 | RF-033 | |
| US-024 | Wizard — aviso RB-02 e confirmação | E3 | F2 | RF-034, RF-035 | |
| US-025 | Facade de IA e fila de processamento | E4 | F2 | RF-090, RF-091 | |
| US-026 | Geração e persistência de sugestões | E4 | F2 | RF-040, RF-041 | |
| US-027 | Interface aceitar/rejeitar sugestões | E4 | F2 | RF-042 | |
| US-028 | Progressão para etapa QE | E4 | F2 | RF-044 | |
| US-029 | Escalonamento “validar com especialista” | E4 | F2 | RF-043 | |
| US-030 | Matriz de conferência QE | E5 | F3 | RF-050, RF-051 | |
| US-031 | Detalhamento de item QE | E5 | F3 | RF-052 | |
| US-032 | Conclusão da conferência QE | E5 | F3 | RF-053 | |
| US-034 | Relatório final consolidado | E6 | F3 | RF-060 | |
| US-035 | Exportação material revisado (.docx) | E6 | F3 | RF-061 | |
| US-036 | Encerramento e export PDF (Should) | E6 | F3 | RF-062, RF-063 | |
| US-037 | Trilha de auditoria do processo | E7 | F2 | RF-070 | |
| US-038 | Consulta de histórico por curso | E7 | F2/F3 | RF-071 | |
| US-041 | Identidade visual institucional | E8 | F2 | RF-081 | |

### Status de entrega (desenvolvimento)

| US | Estado | Documentação | Testes (acumulado) |
|----|--------|--------------|-------------------|
| US-002 | **Concluída** (2026-10-01) | [docs/implementation/US-002-ambiente-docker-health.md](../docs/implementation/US-002-ambiente-docker-health.md) | 13 pass — [testing/test-results.md](../testing/test-results.md) |

---

## Epic E0 — Fundação técnica

### US-002: Ambiente Docker e health checks

**Como um** administrador de sistema (P-ADM-S),  
**Eu quero** subir frontend, backend, banco e storage via Docker Compose,  
**Para que** a equipe desenvolva e teste de forma reprodutível no Windows/Docker Desktop.

#### Critérios de Aceitação

**AC 01: Stack sobe com um comando**
- **Dado** que tenho Docker Desktop em execução
- **Quando** executo `docker compose up` na raiz do projeto
- **Então** os serviços frontend, backend, database e volume de arquivos ficam healthy
- **E** `GET /health` no backend retorna 200
- **E** `GET /ready` retorna 200 após Postgres (**Must**) e, quando configurados, MinIO/RabbitMQ (**Should** — ver OpenAPI)

**AC 02: Variáveis de ambiente**
- **Dado** um arquivo `.env.example` documentado
- **Quando** copio para `.env` local
- **Então** nenhum segredo é commitado (`.gitignore` contém `.env`)

#### Tarefas Técnicas Sugeridas

**Backend:**
- [x] Criar `Dockerfile` multi-stage do ApiBff (NestJS): stage `development` com `nest start --watch`; stage `production` com build compilado (`technical-specifications.md` §2)
- [x] Implementar `HttpApiModule` + `HealthController`: `GET /health` (liveness, 200 sem DB); `GET /ready` (readiness) — Postgres **Must** (`DATABASE_URL`); MinIO/RabbitMQ **Should** → 503 se down (`openapi.yaml` `/health`, `/ready`; ADR-009)
- [x] Configurar bootstrap ORM (Prisma/TypeORM) com retry até Postgres aceitar conexão
- [x] Documentar no README raiz (item único desta US): `docker compose up`, `docker compose exec api npm …`, logs e portas (`4000` api, `3000` web)

**Frontend:**
- [x] `Dockerfile` Next.js App Router: profile dev (`npm run dev :3000`); prod (`next build && next start`)
- [x] Env compose `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1` (`integration-specs.md` §2.1)
- [x] `.env.example` frontend com `NEXT_PUBLIC_API_URL` documentado

**Data:**
- [x] Serviço `postgres:16` no `docker-compose.yml` com volume `postgres_data` e rede interna (`integration-specs.md` §3)
- [x] Serviços `minio` (API :9000, console :9001) e `rabbitmq:3` com volumes persistentes; env `MINIO_*`, `RABBITMQ_URL` só no serviço `api`
- [x] Hook de migrações: comando `api` aguarda Postgres e roda migrate (schema alvo `technical/data-models/schema.sql` — aplicar incrementalmente por US)

**Test:**
- [x] Integração Jest US-002 (`testing/integration/us-002-ac01-health.spec.ts`, `us-002-ac02-env.spec.ts`, `us-002-web-smoke.spec.ts`; unitários em `testing/unit/`)
- [x] Script npm `test:smoke-compose` documentado no README para CI local Windows/Docker Desktop

#### Status de implementação

| Campo | Valor |
|-------|--------|
| **Estado** | Concluída |
| **Concluída em** | 2026-10-01 |
| **Guia** | [docs/implementation/US-002-ambiente-docker-health.md](../docs/implementation/US-002-ambiente-docker-health.md) |
| **Apps** | [apps/README.md](../apps/README.md) |
| **Code review** | [revision/2026-10-01-1025/](../revision/2026-10-01-1025/) |
| **AppSec** | [security/revisao-us-002-appsec.md](../security/revisao-us-002-appsec.md) |
| **QA** | 13 testes — [testing/test-results.md](../testing/test-results.md) |

#### Dependências e Notas

- **Depende de:** nenhuma
- **Referências:** RFN-020, G-13

---

### US-003: API v1, OpenAPI e CORS

**Como um** desenvolvedor frontend (P-ADM-S indireto),  
**Eu quero** contrato OpenAPI e CORS configurado,  
**Para que** integre telas sem adivinhar endpoints e sem erros de origem.

#### Critérios de Aceitação

**AC 01: Documentação OpenAPI**
- **Dado** backend em execução
- **Quando** acesso `/api/docs` (ou path configurado)
- **Então** visualizo OpenAPI 3.x com rotas v1 e esquema `bearerAuth`

**AC 02: CORS**
- **Dado** frontend servido na origem configurada em `CORS_ORIGINS`
- **Quando** o browser faz preflight OPTIONS
- **Então** recebo headers CORS válidos
- **E** origem não listada é bloqueada

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `main.ts`: prefixo global `/api/v1`; exceções `/health` e `/ready` fora do prefixo (`technical-specifications.md` §3)
- [ ] Integrar `@nestjs/swagger`: UI em `/api/docs`, JSON em `/api/docs-json`; carregar contrato alinhado a `technical/api-contracts/openapi.yaml` (`bearerAuth` JWT)
- [ ] `CorsMiddleware`/`enableCors`: origens de `CORS_ORIGINS` (lista vírgula); métodos GET/POST/PATCH/PUT/DELETE/OPTIONS; headers `Authorization`, `Content-Type`, `Idempotency-Key`, `X-Correlation-Id` (RFN-006)
- [ ] `GlobalExceptionFilter` retornando `ApiError { code, message, correlationId }` conforme OpenAPI
- [ ] Limites body parser alinhados a `MAX_UPLOAD_MB` (RFN-010)

**Frontend:**
- [ ] Módulo `lib/api/client.ts`: `fetch` base `NEXT_PUBLIC_API_URL`, interceptor `Authorization: Bearer`, propagação opcional `X-Correlation-Id`
- [ ] Tratamento 401 global → redirect `/login` (`integration-specs.md` §2.4)
- [ ] (Opcional) gerar tipos com `openapi-typescript` apontando para `/api/docs-json`

**Data:**
- [ ] N/A — contrato HTTP/CORS; persistência nas US de domínio (schema vazio ou migração baseline apenas se exigido pelo ORM no bootstrap)

**Test:**
- [ ] `testing/integration/cors.spec.ts`: preflight OPTIONS origem permitida (`http://localhost:3000`) vs origem negada
- [ ] `testing/integration/openapi-contract.spec.ts`: validar que spec runtime inclui tags Auth, Cursos, Processos e `components.securitySchemes.bearerAuth`

#### Dependências e Notas

- **Depende de:** US-002
- **Referências:** RFN-040, RFN-006, TODOs.md

---

### US-007: Logs estruturados e correlation ID

**Como um** operador TI (P-ADM-S),  
**Eu quero** logs JSON com correlation ID por requisição,  
**Para que** diagnostique falhas em revisão e integração IA.

#### Critérios de Aceitação

**AC 01: Propagação de correlation ID**
- **Dado** uma requisição com header `X-Correlation-Id` ou gerado pelo servidor
- **Quando** a requisição percorre controllers e serviços
- **Então** todos os logs da requisição contêm o mesmo `correlationId`

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `CorrelationIdInterceptor`: ler `X-Correlation-Id` ou gerar UUID v4; ecoar no response header; armazenar em `AsyncLocalStorage`/request scope
- [ ] Logger JSON (Pino ou Winston): campos `level`, `time`, `correlationId`, `userId` (JWT sub), `route`, `method` (RFN-042)
- [ ] Redaction: nunca logar `password`, JWT integral, corpo multipart Word/PDF, texto extraído IA (`technical-specifications.md` §9)
- [ ] Incluir `correlationId` no `GlobalExceptionFilter` (`ApiError`)

**Frontend:**
- [ ] Cliente HTTP: enviar `X-Correlation-Id` (UUID por sessão de página ou por request) em chamadas autenticadas
- [ ] Exibir `correlationId` em toast de erro 5xx para suporte TI (Should)

**Data:**
- [ ] N/A — logs em stdout do container; sem tabela de logs v1

**Test:**
- [ ] Unit `testing/unit/correlation-id.interceptor.spec.ts`: header ausente → UUID gerado; header presente → preservado
- [ ] Integração: request com correlation fixo → logs capturados (mock logger) contêm mesmo id

#### Dependências e Notas

- **Depende de:** US-003
- **Referências:** RFN-042, RFN-007

---

## Epic E1 — Acesso e identidade

### US-001: Login com e-mail e senha

**Como um** revisor (P-REV),  
**Eu quero** autenticar com e-mail e senha,  
**Para que** acesse o painel de cursos com segurança.

#### Critérios de Aceitação

**AC 01: Login bem-sucedido**
- **Dado** que possuo conta ativa
- **E** estou em `/login`
- **Quando** informo e-mail e senha corretos e envio o formulário
- **Então** recebo JWT válido
- **E** sou redirecionado para `/cursos`

**AC 02: Credenciais inválidas**
- **Dado** e-mail ou senha incorretos
- **Quando** envio o formulário
- **Então** vejo mensagem genérica "Credenciais inválidas"
- **E** permaneço em `/login` sem token

**AC 03: Campos obrigatórios**
- **Dado** e-mail vazio
- **Quando** tento enviar
- **Então** validação impede submit e exibe erro de campo

**AC 04: Token expirado**
- **Dado** JWT expirado
- **Quando** acesso rota protegida
- **Então** sou redirecionado a `/login` com mensagem de sessão expirada

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `AuthModule`: `POST /api/v1/auth/login` (`LoginDto`: email, password) → `{ accessToken, expiresIn, user }` (`openapi.yaml` `/auth/login`)
- [ ] `AuthService`: buscar `auth_users` por `email`; rejeitar `ativo=false` com **401** genérico (sem enumeração)
- [ ] Hash ADR-007: `SHA256(salt || plaintext || PASSWORD_PEPPER)`; campos `password_hash`, `password_salt`, `hash_algorithm='sha256_v1'`; compare constant-time
- [ ] JWT: claims `sub`, `email`, `roles[]` (`revisor`|`admin_cursos`|`admin_sistema`); `JWT_SECRET`, `JWT_EXPIRES_IN` default 8h
- [ ] Rate limit Should por IP (~10/min login) — ThrottlerGuard ou middleware
- [ ] `AuditoriaService` (transversal): evento `login_success`/`login_failure` em `eventos_auditoria` sem payload sensível

**Frontend:**
- [ ] Rota `/login` (SSG + form client); validação email RFC5322 simplificada e campos obrigatórios (AC 03)
- [ ] `AuthProvider`: token em memória + `sessionStorage`; pós-login redirect `/cursos`
- [ ] Mensagem genérica "Credenciais inválidas" em 401 login (AC 02)
- [ ] Interceptor 401 em rotas protegidas → limpar token + `/login?expired=1` (AC 04)

**Data:**
- [ ] Migração tabela `auth_users` (`id`, `email` UNIQUE, `nome`, `password_hash`, `password_salt`, `hash_algorithm`, `roles`, `ativo`, timestamps) — `schema.sql` L11–27
- [ ] Índice `idx_auth_users_email`
- [ ] Seed dev **somente** via script documentado (`npm run seed:dev` no container api); nunca credenciais no repo

**Test:**
- [ ] Unit `testing/unit/auth-password.spec.ts`: hash/compare sha256_v1
- [ ] Integração `testing/integration/auth-login.spec.ts`: login ok; credenciais inválidas 401; usuário `ativo=false` 401
- [ ] E2E `testing/e2e/login.spec.ts`: login → lista `/cursos` (Playwright no container QA)

#### Dependências e Notas

- **Depende de:** US-002, US-003
- **Referências:** RF-001, RF-002, RFN-003, RN-005, RN-008

---

### US-004: Logout

**Como um** usuário autenticado (P-REV),  
**Eu quero** encerrar minha sessão,  
**Para que** outra pessoa não acesse o sistema na mesma estação.

#### Critérios de Aceitação

**AC 01: Logout**
- **Dado** sessão ativa
- **Quando** clico em "Sair"
- **Então** token é removido do cliente
- **E** sou redirecionado a `/login`

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/auth/logout` autenticado (`JwtAuthGuard`) — `openapi.yaml` `/auth/logout`
- [ ] `AuthService.logout`: inserir fingerprint JWT em `token_denylist` (`token_fingerprint`, `user_id`, `expira_em`) Should (ADR-006); `JwtAuthGuard` checa denylist
- [ ] Resposta 204/200 sem corpo sensível

**Frontend:**
- [ ] Ação "Sair" no `AppShell`: `POST /auth/logout` + limpar `sessionStorage`/context; cancelar fetches pendentes (AbortController)
- [ ] Redirect imediato `/login`

**Data:**
- [ ] Migração `token_denylist` + índice `idx_token_denylist_expira` (`schema.sql` L32–41)
- [ ] Job Should: purge registros com `expira_em < now()` (cron ou startup)

**Test:**
- [ ] Integração: logout + reuse token → 401 se denylist habilitada
- [ ] E2E `testing/e2e/logout.spec.ts`: após Sair, `/cursos` redireciona login

#### Dependências e Notas

- **Depende de:** US-001

---

### US-005: Proteção de rotas e RBAC

**Como um** administrador de sistema (P-ADM-S),  
**Eu quero** que papéis limitem ações no sistema,  
**Para que** apenas pessoas autorizadas cadastrem cursos ou administrem usuários.

#### Critérios de Aceitação

**AC 01: Rota protegida**
- **Dado** usuário não autenticado
- **Quando** acesso `/cursos`
- **Então** sou redirecionado a `/login`

**AC 02: RBAC cadastro curso**
- **Dado** usuário com papel `revisor` apenas
- **Quando** tento `POST /api/v1/cursos`
- **Então** recebo HTTP 403

**AC 03: RBAC admin**
- **Dado** usuário `admin_sistema`
- **Quando** acesso `/admin/usuarios`
- **Então** página é exibida

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `JwtAuthGuard` global (exceto login, health, docs dev)
- [ ] `RolesGuard` + decorator `@Roles('admin_cursos', …)` por handler; matriz RBAC documentada no OpenAPI por operation
- [ ] Exemplo: `POST /cursos` exige `admin_cursos` ou `admin_sistema`; `GET /cursos` qualquer autenticado (403 vs 401)

**Frontend:**
- [ ] Layout `(authenticated)/layout.tsx` com `RequireAuth`: redirect `/login` se sem token
- [ ] `RequireRole` para `/admin/usuarios` (`admin_sistema`) e botão "Novo curso" (`admin_cursos`|`admin_sistema`)
- [ ] Ocultar ações mutáveis conforme `user.roles` de `GET /auth/me`

**Data:**
- [ ] N/A — RBAC derivado de `auth_users.roles`; sem tabela ACL v1

**Test:**
- [ ] Integração `testing/integration/rbac.spec.ts`: sem token 401; `revisor` em `POST /cursos` 403; `admin_sistema` em `/admin/usuarios` 200
- [ ] E2E: revisor não vê "Novo curso" (AC 03)

#### Dependências e Notas

- **Depende de:** US-001
- **Referências:** RF-003, RFN-004

---

### US-006: Provisionamento de usuários

**Como um** administrador de sistema (P-ADM-S),  
**Eu quero** cadastrar e desativar usuários,  
**Para que** apenas militares/civis autorizados acessem o SAD-ILA.

#### Critérios de Aceitação

**AC 01: Criar usuário**
- **Dado** papel `admin_sistema`
- **Quando** cadastro e-mail, nome, papel e senha inicial
- **Então** usuário é persistido com hash de senha
- **E** aparece na listagem

**AC 02: Desativar**
- **Dado** usuário ativo
- **Quando** desativo a conta
- **Então** login subsequente falha com mensagem apropriada

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `UsersModule`: `GET /api/v1/usuarios` paginado; `POST /api/v1/usuarios` (`UsuarioCreateDto`: email, nome, roles, senhaInicial); `PATCH /api/v1/usuarios/{id}` (`ativo`, nome, roles) — `openapi.yaml` `/usuarios`
- [ ] RBAC: `@Roles('admin_sistema')` em todas mutations/list admin
- [ ] `POST`: validar email UNIQUE → 409; hash senha via `AuthService`; nunca retornar hash
- [ ] `PATCH ativo=false`: próximo login 401

**Frontend:**
- [ ] Página `/admin/usuarios`: tabela paginada + modal criar/editar; confirmação antes de desativar
- [ ] Hook `useUsuarios` consumindo cliente HTTP BFF

**Data:**
- [ ] Garantir constraint `auth_users_email_uk` e `auth_users_roles_check` (`schema.sql` L23–26)
- [ ] Índice email já existente; migration incremental se US-001 já aplicou base

**Test:**
- [ ] Integração CRUD admin; non-admin → 403
- [ ] Integração: desativar usuário → login falha

#### Dependências e Notas

- **Depende de:** US-005
- **Referências:** RF-005, P-TI-01

---

## Epic E2 — Cursos e materiais

### US-008: Página e listagem de cursos

**Como um** revisor (P-REV),  
**Eu quero** ver todos os cursos após login,  
**Para que** escolha onde trabalhar.

#### Critérios de Aceitação

**AC 01: Listagem**
- **Dado** autenticado com cursos cadastrados
- **Quando** acesso `/cursos`
- **Então** vejo cards/linhas com título e descrição resumida
- **E** posso abrir detalhe de um curso

**AC 02: Lista vazia**
- **Dado** nenhum curso
- **Quando** acesso `/cursos`
- **Então** vejo estado vazio orientando cadastro (se admin) ou contato admin

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `CursosModule`: `GET /api/v1/cursos?page=&pageSize=` → `PaginatedCursos` (`openapi.yaml` `/cursos`)
- [ ] Autenticação JWT; sem papel especial para listagem
- [ ] Projeção DTO: `id`, `titulo`, `descricao`, `createdAt` (sem secrets)

**Frontend:**
- [ ] Rota `/cursos` dentro de `AppShell`; fetch client-side ou RSC com revalidate
- [ ] Componentes `CourseCard`, skeleton loading, `EmptyState` (admin vs revisor — AC 02)
- [ ] Link para `/cursos/[id]`

**Data:**
- [ ] Migração `cursos` (`id`, `titulo` UNIQUE, `descricao`, timestamps) — `schema.sql` L47–54
- [ ] Índice/constraint `cursos_titulo_uk`

**Test:**
- [ ] Integração listagem paginada; lista vazia `items:[]`
- [ ] E2E `testing/e2e/cursos-list.spec.ts`: navegar para detalhe

#### Dependências e Notas

- **Depende de:** US-001, US-014 (shell)
- **Referências:** RF-010, RN-001

---

### US-009: Cadastro de curso

**Como um** administrador de cursos (P-ADM-C),  
**Eu quero** cadastrar curso com título e descrição,  
**Para que** organize materiais e revisões.

#### Critérios de Aceitação

**AC 01: Cadastro válido**
- **Dado** papel `admin_cursos`
- **Quando** preencho título e descrição e salvo
- **Então** curso aparece na listagem

**AC 02: Validação**
- **Dado** título vazio
- **Quando** salvo
- **Então** erro 400 com mensagem de validação

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/cursos` body `{ titulo, descricao }` — roles `admin_cursos`|`admin_sistema`
- [ ] Validação DTO: título obrigatório, limites `CURSO_TITULO_MAX`, `CURSO_DESCRICAO_MAX` → 400
- [ ] Violação UNIQUE `titulo` → 409 `CURSO_TITULO_DUPLICADO`

**Frontend:**
- [ ] Modal "Novo curso" ou rota `/cursos/novo`; react-hook-form + zod
- [ ] Toast sucesso → refresh listagem; exibir erro 409 amigável

**Data:**
- [ ] Confirmar constraint `cursos_titulo_uk` na migração (já em US-008)

**Test:**
- [ ] Integração POST válido 201; título vazio 400; duplicate 409
- [ ] RBAC: revisor 403

#### Dependências e Notas

- **Depende de:** US-008, US-005
- **Referências:** RF-011, RN-002

---

### US-010: Hub do curso (detalhe)

**Como um** revisor (P-REV),  
**Eu quero** abrir um curso e ver materiais e ações,  
**Para que** inicie revisão no contexto correto.

#### Critérios de Aceitação

**AC 01: Detalhe**
- **Dado** curso existente
- **Quando** acesso `/cursos/{id}`
- **Então** vejo título, descrição, lista de materiais e botão "Iniciar Revisão"

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `GET /api/v1/cursos/{id}` — facade/hub: curso + contagem `materiais_apoio` + processos recentes (`processos_revisao` filtro `curso_id`) (`openapi.yaml` `/cursos/{id}`)
- [ ] 404 se curso inexistente

**Frontend:**
- [ ] Página `/cursos/[id]`: título, descrição, lista resumo materiais, CTA "Iniciar Revisão"
- [ ] Breadcrumb Cursos → [titulo]

**Data:**
- [ ] Índices consulta hub: `idx_materiais_curso_created`, `idx_processos_curso_estado` (`schema.sql`)

**Test:**
- [ ] Integração GET hub com fixtures
- [ ] E2E: abrir curso a partir da lista

#### Dependências e Notas

- **Depende de:** US-008
- **Referências:** RF-012, RN-003, RN-004

---

### US-011: Upload de material de apoio

**Como um** administrador de cursos (P-ADM-C),  
**Eu quero** enviar arquivos de apoio ao curso,  
**Para que** revisores tenham referência centralizada.

#### Critérios de Aceitação

**AC 01: Upload ok**
- **Dado** arquivo PDF ou DOCX dentro do limite
- **Quando** faço upload no curso
- **Então** arquivo aparece na listagem com nome e data

**AC 02: Arquivo grande**
- **Dado** arquivo acima de `MAX_UPLOAD_MB`
- **Quando** tento upload
- **Então** recebo erro claro sem persistir arquivo parcial

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `MateriaisModule`: `POST /api/v1/cursos/{cursoId}/materiais` multipart (`file`) — roles: `revisor`|`admin_cursos`|`admin_sistema` (`technical-specifications.md` §7)
- [ ] Validar MIME/extensão `.pdf`, `.docx`; tamanho ≤ `MAX_UPLOAD_MB` → **413**
- [ ] `StorageService.putObject`: key `cursos/{cursoId}/materiais/{uuid}` (MinIO ADR-011)
- [ ] Insert `materiais_apoio`: `curso_id`, `autor_id`, `nome_original`, `tamanho_bytes`, `mime_type`, `storage_key`
- [ ] Auditoria `material_apoio_criado`

**Frontend:**
- [ ] Componente `MaterialUploadDropzone` no hub curso; barra progresso; validação cliente MIME/tamanho
- [ ] Multipart via `FormData` + cliente HTTP (sem URL MinIO direta)

**Data:**
- [ ] Migração `materiais_apoio` + `idx_materiais_curso_created`, UNIQUE `storage_key` (`schema.sql` L56–68)

**Test:**
- [ ] Integração upload ok + metadados DB; arquivo oversize 413; MIME inválido 400
- [ ] Mock MinIO em teste integração

#### Dependências e Notas

- **Depende de:** US-010
- **Referências:** RF-020, RFN-005, RFN-010

---

### US-012: Listagem e download de materiais

**Como um** revisor (P-REV),  
**Eu quero** baixar material de apoio,  
**Para que** consulte offline se necessário.

#### Critérios de Aceitação

**AC 01: Download autenticado**
- **Dado** material existente
- **Quando** clico download
- **Então** recebo arquivo com nome original
- **E** requisição sem JWT falha

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `GET /api/v1/cursos/{cursoId}/materiais` lista metadados paginada
- [ ] `GET /api/v1/cursos/{cursoId}/materiais/{id}/download` stream proxy MinIO + `Content-Disposition: attachment; filename="..."` (`openapi.yaml`)
- [ ] JWT obrigatório; RBAC leitura autenticado

**Frontend:**
- [ ] Tabela materiais no hub; botão download via `fetch` blob + save (nunca link público MinIO)

**Data:**
- [ ] N/A — reutiliza `materiais_apoio` (US-011)

**Test:**
- [ ] Integração download 200 com auth; sem token 401
- [ ] Integração listagem após upload

#### Dependências e Notas

- **Depende de:** US-011
- **Referências:** RF-021

---

### US-013: Iniciar processo de revisão

**Como um** revisor (P-REV),  
**Eu quero** iniciar revisão a partir do curso,  
**Para que** o sistema vincule rastreabilidade ao curso (RB-04).

#### Critérios de Aceitação

**AC 01: Criar processo**
- **Dado** curso selecionado
- **Quando** clico "Iniciar Revisão"
- **Então** processo é criado com estado `rascunho` ou `preparacao`
- **E** navego para wizard (`/revisao/{processoId}/preparacao`)

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `ProcessoRevisaoModule`: `POST /api/v1/processos` body `{ cursoId, materialApoioId? }` — role `revisor`+ (`openapi.yaml`)
- [ ] Header `Idempotency-Key` Should: replay `(key,user_id)` → mesmo `processo_id` (`idempotency_keys`)
- [ ] Insert `processos_revisao`: `estado='rascunho'`, `responsavel_id=sub`, `curso_id`, RB-04
- [ ] `AuditoriaService`: `processo_criado`

**Frontend:**
- [ ] Botão hub "Iniciar Revisão" → POST + redirect `/revisao/[processoId]/preparacao`
- [ ] Enviar `Idempotency-Key` UUID no POST

**Data:**
- [ ] Migração `processos_revisao` + enum `processo_estado`; índices `idx_processos_curso_estado`, `idx_processos_responsavel` (`schema.sql` L74–97)
- [ ] Tabela `idempotency_keys` (`schema.sql` L126–134)

**Test:**
- [ ] Integração cria processo `rascunho` com `curso_id` correto
- [ ] Idempotency: mesma key → 201/200 mesmo id

#### Dependências e Notas

- **Depende de:** US-010
- **Referências:** RF-022, RN-004, RB-04

---

### US-014: Layout shell e navegação responsiva

**Como um** revisor (P-REV),  
**Eu quero** navegação clara e layout responsivo,  
**Para que** use o sistema em desktop e tablet no ILA.

#### Critérios de Aceitação

**AC 01: Shell autenticado**
- **Dado** usuário logado
- **Então** vejo header com logo ILA, menu (Cursos, Histórico), usuário e Sair
- **E** conteúdo responsivo ≥768px

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] N/A — shell é responsabilidade WebApp; backend expõe apenas `GET /auth/me` para dados usuário no header

**Frontend:**
- [ ] `AppShell`: header logo ILA, nav Cursos + Histórico (`/historico`), nome usuário, Sair
- [ ] Layout `(authenticated)` com outlet; rotas públicas `/login` fora do shell
- [ ] CSS breakpoints ≥768px; sidebar colapsável tablet (RF-080)
- [ ] Integrar tokens US-041 quando disponíveis (fallback neutro MVP)

**Data:**
- [ ] N/A — sem persistência

**Test:**
- [ ] E2E `testing/e2e/app-shell.spec.ts`: viewport 768px menu visível; logout no header
- [ ] Unit snapshot opcional componente `AppShell`

#### Dependências e Notas

- **Paralelo a E2**
- **Referências:** RF-080, RN-026

---

## Epic E3 — Preparação de revisão

### US-020: Wizard — seleção de curso

**Como um** revisor (P-REV),  
**Eu quero** confirmar ou selecionar o curso da revisão,  
**Para que** o material fique vinculado corretamente (RN-009).

#### Critérios de Aceitação

**AC 01: Curso pré-selecionado**
- **Dado** processo criado a partir do curso X
- **Quando** abro preparação
- **Então** curso X está selecionado e bloqueado

**AC 02: Seleção manual**
- **Dado** processo sem curso (edge)
- **Quando** escolho curso na lista
- **Então** `curso_id` é persistido ao avançar

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `PATCH /api/v1/processos/{id}/preparacao` body `PreparacaoPatch` incl. `cursoId` — só se `estado='rascunho'` (`openapi.yaml`)
- [ ] Validar curso existe; 409 se estado não permite edição
- [ ] Persistir `processos_revisao.curso_id` (RN-009)

**Frontend:**
- [ ] Wizard step 1 `/revisao/[id]/preparacao`: curso pré-selecionado bloqueado se veio do hub; select searchable se edge
- [ ] Salvar ao avançar step (PATCH)

**Data:**
- [ ] N/A — coluna `curso_id` já em `processos_revisao`

**Test:**
- [ ] Integração PATCH curso; processo de outro estado → 409

#### Dependências e Notas

- **Depende de:** US-013
- **Referências:** RF-030, RN-009

---

### US-021: Wizard — upload QE e material Word

**Como um** revisor (P-REV),  
**Eu quero** enviar QE e material em Word,  
**Para que** a revisão use os insumos oficiais (RN-010).

#### Critérios de Aceitação

**AC 01: Dois DOCX obrigatórios**
- **Dado** step de arquivos
- **Quando** envio QE.docx e material.docx válidos
- **Então** arquivos ficam imutáveis como versão original do processo

**AC 02: Formato inválido**
- **Quando** envio .pdf como material principal
- **Então** erro de validação (política: material/QE Must docx)

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/arquivos` multipart: campo `tipo` (`qe`|`material`) + `file` — RF-031
- [ ] Validar **Must** `.docx` para qe/material; rejeitar PDF no slot material principal
- [ ] MinIO key `processos/{processoId}/{tipo}/{uuid}`; insert `arquivos_processo` (UK parcial um qe + um material — `schema.sql` L114–115)
- [ ] Bloquear replace após `preparacao_confirmada_em` preenchido (RN-024)

**Frontend:**
- [ ] Wizard step 2: dois uploaders obrigatórios QE.docx e material.docx; estado local + feedback erro MIME

**Data:**
- [ ] Migração `arquivos_processo` + enum `arquivo_processo_tipo`; índices UK parciais (`schema.sql` L99–117)

**Test:**
- [ ] Integração upload par qe+material; PDF material → 400
- [ ] Integração re-upload após confirmar preparação → 409

#### Dependências e Notas

- **Depende de:** US-020
- **Referências:** RF-031, RN-010, RN-024

---

### US-022: Wizard — referências técnicas

**Como um** revisor (P-REV),  
**Eu quero** anexar normas e manuais,  
**Para que** a revisão técnica normativa tenha base (RN-011).

#### Critérios de Aceitação

**AC 01: Múltiplas refs**
- **Quando** anexo 0..N arquivos PDF/DOCX
- **Então** refs associadas ao processo

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/arquivos` com `tipo=referencia` (múltiplos permitidos, sem UK parcial) — campo multipart `arquivo` + `tipo` (`openapi.yaml`)
- [ ] Remoção antes de confirmar: estender contrato com `DELETE /api/v1/processos/{id}/arquivos/{arquivoId}` (somente `estado='rascunho'`, tipo `referencia`) e registrar no `openapi.yaml`; apagar objeto MinIO + row `arquivos_processo`
- [ ] MIME PDF/DOCX; keys MinIO `processos/{processoId}/referencia/{uuid}`

**Frontend:**
- [ ] Wizard step 3: lista referências com remover; upload múltiplo

**Data:**
- [ ] N/A — tabela `arquivos_processo` tipo `referencia` (sem limite UK)

**Test:**
- [ ] Integração 0..N refs associadas ao `processo_id`
- [ ] Delete ref antes confirmar ok; após confirmar 409

#### Dependências e Notas

- **Depende de:** US-021
- **Referências:** RF-032, RN-011

---

### US-023: Wizard — critérios de revisão

**Como um** revisor (P-REV),  
**Eu quero** escolher critérios aplicáveis,  
**Para que** o relatório reflita escopo real (RB-03).

#### Critérios de Aceitação

**AC 01: Seleção múltipla**
- **Quando** marco ao menos um critério da lista RN-012
- **Então** critérios persistidos no processo

**AC 02: Nenhum critério**
- **Quando** tento avançar sem seleção
- **Então** erro "Selecione ao menos um critério"

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] Enum critérios alinhado RN-012 no DTO `PreparacaoPatch.criterios[]` (códigos string)
- [ ] Persistir em `processo_criterios` (`processo_id`, `criterio_codigo`) via PATCH preparação ou endpoint dedicado no mesmo PATCH
- [ ] Validação: ≥1 critério antes confirmar (RF-033) — enforced na confirmar (US-024)

**Frontend:**
- [ ] Wizard step 4: checklist multi-select com tooltips RN-012; bloqueio avanço sem seleção (AC 02)

**Data:**
- [ ] Migração `processo_criterios` PK composta (`schema.sql` L119–123)

**Test:**
- [ ] Integração PATCH critérios persistidos; listagem no GET processo

#### Dependências e Notas

- **Depende de:** US-022
- **Referências:** RF-033, RN-012, RB-03

---

### US-024: Wizard — aviso RB-02 e confirmação

**Como um** revisor (P-REV),  
**Eu quero** ser avisado se revisão técnica foi marcada sem referências,  
**Para que** entenda limitações antes de prosseguir (RB-02).

#### Critérios de Aceitação

**AC 01: Aviso RB-02**
- **Dado** critério "revisão técnica normativa" selecionado
- **E** zero referências
- **Quando** clico "Iniciar processamento"
- **Então** modal de confirmação explica limitação
- **E** só continua após confirmar

**AC 02: Confirmação preparação**
- **Quando** confirmo preparação completa
- **Então** status → `preparacao_concluida`
- **E** job IA enfileirado se critérios textuais/IA aplicáveis

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/preparacao/confirmar` body opcional `{ cienteLimitacaoRb02?: boolean }` (`openapi.yaml`)
- [ ] Transação ACID: validar arquivos qe+material, ≥1 critério, RB-02 (critério revisão técnica normativa sem refs → exige `cienteLimitacaoRb02=true` ou 422)
- [ ] Update `processos_revisao`: `estado='preparacao_concluida'`, `ciente_limitacao_rb02`, `preparacao_confirmada_em=now()`
- [ ] Replace `processo_criterios`; auditoria `preparacao_confirmada`
- [ ] Se critérios IA textual + `AI_ENABLED=true` → publicar AMQP `revisao.ia`, insert `jobs`, **202** + `jobId`; senão **200** → transição `qe` ou aviso `AI_DISABLED` (G-09)

**Frontend:**
- [ ] Wizard step 5 resumo (curso, arquivos, critérios, refs); modal RB-02 quando aplicável
- [ ] Botão confirmar → tratar 202 com polling `GET /jobs/{jobId}` (`integration-specs.md` §2.1)

**Data:**
- [ ] Colunas `ciente_limitacao_rb02`, `preparacao_confirmada_em` em `processos_revisao` (já no schema)

**Test:**
- [ ] Integração happy path 200/202; RB-02 path 422 sem flag; critérios vazios 422
- [ ] Integração `AI_ENABLED=false` não publica fila

#### Dependências e Notas

- **Depende de:** US-023
- **Referências:** RF-034, RF-035, RB-02, RN-023

---

## Epic E4 — Revisão IA + HITL

### US-025: Facade de IA e fila de processamento

**Como um** desenvolvedor backend,  
**Eu quero** integrar IA via facade assíncrona,  
**Para que** o frontend não dependa de timeouts longos e chaves fiquem no servidor.

#### Critérios de Aceitação

**AC 01: Job assíncrono**
- **Dado** preparação confirmada
- **Quando** job executa
- **Então** status processo passa por `processando_ia` → `revisao_ia`

**AC 02: Falha IA**
- **Dado** timeout do provedor
- **When** job falha
- **Então** status `erro_ia` com mensagem recuperável e retry permitido

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `IaFacadeModule`: interface `IaProvider.analisarMaterial()` + adapter Ollama `POST {AI_PROVIDER_BASE_URL}/api/chat` — **somente server-side** (ADR-008; frontend nunca chama Ollama)
- [ ] Env `AI_ENABLED`, `AI_REQUEST_TIMEOUT_MS` (180s), circuit breaker N falhas → open 60s
- [ ] `JobsModule`: fila durável AMQP `revisao.ia`; consumer no mesmo processo Nest (`onModuleInit`); prefetch `RABBITMQ_PREFETCH`
- [ ] Payload job `{ jobId, processoId }`; atualizar `jobs.estado` queued→running→succeeded|failed; `processos_revisao.estado` → `revisao_ia` durante processamento
- [ ] `GET /api/v1/jobs/{jobId}` para polling (`openapi.yaml`); `POST /processos/{id}/ia/retry` se falha recuperável — 422/403 se `AI_ENABLED=false`
- [ ] Auditoria `ia_iniciada`, `ia_concluida`, `ia_falha` (sem texto integral)

**Frontend:**
- [ ] N/A — consumo indireto via polling job após confirmar preparação (US-024); nenhuma env `AI_*` no Next.js

**Data:**
- [ ] Migração `jobs` + enums `job_tipo`, `job_estado`; índices `idx_jobs_processo_created`, `idx_jobs_estado` (`schema.sql` L171–189)
- [ ] Compose: serviço RabbitMQ + env `RABBITMQ_URL` no `api`; healthcheck Should no `/ready`

**Test:**
- [ ] Unit `testing/unit/ia-facade.mapper.spec.ts`: mock resposta Ollama → `SugestaoDraft[]`
- [ ] Integração Jobs com RabbitMQ testcontainer/mock: publish/consume; timeout → job `failed` + retry endpoint
- [ ] Integração `AI_ENABLED=false` → retry 422

#### Dependências e Notas

- **Depende de:** US-024; **bloqueio produção:** RFN-008 / G-09
- **Referências:** RF-090, RF-091, P-TI-03

---

### US-026: Geração e persistência de sugestões

**Como um** revisor (P-REV),  
**Eu quero** ver sugestões categorizadas com justificativa,  
**Para que** decida com contexto (RN-013, RN-015).

#### Critérios de Aceitação

**AC 01: Lista sugestões**
- **Dado** job concluído
- **Quando** abro tela de sugestões
- **Então** vejo lista com categoria, trecho, justificativa
- **E** documento original permanece inalterado no storage

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] Consumer `revisao.ia`: extrair texto DOCX material (port interno) → `IaFacade` → bulk insert `sugestoes_ia` (`categoria`, `trecho_*`, `texto_sugerido`, `justificativa`, `estado='pendente'`)
- [ ] `GET /api/v1/processos/{id}/sugestoes` paginado (`openapi.yaml`); documento original MinIO **inalterado** (RB-01)
- [ ] Mapear categorias enum `sugestao_categoria` incl. `validar_especialista`

**Frontend:**
- [ ] Página `/revisao/[id]/sugestoes`: master-detail lista; loading enquanto job não `succeeded`
- [ ] Polling job ou refetch sugestões pós-job

**Data:**
- [ ] Migração `sugestoes_ia` + enums; índice `idx_sugestoes_processo_estado` (`schema.sql` L148–165)

**Test:**
- [ ] Unit mapper IA → entidades DB
- [ ] Integração GET sugestões após job mock succeeded

#### Dependências e Notas

- **Depende de:** US-025
- **Referências:** RF-040, RF-041, RB-01

---

### US-027: Interface aceitar/rejeitar sugestões

**Como um** revisor (P-REV),  
**Eu quero** aceitar ou rejeitar cada sugestão,  
**Para que** apenas mudanças aprovadas componham a versão final (RN-014).

#### Critérios de Aceitação

**AC 01: Aceitar**
- **Quando** clico Aceitar em sugestão pendente
- **Então** status `aceita` com user/timestamp audit trail

**AC 02: Rejeitar**
- **Quando** clico Rejeitar
- **Então** status `rejeitada` registrado

**AC 03: Pendências**
- **Dado** sugestões pendentes
- **Quando** tento avançar para QE
- **Então** botão desabilitado com contador pendentes

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/sugestoes/{id}/decisao` body `{ decisao: 'aceita'|'rejeitada' }` — idempotente (`openapi.yaml`)
- [ ] Update `sugestoes_ia`: `estado`, `decidido_por_id`, `decidido_em`; rejeitar se processo `concluido` → 409
- [ ] Auditoria `sugestao_decidida` payload resumido
- [ ] Validar zero pendentes antes `POST /processos/{id}/etapas/qe` (US-028)

**Frontend:**
- [ ] Ações Aceitar/Rejeitar por card; indicador progresso decididas/total; desabilitar "Ir para QE" se pendentes (AC 03)

**Data:**
- [ ] N/A — colunas decisão já em `sugestoes_ia`

**Test:**
- [ ] Integração decisões idempotentes; conflito decisão diferente 409
- [ ] E2E aceitar uma sugestão

#### Dependências e Notas

- **Depende de:** US-026
- **Referências:** RF-042, RB-01, RN-014

---

### US-028: Progressão para etapa QE

**Como um** revisor (P-REV),  
**Eu quero** avançar para conferência QE somente após decidir sugestões,  
**Para que** respeite ordem RN-023.

#### Critérios de Aceitação

**AC 01: Avanço**
- **Dado** zero sugestões pendentes nos critérios IA
- **Quando** clico "Ir para conferência QE"
- **Então** status `qe` e navegação para matriz QE

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/etapas/qe` — validar máquina estados: somente de `revisao_ia`/`preparacao_concluida` com zero `sugestoes_ia.estado='pendente'` para critérios IA → 422 se pendências
- [ ] Update `processos_revisao.estado='qe'`; auditoria transição

**Frontend:**
- [ ] Stepper fluxo revisão: botão "Ir para conferência QE" chama endpoint; redirect `/revisao/[id]/qe`
- [ ] Bloqueio UI alinhado ao contador pendentes

**Data:**
- [ ] N/A — update estado em `processos_revisao`

**Test:**
- [ ] Unit state machine transições válidas/inválidas
- [ ] Integração skip com pendentes → 422; happy → 200 + estado `qe`

#### Dependências e Notas

- **Depende de:** US-027
- **Referências:** RF-044, RN-023

---

### US-029: Escalonamento “validar com especialista”

**Como um** revisor (P-REV),  
**Eu quero** marcar sugestões que exigem especialista e registrar desfecho,  
**Para que** RB-05 seja respeitado sem substituir o especialista (RN-016).

#### Critérios de Aceitação

**AC 01: Flag especialista**
- **Dado** sugestão categoria `validar_especialista`
- **Então** UI destaca e exige confirmação de encaminhamento

**AC 02: Registro parecer**
- **Quando** registro nota de validação humana
- **Então** texto fica no histórico do processo

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `PATCH /api/v1/sugestoes/{id}/especialista` body `{ validarEspecialista, notaEncaminhamento? }` (`openapi.yaml` `/sugestoes/{id}/especialista`)
- [ ] Update `validar_especialista`, `nota_encaminhamento`; categoria `validar_especialista` destacada na API
- [ ] Auditoria escalonamento RF-043 / RB-05

**Frontend:**
- [ ] UI destaca sugestões `validar_especialista`; modal encaminhamento + campo parecer/nota
- [ ] Confirmação antes de marcar encaminhado

**Data:**
- [ ] N/A — campos `validar_especialista`, `nota_encaminhamento` em `sugestoes_ia`

**Test:**
- [ ] Integração PATCH especialista persiste nota visível no GET sugestões
- [ ] E2E fluxo modal encaminhamento

#### Dependências e Notas

- **Depende de:** US-027
- **Referências:** RF-043, RN-016, RB-05

---

## Epic E5 — Conferência QE

### US-030: Matriz de conferência QE

**Como um** revisor (P-REV),  
**Eu quero** matriz QE vs material com status e hierarquia,  
**Para que** identifique gaps de cobertura (RN-017, RN-018).

#### Critérios de Aceitação

**AC 01: Matriz**
- **Dado** QE parseado
- **When** acesso etapa QE
- **Então** tabela com colunas item QE, status, nível QE, nível material, localização

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `QeConferenciaModule`: parser DOCX QE (job sync na confirmação ou primeiro `GET matriz`) popula `qe_itens`
- [ ] `GET /api/v1/processos/{id}/qe/matriz` → itens com `status_cobertura` enum `contemplado|cobertura_parcial|nao_localizado` (`schema.sql` `qe_status_cobertura`)
- [ ] Campos `codigo_hierarquia`, `titulo_item`, `ordem`, `localizacao_material` inicial

**Frontend:**
- [ ] Página `/revisao/[id]/qe`: DataTable sortable; badges status; colunas hierarquia QE vs material

**Data:**
- [ ] Migração `qe_itens` + índice `idx_qe_itens_processo_ordem` (`schema.sql` L201–214)

**Test:**
- [ ] Unit parser fixture DOCX QE pequeno → N itens esperados
- [ ] Integração GET matriz após seed parse

#### Dependências e Notas

- **Depende de:** US-028, US-021
- **Referências:** RF-050, RF-051

---

### US-031: Detalhamento de item QE

**Como um** revisor (P-REV),  
**Eu quero** editar detalhes de um item da matriz,  
**Para que** documente divergências (RN-019).

#### Critérios de Aceitação

**AC 01: Editar detalhe**
- **Quando** salvo localização/divergências/texto explicativo
- **Então** persistido e visível na matriz

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `PATCH /api/v1/processos/{id}/qe/itens/{itemId}` body campos editáveis: `status_cobertura`, `localizacao_material`, `divergencias`, `observacoes` (`openapi.yaml`)
- [ ] RBAC `revisor`+; processo não `concluido`
- [ ] Touch `updated_at` em `qe_itens`

**Frontend:**
- [ ] Drawer detalhe item; form salvar PATCH; reflect na matriz

**Data:**
- [ ] N/A — update em `qe_itens`

**Test:**
- [ ] Integração PATCH persiste e retorna no GET matriz

#### Dependências e Notas

- **Depende de:** US-030
- **Referências:** RF-052

---

### US-032: Conclusão da conferência QE

**Como um** revisor (P-REV),  
**Eu quero** confirmar fim da conferência QE,  
**Para que** gere relatório final (RN-023).

#### Critérios de Aceitação

**AC 01: Concluir QE**
- **Quando** confirmo conferência
- **Então** status `relatorio` e habilito tela final

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/qe/concluir` — validar `estado='qe'`; transição → `relatorio`
- [ ] Auditoria `qe_concluida`

**Frontend:**
- [ ] Botão "Concluir conferência QE" + confirmação; redirect `/revisao/[id]/relatorio` ou habilitar nav

**Data:**
- [ ] N/A — update `processos_revisao.estado`

**Test:**
- [ ] Integração estado inválido 409; happy path `relatorio`

#### Dependências e Notas

- **Depende de:** US-031
- **Referências:** RF-053

---

## Epic E6 — Relatórios e exportações

### US-034: Relatório final consolidado

**Como um** revisor (P-REV),  
**Eu quero** ver resumo textual e QE no encerramento,  
**Para que** valide entregáveis (RN-020).

#### Critérios de Aceitação

**AC 01: Resumo**
- **Então** exibo totais sugestões aceitas/rejeitadas por categoria
- **E** totais QE por status
- **E** critérios não selecionados aparecem como "não executado"

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `RelatoriosModule`: `GET /api/v1/processos/{id}/relatorio` — facade agrega sugestões aceitas/rejeitadas por categoria, QE por status, critérios não selecionados como "não executado" (RB-03)
- [ ] Read-only; RBAC autenticado com acesso ao processo

**Frontend:**
- [ ] Página `/revisao/[id]/relatorio`: seções resumo + totais; gráficos simples (bar/pie)

**Data:**
- [ ] N/A — queries sobre `sugestoes_ia`, `qe_itens`, `processo_criterios`

**Test:**
- [ ] Integração fixture processo completo → JSON relatório esperado
- [ ] Unit agregador contagens

#### Dependências e Notas

- **Depende de:** US-032
- **Referências:** RF-060, RB-03

---

### US-035: Exportação material revisado (.docx)

**Como um** revisor (P-REV),  
**Eu quero** baixar Word com alterações aceitas,  
**Para que** entregue material revisado (RN-021).

#### Critérios de Aceitação

**AC 01: Docx gerado**
- **Quando** solicito download
- **Então** arquivo docx contém alterações aceitas apenas
- **E** metadados opcionais revisor/data

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/exportacoes/docx` → **202** + `jobId` (fila `export.documento`) — RF-061
- [ ] Worker: `DocxMergeService` aplica **somente** sugestões `estado='aceita'` sobre original MinIO; grava `exportacoes` + key MinIO
- [ ] `GET /api/v1/exportacoes/{id}/download` stream autenticado

**Frontend:**
- [ ] Botão "Exportar DOCX" → polling job → download via endpoint BFF

**Data:**
- [ ] Migração `exportacoes` (`processo_id`, `job_id`, `formato`, `storage_key`, …) (`schema.sql` L220–231)

**Test:**
- [ ] Integração golden file DOCX pequeno: aceita vs rejeitada
- [ ] Job failed path mensagem recuperável

#### Dependências e Notas

- **Depende de:** US-027, US-034
- **Referências:** RF-061

---

### US-036: Encerramento e export PDF (Should)

**Como um** revisor (P-REV),  
**Eu quero** encerrar processo e baixar PDFs de relatório,  
**Para que** arquive evidências (RN-022, RN-024).

#### Critérios de Aceitação

**AC 01: Encerrar**
- **Quando** clico "Concluir processo"
- **Então** status `concluido` e edição de decisões bloqueada

**AC 02: PDF (Should)**
- **Então** posso baixar PDF revisão e PDF QE

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `POST /api/v1/processos/{id}/exportacoes/pdf` Should → 202 job PDF relatório/QE
- [ ] `POST /api/v1/processos/{id}/encerrar` → `estado='concluido'`, `encerrado_em`; mutações HITL/export bloqueadas **409** thereafter (RF-063)
- [ ] Auditoria `processo_encerrado`

**Frontend:**
- [ ] Botão "Concluir processo" + confirmação; estado read-only pós-encerrar
- [ ] Downloads PDF Should quando job succeeded

**Data:**
- [ ] Coluna `encerrado_em` em `processos_revisao`; jobs tipo `export_pdf`

**Test:**
- [ ] Integração encerrar 409 em segunda tentativa; decisão pós-encerrar 409
- [ ] E2E encerramento read-only

#### Dependências e Notas

- **Depende de:** US-034
- **Referências:** RF-062, RF-063

---

## Epic E7 — Governança

### US-037: Trilha de auditoria do processo

**Como um** gestor da Seção MD,  
**Eu quero** trilha imutável de eventos do processo,  
**Para que** haja prestação de contas (RN-024, RN-025).

#### Critérios de Aceitação

**AC 01: Eventos**
- **Então** para cada processo existem eventos: criação, upload, decisões, transições, exportações
- **E** eventos não são apagados

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `AuditoriaModule`: `AuditoriaService.emit(tipo, processoId, userId, payloadJson)` chamado em **todas** mutações críticas (login, processo, upload, IA, HITL, QE, export, encerrar)
- [ ] Insert-only em `eventos_auditoria`; aplicação **nunca** UPDATE/DELETE
- [ ] `GET /api/v1/processos/{id}/eventos` paginado (`openapi.yaml` `/processos/{id}/eventos`)

**Frontend:**
- [ ] N/A — trilha consumida em US-038/detalle read-only; opcional tab "Auditoria" no processo

**Data:**
- [ ] Migração `eventos_auditoria` + trigger append-only `trg_eventos_auditoria_no_update` (`schema.sql` L237–259)
- [ ] Índices `idx_eventos_processo_created`, `idx_eventos_tipo`

**Test:**
- [ ] Integração: mutação gera evento; tentativa SQL UPDATE via app negada se trigger ativo
- [ ] Unit AuditoriaService payload sem PII/senha

#### Dependências e Notas

- **Transversal desde US-013**
- **Referências:** RF-070, RFN-007

---

### US-038: Consulta de histórico por curso

**Como um** gestor (P-ADM-C),  
**Eu quero** listar processos de revisão por curso,  
**Para que** audite ciclos passados.

#### Critérios de Aceitação

**AC 01: Histórico**
- **Quando** acesso `/historico?cursoId=`
- **Então** vejo processos com status, responsável, datas

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] `GET /api/v1/processos?cursoId=&estado=&page=` tag Historico — RF-071 (`openapi.yaml` `/processos` GET)
- [ ] Projeção: id, curso, responsável, estado, datas; filtros combinados
- [ ] `GET /processos/{id}/eventos` para detalhe trilha read-only

**Frontend:**
- [ ] Página `/historico` com filtros `cursoId`, status; link detalhe read-only + timeline eventos

**Data:**
- [ ] N/A — consultas indexadas em `processos_revisao`, `eventos_auditoria`

**Test:**
- [ ] Integração filtros paginação; E2E histórico por curso

#### Dependências e Notas

- **Depende de:** US-037
- **Referências:** RF-071

---

## Epic E8 — UX institucional

### US-041: Identidade visual institucional

**Como um** revisor (P-REV),  
**Eu quero** interface alinhada ao protótipo ILA,  
**Para que** tenha experiência profissional institucional (RN-027).

#### Critérios de Aceitação

**AC 01: Tema**
- **Então** cores, tipografia e componentes seguem guia derivado do HTML protótipo 1.3

#### Tarefas Técnicas Sugeridas

**Backend:**
- [ ] N/A — identidade visual é WebApp; garantir `/api/docs` não expõe branding sensível

**Frontend:**
- [ ] Tokens CSS (cores/tipografia COMGAP/ILA) em `styles/tokens.css` derivados protótipo 1.3
- [ ] Biblioteca base: `Button`, `Card`, `Table`, `Stepper`, `Badge` usando tokens
- [ ] Aplicar tema no `AppShell`, login, wizard e tabelas QE

**Data:**
- [ ] N/A — sem alteração schema

**Test:**
- [ ] E2E screenshot smoke login + `/cursos` contra baseline visual opcional
- [ ] Unit RTL: Button variants renderizam classes token

#### Dependências e Notas

- **Paralelo F2**
- **Referências:** RF-081, RN-027

---

## Validação INVEST (amostra)

| US | I | N | V | E | S | T |
|----|---|---|---|---|---|---|
| US-001 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-027 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| US-030 | ✓ | ✓ | ✓ | Médio | Médio | ✓ |

*US-030 pode ser split parser vs UI se sprint exigir.*

---

## Ordem sugerida de implementação (sprints indicativas)

1. **Sprint 1:** US-002, US-003, US-007, US-014  
2. **Sprint 2:** US-001, US-004, US-005, US-006  
3. **Sprint 3:** US-008–US-013  
4. **Sprint 4:** US-020–US-024, US-037 (eventos base)  
5. **Sprint 5:** US-025–US-029  
6. **Sprint 6:** US-030–US-032  
7. **Sprint 7:** US-034–US-036, US-038, US-041  

---

## Lacunas — perguntas para stakeholders (não bloqueiam MVP)

1. **V-04:** SSO obrigatório na v1? (impacto US-001)  
2. **V-05:** `MAX_UPLOAD_MB` oficial?  
3. **V-02/V-03:** Habilitação RF-040 em produção  
4. **V-06:** Workflow homologação pós-relatório  
5. **RBAC:** Confirmar papéis `admin_cursos` vs todos revisores cadastram curso  
