# Inventário de Páginas Frontend — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Estratégia de renderização:** ADR-002 (`architecture/adrs/002-stack-frontend-nextjs-csr-bff.md`)  
**API:** BFF NestJS, `Authorization: Bearer` — sem persistência local de domínio

Este documento é o insumo principal para protótipo HTML/React de layout.

---

## Legenda

- **Layout `public`:** sem AppShell.
- **Layout `auth`:** `(authenticated)` — sidebar + topbar (US-014, RF-080).
- **Shared:** componentes do design system; **Page:** específicos da rota.

---

## P-01 — Login

| Campo | Valor |
|-------|-------|
| **ID** | P-01 |
| **Rota** | `/login` |
| **Título** | Entrar — SAD-ILA |
| **Objetivo** | Autenticar com e-mail e senha e ir ao painel de cursos |
| **Personas / RBAC** | Todos (não autenticados) |
| **Render strategy** | **SSG + hydration** (ADR-002) |
| **Layout template** | **public** — coluna central, marca ILA, sem sidebar |

### Regions

| Região | Conteúdo |
|--------|----------|
| header | Logotipo textual SAD-ILA, subtítulo institucional, org-tag `COMGAP / ILA · 26SISIAR05LOG` |
| main | Formulário login |
| footer | Versão / aviso uso autorizado (opcional) |

### Seções (ordem de leitura)

1. Identidade institucional (Lora + gold sutil)
2. Campos e-mail, senha
3. Botão “Entrar”
4. Mensagem erro genérica (RF-001)

### Componentes

| Componente | Tipo | Dados API |
|------------|------|-----------|
| LoginForm | Page | `POST /api/v1/auth/login` → `{ accessToken, user }` |
| TextInput, Button | Shared | — |

### Ações

- **Primária:** Entrar
- **Secundária:** — (SSO F4 fora escopo)

### Navegação

- **Entrada:** redirect automático se já token válido → `/cursos`
- **Saída sucesso:** `/cursos`
- **Saída erro:** permanece `/login`

### Estados

| Estado | UI |
|--------|-----|
| loading | Botão `aria-busy`, campos disabled |
| empty | N/A |
| error | Alert genérico “Credenciais inválidas” |
| success | Redirect |

### Rastreio

RF-001, RF-002, US-001, US-002

### Notas protótipo

Login **não** existe no HTML 1.3 — reutilizar tokens `--ink`, `--paper`, `--gold` e tipografia Lora/Plex.

---

## P-02 — Lista de cursos

| Campo | Valor |
|-------|-------|
| **ID** | P-02 |
| **Rota** | `/cursos` |
| **Título** | Cursos |
| **Objetivo** | Escolher curso para materiais ou revisão |
| **Personas / RBAC** | Autenticado: `revisor`, `admin_cursos`, `admin_sistema` (leitura); cadastro só `admin_cursos`+ |
| **Render strategy** | **Client + SWR** |
| **Layout template** | **auth** |

### Regions

| Região | Conteúdo |
|--------|----------|
| sidebar | Nav global |
| header (topbar) | Título “Cursos”, meta “Material didático — ILA” |
| main | Toolbar + grid/lista |
| — | Sem aside |

### Seções

1. Ação “Novo curso” (condicional RBAC)
2. Lista paginada CourseCard
3. Empty state com CTA cadastro

### Componentes

| Componente | Tipo | API |
|------------|------|-----|
| CourseCard | Shared | `GET /api/v1/cursos?page&limit` → `items[]` |
| CursoCreateModal | Page | `POST /api/v1/cursos` |
| Button, EmptyState | Shared | — |

### Ações

- **Primária:** Abrir curso (card click)
- **Secundária:** Novo curso (admin)

### Navegação

- **Entrada:** pós-login default
- **Saída:** `/cursos/[id]`

### Estados

