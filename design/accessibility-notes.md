# Notas de Acessibilidade — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Alvo:** WCAG 2.1 AA (RFN usabilidade — v1 componentes principais; roadmap AA completo F4)

Base: `.cursor/skills/uiux-design/references/accessibility-guide.md`

---

## 1. Telas críticas

### 1.1 `/revisao/[processoId]/sugestoes` (HITL)

| Requisito | Implementação |
|-----------|---------------|
| Ordem de leitura | DOM: cabeçalho progresso → doc-pane (trecho) → painel decisão; em mobile, painel **abaixo** do trecho mas anunciado como “Sugestão N de M”. |
| Realce trecho | `mark` ou `span` com classe; **não** só background amarelo — incluir `aria-current="true"` no trecho ativo. |
| Botões Aceitar/Rejeitar | `<button type="button">` com texto visível; ícones com `aria-hidden`. |
| Categorias | Badge com texto (`Correção necessária`), não só cor. |
| Atualização dinâmica | `aria-live="polite"` na região de progresso ao mudar sugestão. |
| Teclado | `A` aceitar / `R` rejeitar **somente** se documentado e desativável; default: Tab order lógico. |
| Foco | Ao avançar sugestão, mover foco para título da sugestão no painel. |

### 1.2 `/revisao/[processoId]/qe` (matriz)

| Requisito | Implementação |
|-----------|---------------|
| Tabela | `<table>` com `<caption>` (“Correspondência QE e material didático”), `<th scope="col">`. |
| Status | Coluna Situação: ícone + texto (`Contemplado`, `Parcial`, `Não localizado`, `Divergência hierárquica`). |
| Seleção linha | `tr` clicável → `aria-selected` ou botão “Ver detalhe” por linha (preferível para SR). |
| Painel detalhe | `aria-expanded` no controle; região `#qe-detail` com `role="region"` e `aria-labelledby`. |
| Scroll horizontal | Contenedor com `tabindex="0"` e instrução visível em telas estreitas. |
| Densidade | Permitir zoom 200% sem perda (RFN); evitar font-size &lt;12px em células. |

### 1.3 Uploads (preparação + hub curso)

| Requisito | Implementação |
|-----------|---------------|
| Dropzone | Botão “Selecionar arquivo” sempre presente (não só drag-drop). |
| Input file | `<label>` associado ou `aria-describedby` com formatos aceitos (.docx, .pdf). |
| Progresso | `role="progressbar"` com `aria-valuenow/max`. |
| Erro | `role="alert"` para MIME/tamanho inválido; mensagem recuperável. |
| Lista refs | Cada item: nome arquivo + botão “Remover” com `aria-label` incluindo nome. |

---

## 2. Global autenticado

- **Skip link:** “Ir para conteúdo principal” → `#main-content`.
- **Landmarks:** `nav` sidebar, `header` topbar, `main`, `footer` opcional institucional.
- **Logout:** nome acessível “Encerrar sessão”.
- **401:** redirect login com mensagem flash anunciada em live region.

---

## 3. Login

- Labels visíveis e-mail/senha; erro genérico RF-001 em `role="alert"`.
- Contraste botão primary ink on white text.

---

## 4. Admin usuários

- Modal trap focus; `Esc` fecha; retorno foco ao botão abridor.
- Tabela: cabeçalhos associados; ações por linha nomeadas (“Editar usuário {email}”).

---

## 5. Contraste — ajustes recomendados

| Par | Nota |
|-----|------|
| `#5B6B84` on `#F3F1EA` | Validar; se &lt;4.5:1, usar `#4A586E` para hints. |
| Gold on paper | Usar gold só em elementos grandes ou com `#2C4166` adjacente. |
| Sidebar `#9FB0C9` on ink | OK para secundário; foot `#7C8FAE` apenas texto pequeno não crítico. |

---

## 6. Checklist v1 (implementação)

- [ ] Contraste AA nos textos interativos principais
- [ ] Focus visible em todos os controles custom
- [ ] Formulários com label/descrição/erro
- [ ] Tabelas QE e histórico semânticas
- [ ] Live regions: jobs IA, toasts, erros upload
- [ ] Touch 44px em mobile para nav drawer e botões decisão

---

## 7. Rastreio

RF-042, RF-050, RF-031, RF-020, RF-001, RF-080, RFN (§5 usabilidade)
