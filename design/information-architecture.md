# Arquitetura de Informação — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Fontes:** `requirements/srs.md`, `requirements/functional-requirements.md` (RF-080), `architecture/adrs/002-stack-frontend-nextjs-csr-bff.md`, protótipo `others_artifacts/sad-ila-prototype 1.3.html`

---

## 1. Sitemap (rotas Next.js)

```text
/login                          [público — SSG + hidratação]
└── (authenticated)             [AppShell: sidebar + topbar]
    ├── /cursos                 [painel principal pós-login]
    ├── /cursos/[id]            [hub do curso]
    ├── /revisao/novo           [entrada alternativa ao wizard]
    ├── /revisao/[processoId]/preparacao
    ├── /revisao/[processoId]/sugestoes
    ├── /revisao/[processoId]/qe
    ├── /revisao/[processoId]/relatorio
    ├── /historico              [processos por curso / trilha]
    └── /admin/usuarios         [TI — admin_sistema]
```

**Nota de IA:** A sidebar do protótipo 1.3 simula views (`Início`, `Materiais`, `Revisão com IA`, etc.) dentro de um único HTML. Na implementação Next.js, a **navegação global** aponta para rotas reais; o **StepperRevisao** (RF-080) governa as etapas do processo ativo sem permitir atalhos inválidos (RN-023).

---

## 2. Personas × tarefas principais

| Persona | Tarefa central | Páginas envolvidas |
|---------|----------------|-------------------|
| **Revisor / elaborador** | Conduzir revisão HITL e fechar ciclo com relatório | `/cursos`, `/cursos/[id]`, `/revisao/*`, `/historico` |
| **Coordenador / especialista** | Validar aderência QE e gaps de conteúdo | `/revisao/[id]/qe`, `/revisao/[id]/relatorio`, `/historico` (leitura) |
| **Gestor** | Visibilidade de processos e padronização | `/cursos`, `/historico` |
| **TI / admin_sistema** | Provisionar usuários e papéis | `/admin/usuarios` |

---

## 3. Fluxos principais

### 3.1 Autenticação → trabalho diário

```mermaid
flowchart LR
  A[/login] -->|JWT válido| B[/cursos]
  B --> C[/cursos/id]
  C -->|Iniciar Revisão| D[/revisao/processoId/preparacao]
```

### 3.2 Ciclo de revisão (RF-080 — stepper)

```mermaid
flowchart TD
  P[Preparação] -->|RF-035 confirmar| S[Revisão IA / sugestões]
  S -->|RF-044 todas decididas| Q[Conferência QE]
  Q -->|RF-053 concluir| R[Relatório final]
  R -->|RF-063 encerrar| H[/historico]
```

**Regras de navegação:**

- Etapas futuras do stepper aparecem **desabilitadas** ou como rótulo somente leitura até o estado do processo permitir (RN-023).
- Sidebar global **não** substitui o stepper: links como “Revisão com IA” levam ao processo **em andamento** mais recente ou à lista em `/historico`, conforme contexto (implementação: breadcrumb + meta no topbar).

### 3.3 Entrada alternativa

- `/revisao/novo`: criar rascunho de processo e redirecionar para `preparacao` (RF-022, RF-030).
- Atalho a partir de `/cursos/[id]`: curso pré-selecionado no wizard (RF-030).

---

## 4. Labeling e vocabulário da UI

| Termo na UI | Evitar | Motivo |
|-------------|--------|--------|
| **Quadro Estrutural (QE)** | “Matriz genérica” | Vocabulário ILA |
| **Material didático** | “Documento”, “Arquivo principal” | Domínio pedagógico |
| **Sugestão da IA** | “Correção automática” | RB-01 human-in-the-loop |
| **Conferência do QE** | “Dashboard QE” | Processo, não analytics |
| **Processo de revisão** | “Job”, “Task” | Rastreabilidade institucional |

---

## 5. Navegação global (AppShell autenticado)

Alinhada ao protótipo 1.3, adaptada às rotas:

| Item sidebar | Destino | Observação |
|--------------|---------|------------|
| Cursos | `/cursos` | Equivalente “Início” do protótipo |
| Histórico | `/historico` | RF-071 |
| — separador — | | |
| *(durante processo)* Stepper no main | rotas `/revisao/[id]/*` | RF-080 |
| Administração | `/admin/usuarios` | Visível só `admin_sistema` |

Itens do protótipo que eram **views internas** (`Revisão com IA`, `Conferência QE`, `Relatórios`) migram para **stepper + rotas**, não para itens fixos de sidebar — evita saltar etapas.

---

## 6. Busca e filtros (v1)

- **Cursos:** Could MVP — filtro por título (client-side se lista pequena; paginação via API).
- **Histórico:** filtro por curso, estado do processo, intervalo de datas (Should F2/F3).
- **Admin usuários:** busca por e-mail/nome (paginação server-side).

---

## 7. Hierarquia de informação por área

| Área | Primário | Secundário | Terciário |
|------|----------|------------|-----------|
| Lista de cursos | Título do curso | Descrição resumida | Contagens (materiais / revisões) |
| Hub curso | Metadados + materiais | Ação “Iniciar Revisão” | Histórico do curso (link) |
| Preparação | Uploads QE/material | Critérios | Referências + aviso RB-02 |
| Sugestões | Trecho no material + painel decisão | Progresso “n de m” | Categorias / especialista |
| QE | Estatísticas resumo | Tabela matriz | Painel detalhe item |
| Relatório | Contagens consolidadas | Exportações | Nota rastreabilidade |

---

## 8. Rastreio

- RF-080, RF-081, RF-010–012, RF-022, RF-030–035, RF-042, RF-050–053, RF-060–063, RF-071  
- US-014 (layout autenticado), US-020–024, US-027–032, US-034–038, US-041
