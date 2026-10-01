# Design System — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Base:** Protótipo `others_artifacts/sad-ila-prototype 1.3.html` (RF-081)

---

## 1. Primitivos (mapeamento protótipo → tokens)

### 1.1 Foreground

| Token | Hex (ref.) | Uso |
|-------|------------|-----|
| `--foreground-primary` | `#1B2B45` (`--ink`) | Texto principal, títulos corpo |
| `--foreground-secondary` | `#2C4166` (`--ink-2`) | Labels, ênfase secundária |
| `--foreground-muted` | `#5B6B84` (`--steel`) | Hints, meta topbar |
| `--foreground-faint` | `#8C99AD` (`--steel-light`) | Placeholders, sidebar foot |
| `--foreground-on-brand` | `#FFFFFF` | Texto em botão primary / sidebar ativo |
| `--foreground-on-inverse` | `#DCE3EE` | Texto base sidebar |

### 1.2 Background

| Token | Hex (ref.) | Nível | Uso |
|-------|------------|-------|-----|
| `--background-base` | `#F3F1EA` (`--paper`) | 0 | Canvas main autenticado |
| `--background-subtle` | `#EAE7DD` (`--paper-2`) | 0 inset | Dropzone vazia, flow-note |
| `--background-surface` | `#FFFFFF` (`--panel`) | 1 | Cards, topbar, doc-pane |
| `--background-sidebar` | `#1B2B45` (`--ink`) | 0 alt | Sidebar |
| `--background-overlay` | `rgba(27,43,69,0.48)` | 3 | Modal backdrop |
| `--background-brand-subtle` | `#F4ECD8` (`--gold-bg`) | 1 | Avatar, destaque institucional leve |

### 1.3 Border

| Token | Hex (ref.) | Uso |
|-------|------------|-----|
| `--border-default` | `#DAD5C6` (`--line`) | Cards, inputs, topbar |
| `--border-subtle` | `rgba(255,255,255,0.12)` | Divisores sidebar |
| `--border-strong` | `#C7BFA6` | Dropzone dashed |
| `--border-focus` | `#A9832B` (`--gold`) | Focus ring (com offset) |
| `--border-nav-active` | `#A9832B` | Borda esquerda nav item |

### 1.4 Brand

| Token | Hex | Uso |
|-------|-----|-----|
| `--brand-primary` | `#A9832B` | Acento insígnia: nav ativo, focus |
| `--brand-primary-hover` | `#8F6F24` | Hover links dourados |
| `--action-primary-bg` | `#1B2B45` | Botão primary (`btn-primary`) |
| `--action-primary-hover` | `#2C4166` | Hover primary |

### 1.5 Semantic

| Token | Par base / bg | Uso |
|-------|---------------|-----|
| `--semantic-success` / `-bg` | `#2E6B4C` / `#E4EFE7` | Upload ok, qe-stat ok, accept |
| `--semantic-warning` / `-bg` | `#A9832B` / `#F4ECD8` | qe-stat warn, avisos RB-02 |
| `--semantic-danger` / `-bg` | `#A33B33` / `#F5E5E2` | Erros, reject, qe-stat bad |
| `--semantic-info` / `-bg` | `#2E5C8A` / `#E4EBF3` | Informação neutra |
| `--tag-pedagogica` / `-bg` | `#6A4E7C` / `#EDE5F1` | Categoria sugestão |
| `--tag-teal` / `-bg` | `#2C6E6A` / `#E1EEED` | Hierarquia / QE |

---

## 2. Tipografia