| Estado | UI |
|--------|-----|
| loading | Skeleton cards |
| empty | “Nenhum curso cadastrado” + CTA admin |
| error | Toast + retry SWR |
| success | Grid |

### Rastreio

RF-010, RF-011, US-008, US-009

---

## P-03 — Hub do curso

| Campo | Valor |
|-------|-------|
| **ID** | P-03 |
| **Rota** | `/cursos/[id]` |
| **Título** | {tituloCurso} |
| **Objetivo** | Gerenciar materiais de apoio e iniciar revisão |
| **Personas / RBAC** | Leitura: todos autenticados; upload `revisor`/`admin_cursos`/`admin_sistema`; editar curso `admin_cursos`+ |
| **Render strategy** | **Client + SWR** |
| **Layout template** | **auth** |

### Regions

| Região | Conteúdo |
|--------|----------|
| topbar | Título curso, meta descrição curta |
| main | Bloco info + MaterialList + ações revisão |
| aside (lg+) | Links rápidos: histórico filtrado curso (opcional) |

### Seções

1. Cabeçalho curso (título, descrição completa)
2. Materiais de apoio (upload/list/download)
3. Barra ações: **Iniciar Revisão** (RF-022)

### Componentes

| Componente | API |
|------------|-----|
| MaterialList | `GET/POST .../cursos/{id}/materiais`, download |
| FileUploadZone (`apoio`) | multipart |
| Button primary | `POST /api/v1/processos` → redirect preparacao |

### Ações

- **Primária:** Iniciar Revisão
- **Secundária:** Upload material, download, voltar `/cursos`

### Navegação

- **Entrada:** P-02
- **Saída:** `/revisao/[processoId]/preparacao` (curso pré-preenchido RF-030)

### Estados

loading SWR curso+materiais; empty materiais; error; upload progress per file.

### Rastreio

RF-012, RF-020, RF-021, RF-022, US-010, US-011, US-012, US-013

### Notas protótipo

Equivalente funcional parcial de “Materiais”; cards estilo `.card` protótipo.

---

## P-04 — Nova revisão (entrada)

| Campo | Valor |
|-------|-------|
| **ID** | P-04 |
| **Rota** | `/revisao/novo` |
| **Título** | Nova revisão |
| **Objetivo** | Criar processo sem partir de um curso específico |
| **Personas / RBAC** | `revisor`+ |
| **Render strategy** | **Client** |
| **Layout template** | **auth** + Stepper (etapa 1 ativa) |

### Regions

main: seleção curso inicial → redirect wizard.

### Componentes

SelectCustom cursos (`GET /cursos`), Button continuar → `POST /processos` → `/revisao/[id]/preparacao`.

### Navegação

Alternativa a P-03; SRS menciona “ou modal” — rota dedicada escolhida ADR-002.

### Rastreio

RF-022, RF-030, US-013, US-020

---

## P-05 — Preparação (wizard)

| Campo | Valor |
|-------|-------|
| **ID** | P-05 |
| **Rota** | `/revisao/[processoId]/preparacao` |
| **Título** | Revisão de material didático |
| **Objetivo** | Enviar QE, material, refs, critérios; confirmar início |
| **Personas / RBAC** | Dono processo / `revisor` |
| **Render strategy** | **Client (SPA shell)** |
| **Layout template** | **auth** + **StepperRevisao** (preparação) |

### Regions

| Região | Conteúdo |
|--------|----------|
| topbar | Título protótipo: “Revisão de material didático”, meta “Novo processo de revisão” ou curso/unidade |
| main | Cards empilhados (protótipo `v-inicio`) |
| — | Stepper abaixo topbar ou acima main |

### Seções (ordem — **alinhamento RF-081 / v-inicio**)

1. **Selecionar curso** (bloqueado se veio de P-03) + módulo/unidade se API disponível (Could)
2. **Documentos:** FileUploadZone QE + material Word
3. **Referências técnicas** multi
4. **Critérios** CriteriaCheckboxGroup
5. Aviso modal RB-02 se revisão técnica sem refs (RF-034)
6. Botão **Iniciar revisão →** (RF-035)

