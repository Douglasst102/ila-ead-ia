# Especificação de Componentes — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Design tokens:** `design-system.md`  
**Referência:** protótipo 1.3 (RF-081)

> Controles de formulário estilizados são **custom** (não `<select>`/checkbox nativos visíveis).

---

## AppShell

**Composição:** `Sidebar` + `Topbar` + `Main` (+ `StepperRevisao` condicional em rotas `/revisao/[id]/*`).

| Parte | Props / conteúdo API | Estados |
|-------|----------------------|---------|
| Sidebar | `user`: `{ nome, iniciais }` do JWT/`GET /me` | Collapsed (drawer mobile) |
| Nav items | RBAC: esconder `/admin/usuarios` se não `admin_sistema` | `aria-current="page"` |
| Topbar | `title`, `meta` (string ou ReactNode) | — |
| User chip | Avatar iniciais, nome, menu logout | Menu keyboard |

**ARIA:** `nav` com `aria-label="Navegação principal"`; main `id="main-content"`.

---

## StepperRevisao

**Props:** `processoId`, `estadoAtual`: `preparacao` | `revisao_ia` | `qe` | `relatorio` | `concluido`, `criteriosSelecionados` (pode pular IA se só QE).

| Etapa | Rota | Habilitação |
|-------|------|-------------|
| Preparação | `/preparacao` | sempre se dono/leitor processo |
| Revisão IA | `/sugestoes` | após `preparacao_concluida` + critérios IA |
| QE | `/qe` | RF-044 |
| Relatório | `/relatorio` | após `qe_concluida` ou equivalente RN-023 |

**Visual:** horizontal desktop; vertical compacto mobile. Etapa atual: label ink + indicador gold. Futuras: muted + `aria-disabled`. **Sem links** para etapas bloqueadas (RN-023).

---

## CourseCard

**Props:** `curso`: `{ id, titulo, descricaoResumida, totalMateriais?, revisoesAbertas? }`, `onOpen`, `onEdit?` (admin_cursos).

**Estados:** default, hover (border strong), focus-visible, loading skeleton.

**Layout:** título Lora; descrição 2 linhas clamp; footer meta opcional.

---

## MaterialList

**Props:** `cursoId`, `items[]`: `{ id, nomeOriginal, tamanho, mime, uploadedAt, autor }`, `canUpload`, callbacks upload/download/remove.

**Estados:** empty (“Nenhum material de apoio”), loading, error retry, row downloading.

**Ações:** download via URL autenticada BFF.

---

## FileUploadZone

**Props:** `tipo`: `qe` | `material` | `referencia` | `apoio`, `accept`, `maxSize`, `multiple?`, `value` (metadado arquivo ou lista), `onUpload`, `onRemove`.

**Variantes:** single (QE/material) vs multi (referências — protótipo `ref-list`).

**Estados:** empty (dashed), dragover (border gold), uploading (progressbar), filled (green-bg protótipo), error (red border + message).

**ARIA:** `aria-describedby` formatos; botão “Substituir arquivo” quando filled.

---

## CriteriaCheckboxGroup

**Props:** `options[]` (id, label, descricao?), `value: string[]`, `onChange`, `disabled?`.

Checkboxes custom alinhados ao protótipo `.checklist` / `.checkitem`.

**Validação:** ≥1 selecionado antes confirmar (RF-033) — mensagem inline.

---

## SuggestionReviewPanel

**Props:** `sugestao`: `{ id, categoria, tagLabel, original, suggested, reason, flags? }`, `indice`, `total`, `onAccept`, `onReject`, `onEdit?`, `onEscalarEspecialista?` (RF-043).

**Layout:** painel direito protótipo `suggest-pane`; tags coloridas por categoria.

**Estados:** pending, saving, saved, error retry.

**Botões:** `btn-accept`, `btn-reject`, ghost “Editar antes de aceitar”.

---

## DocPaneWithHighlights

**Props:** `paragrafos[]`, `highlightIndex`, `onHighlightClick?`.

Realce `.hl` / `.hl-active` — sincronizado com sugestão atual.

---

## QEMatrix

**Props:** `resumo`: `{ ok, parcial, naoLocalizado, divergenciaHier }`, `linhas[]`, `selectedId`, `onSelect`, `onUpdateLinha?` (RF-052).

**Subcomponentes:** `QESummaryStats` (`.qe-stat`), `QETable`, `QEDetailPanel`.

**Estados:** loading job parse, empty (QE inválido), error.

---

## ReportSummary

**Props:** `revisao`: contagens por critério/categoria, `qe`: contagens, `criteriosNaoExecutados[]` (RB-03), `processoMeta`.

Tabelas `.report-table` — valores coluna direita Lora tabular.

---

## DataTable

**Props:** genérico paginado — `columns`, `rows`, `pagination`, `sort?`, `onRowAction`.

Usado em `/historico`, `/admin/usuarios`, opcional materiais.

**Estados:** loading skeleton rows, empty, error.

---

## Modal / Drawer

**Modal:** confirmações (RB-02 aviso refs, desativar usuário, encerrar processo).

**Drawer:** sidebar mobile; opcional detalhe QE em tablet.

Focus trap, `role="dialog"`, `aria-modal="true"`.

---

## Toast

**Props:** `variant`: success | error | info, message, action?

Container `aria-live="polite"` no AppShell.

---

## Button

| Variant | Classe protótipo | Uso |
|---------|------------------|-----|
| primary | `btn-primary` | Ações principais |
| ghost | `btn-ghost` | Secundárias, downloads |
| accept | `btn-accept` | Aceitar sugestão |
| reject | `btn-reject` | Rejeitar |
| edit | `btn-edit` | Editar trecho |

**Estados:** hover, active, focus-visible, disabled, loading (spinner inline, `aria-busy`).

**Tamanhos:** default (padding 9–14px), icon-only 44px min.

---

## Form fields (custom)

- **TextInput:** border `--line`, focus gold ring.
- **SelectCustom:** lista popover nível 2; teclado ↑↓ Enter Esc.
- **TextArea:** notas especialista, detalhe QE.

Associação label/id obrigatória; erro com `aria-invalid` + `aria-describedby`.

---

## Badge / Tag

**BadgeCount:** “Sugestão 1 de 5” (protótipo `badge-count`).

**Tag categoria sugestão:** mapa categoria → token semantic/tag.

---

## Componentes adicionais

| Componente | Notas |
|------------|-------|
| **EmptyState** | Ilustração opcional mínima; CTA claro |
| **JobProgressBanner** | Polling IA: `aria-live`, link cancelar se API permitir |
| **FlowNote** | Bloco rastreabilidade relatório (protótipo) |
| **UserAdminForm** | email, nome, roles multi, senha inicial |
| **RequireAuth** | HOC/layout — redirect login |

---

## Rastreio

RF-081, RF-080, RF-042, RF-050, RF-060, US-014, US-027, US-030, US-041