| Nível | Família | Peso | Tamanho | Tracking | Uso |
|-------|---------|------|---------|----------|-----|
| Display / H1 topbar | Lora | 600 | 20px | 0 | Título de página (protótipo) |
| H2 card | Lora | 600 | 16.5px | 0 | Títulos de seção |
| H3 | IBM Plex Sans | 600 | 15px | 0 | Subseções |
| Body | IBM Plex Sans | 400 | 14px | 0 | Texto, doc-pane |
| Body small / hint | IBM Plex Sans | 400 | 13px | 0 | `.hint` |
| Label UI | IBM Plex Sans | 600 | 12.5px | 0 | `.field-label` |
| Data / report | Lora | 600 | 15px | 0 | Valores relatório (`.val`) |
| Mono meta | IBM Plex Mono | 500 | 10.5–12px | 0 | org-tag, IDs processo |

**Carregamento:** Google Fonts — Lora (500–700), IBM Plex Sans (400–700), IBM Plex Mono (500).

**Dados tabulares:** `font-variant-numeric: tabular-nums` em tabelas QE e relatório.

---

## 3. Espaçamento (base 4px)

| Token | px | Uso |
|-------|-----|-----|
| `--space-1` | 4 | Gaps mínimos |
| `--space-2` | 8 | Ícone + texto |
| `--space-3` | 12 | Padding nav item vertical |
| `--space-4` | 16 | Topbar padding vertical |
| `--space-5` | 20 | Gap entre cards |
| `--space-6` | 24 | Padding card |
| `--space-7` | 28 | Padding view main |
| `--space-8` | 32 | Separação de seção |

Grid de checklist preparação: 2 colunas desktop (protótipo `.checklist`), 1 coluna &lt;900px.

---

## 4. Elevação e profundidade

**Estratégia única:** bordas flat institucionais — **sem** sombras de card no v1.

| Nível | Implementação |
|-------|----------------|
| 0 | `--background-base` |
| 1 | `--background-surface` + `1px solid --border-default` |
| 2 | Popover/dropdown: surface + border + opcional `box-shadow: 0 4px 12px rgba(27,43,69,0.08)` |
| 3 | Modal: overlay + panel |

---

## 5. Raio e dimensões

- `--radius-sm`: **3px** (global protótipo)
- Touch target mínimo: **44×44px** (RFN usabilidade)
- Sidebar width: **230px**; conteúdo max-width **1180px** (protótipo `.view`)
- Avatar: **30px**

---

## 6. Componentes primitivos (índice)

Detalhamento em `component-specs.md`:

Button, Card, FieldLabel, TextInput, SelectCustom, CheckboxCustom, Badge, Tag, Avatar, Divider, Spinner, Skeleton, Toast, Modal, Drawer, DataTable, AppShell, StepperRevisao.

---

## 7. Motion

- Duração micro: **150ms** (`ease-out`)
- Hover dropzone / nav: background opacity, não scale
- Sem spring/bounce

---

## 8. Breakpoints (mobile-first)

| Nome | min-width | Comportamento |
|------|-----------|---------------|
| `sm` | 480px | Stack rows |
| `md` | 768px | Sidebar colapsável → drawer |
| `lg` | 900px | `review-split` lado a lado (protótipo) |
| `xl` | 1200px | max-width conteúdo |

---

## 9. Acessibilidade (resumo WCAG 2.1 AA)

- Contraste texto `--ink` on `--paper`: **>7:1** (AAA body).
- `--steel` on `--paper`: verificar ≥4.5:1 para hints (ajustar se necessário para `#4F5F78`).
- Focus visible: `2px solid --border-focus`, offset 2px.
- Não depender só de cor para status QE — ícone + rótulo (`Contemplado`, `Parcial`, etc.).
- Detalhes: `accessibility-notes.md`.

---

## 10. CSS variables (snippet implementação)

```css
:root {
  --foreground-primary: #1B2B45;
  --background-base: #F3F1EA;
  --background-surface: #FFFFFF;
  --border-default: #DAD5C6;
  --brand-primary: #A9832B;
  --radius-sm: 3px;
  --font-serif: 'Lora', Georgia, serif;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
```

---

## 11. Rastreio

RF-081, RF-080, RFN-050 (usabilidade), US-041, US-014