### Componentes

| Componente | API |
|------------|-----|
| FileUploadZone | `POST /processos/{id}/arquivos` tipo qe/material/referencia |
| CriteriaCheckboxGroup | `PATCH` critérios ou payload confirmar |
| JobProgressBanner | `POST confirmar` → 202 + `GET /jobs/{jobId}` |
| FlowNote | Texto RB-01 “IA não aplica automaticamente” |

### Ações

- **Primária:** Confirmar / Iniciar revisão
- **Secundária:** Cancelar → `/cursos` ou `/historico`

### Navegação

- **Saída sucesso:** `/revisao/[id]/sugestoes` ou `/qe` se só critério QE (RN-023)

### Estados

| Estado | UI |
|--------|-----|
| loading | Carregar processo rascunho |
| empty | Dropzones vazias |
| error | Upload/validação MIME/tamanho |
| success | Redirect próxima etapa |

### Rastreio

RF-030–035, RF-081, US-020–024, US-041

---

## P-06 — Sugestões (HITL)

| Campo | Valor |
|-------|-------|
| **ID** | P-06 |
| **Rota** | `/revisao/[processoId]/sugestoes` |
| **Título** | Revisão com IA |
| **Objetivo** | Decidir cada sugestão (aceitar/rejeitar) |
| **Personas / RBAC** | `revisor` dono |
| **Render strategy** | **Client + polling job IA** |
| **Layout template** | **auth** + Stepper (etapa IA) |

### Regions

| Região | Conteúdo |
|--------|----------|
| main header | Título curso/unidade + BadgeCount progresso |
| main body | Split: DocPaneWithHighlights + SuggestionReviewPanel |
| — | Job banner enquanto gera RF-040 |

### Seções

1. Progresso sugestões
2. Trecho material (realce)
3. Painel decisão + justificativa + tag categoria
4. Flag “Validar com especialista” (RF-043)
5. Footer: “Ir para conferência QE” (RF-044)

### Componentes

| API |
|-----|
| `GET /processos/{id}/sugestoes` |
| `PATCH /sugestoes/{id}/decisao` |
| Polling job geração |

### Ações

Primária: Aceitar / Rejeitar; Secundária: Editar, Escalar especialista; Avançar QE (disabled até decididas).

### Navegação

Entrada: P-05; Saída: `/revisao/[id]/qe`

### Estados

loading job; empty “Nenhuma sugestão”; error IA RF-091; polling.

### Rastreio

RF-040–044, RF-081, US-026, US-027, US-028, US-029

### Notas protótipo

Réplica fiel `v-revisao`: `.review-split`, `.hl`, `.suggest-pane`, botões accept/reject.

---

## P-07 — Conferência QE

| Campo | Valor |
|-------|-------|
| **ID** | P-07 |
| **Rota** | `/revisao/[processoId]/qe` |
| **Título** | Conferência do Quadro Estrutural |
| **Objetivo** | Validar cobertura e hierarquia QE ↔ material |
| **Personas / RBAC** | `revisor`, coordenador (leitura) |
| **Render strategy** | **Client** |
| **Layout template** | **auth** + Stepper (QE) |

### Regions

main: QESummaryStats → card tabela → QEDetailPanel inline.

### Componentes

QEMatrix (`GET /processos/{id}/qe`), edição RF-052.

### Ações

Primária: Concluir conferência (RF-053) → relatório; Secundária: editar linha.

### Navegação

Saída: `/revisao/[id]/relatorio`

### Estados

loading parse; empty QE; error; success conclusão.

### Rastreio

RF-050–053, RF-081, US-030, US-031, US-032

### Notas protótipo

`v-qe`: `.qe-summary`, `.qe-table`, `.qe-detail`.

---

## P-08 — Relatório final

| Campo | Valor |
|-------|-------|
| **ID** | P-08 |
| **Rota** | `/revisao/[processoId]/relatorio` |
| **Título** | Relatório final |
| **Objetivo** | Ver resumo, exportar, encerrar processo |
| **Personas / RBAC** | `revisor`; gestor leitura |
| **Render strategy** | **Client + SWR** |
| **Layout template** | **auth** + Stepper (relatório) |

### Seções (protótipo `v-relatorio`)

1. Resumo revisão textual (ReportSummary)
2. Resumo conferência QE
3. Saídas: download docx/pdf (RF-061, RF-062)
4. FlowNote rastreabilidade
5. Encerrar processo (RF-063)

### Componentes

ReportSummary, Button ghost downloads, FlowNote.

### API

`GET /processos/{id}/relatorio`, `GET .../exportacoes/{tipo}`

### Estados

loading agregados; error export; success encerrado → link histórico.

### Rastreio

RF-060–063, RF-070, US-034, US-035, US-036

---

## P-09 — Histórico

| Campo | Valor |
|-------|-------|
| **ID** | P-09 |
| **Rota** | `/historico` |
| **Título** | Histórico de revisões |
| **Objetivo** | Listar processos e abrir trilha somente leitura |
| **Personas / RBAC** | Autenticados autorizados RF-071 |
| **Render strategy** | **Client + SWR** |
| **Layout template** | **auth** |

### Seções

Filtros (curso, estado, datas) → DataTable → drawer detalhe trilha RF-070.

### Navegação

Para processo em andamento: deep link etapa correta via Stepper; concluídos: relatório read-only ou modal trilha.

### Estados

loading, empty, error paginação.

### Rastreio

RF-071, RF-070, US-037, US-038

### Notas protótipo

Item sidebar “Histórico” → rota dedicada (não view interna).

---

## P-10 — Administração de usuários

| Campo | Valor |
|-------|-------|
| **ID** | P-10 |
| **Rota** | `/admin/usuarios` |
| **Título** | Usuários |
| **Objetivo** | CRUD usuários TI |
| **Personas / RBAC** | **`admin_sistema` only** (RF-003, RF-005) |
| **Render strategy** | **Client + SWR** |
| **Layout template** | **auth** |

### Seções

Toolbar criar → DataTable paginada → Modal UserAdminForm → confirm desativar.

### API

`GET/POST/PATCH /api/v1/usuarios`

### Estados

loading, empty, error, success toast.

### Rastreio

RF-005, US-006, US-005

---

## Matriz rota × render strategy (confirmação ADR-002)

| Rota | Strategy | ID página |
|------|----------|-----------|
| `/login` | SSG + hydration | P-01 |
| `/cursos` | Client + SWR | P-02 |
| `/cursos/[id]` | Client + SWR | P-03 |
| `/revisao/novo` | Client | P-04 |
| `/revisao/[processoId]/preparacao` | Client wizard | P-05 |
| `/revisao/[processoId]/sugestoes` | Client + polling | P-06 |
| `/revisao/[processoId]/qe` | Client | P-07 |
| `/revisao/[processoId]/relatorio` | Client + SWR | P-08 |
| `/historico` | Client + SWR | P-09 |
| `/admin/usuarios` | Client + SWR | P-10 |

**Cobertura:** todas as rotas ADR-002 / RFN-050 documentadas.

---

## Componentes shared vs page (resumo global)

| Shared (≥2 páginas) | Page-specific |
|---------------------|---------------|
| AppShell, Button, Card, Toast, Modal, DataTable, EmptyState, FileUploadZone, StepperRevisao | LoginForm, CursoCreateModal, SuggestionReviewPanel, QEMatrix, ReportSummary, UserAdminForm, JobProgressBanner |

---

## Rastreio transversal

RF-080 (shell + stepper), RF-081 (visual), RF-003 (RBAC gates), RFN-050 (render)
