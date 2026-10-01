# Análise de Design — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Referência visual:** `others_artifacts/sad-ila-prototype 1.3.html` (RF-081)

---

## 1. Intent First

| Pergunta | Resposta |
|----------|----------|
| **Quem?** | Revisor de material didático do ILA, em desktop institucional (expediente), mente focada em rigor QE + pedagogy + normas COMAER. |
| **Verbo** | **Conduzir** revisão qualificada — decidir sugestão a sugestão, conferir QE, encerrar com relatório rastreável. |
| **Sensação** | Sala de trabalho da Seção de Material Didático: mesa com apostila impressa, carimbo institucional, luz neutra; ferramenta precisa, não “SaaS colorido”. |

---

## 2. Exploração de domínio (4 outputs obrigatórios)

### 2.1 Domínio (conceitos, metáforas, vocabulário)

1. **Quadro Estrutural (QE)** — esqueleto hierárquico do curso (primário/secundário/terciário).
2. **Apostila / material didático** — texto dialógico destinado ao aluno militar.
3. **Revisão qualificada** — ato registrado, com responsável e timestamp (não “editar no Word”).
4. **Referência técnica normativa** — manuais, legislação, normas de fiscalização.
5. **Insígnia / padrão COMAER** — sobriedade, azul aeronáutico, dourado comedido.
6. **Trilha de auditoria** — original preservado, decisões append-only.

### 2.2 Mundo de cores (físico / institucional)

1. Azul **ink** de farda e documentação oficial (`#1B2B45` no protótipo).
2. **Papel algodão** de apostila e formulário (`#F3F1EA`, `#EAE7DD`).
3. **Dourado de insígnia** em detalhe, não fundo (`#A9832B`, `#F4ECD8`).
4. **Verde cartório** para “arquivo recebido / ok” (`#2E6B4C`, `#E4EFE7`).
5. **Vermelho carimbo de ressalva** (`#A33B33`).
6. **Cinza-azulado steel** de anotações marginais (`#5B6B84`).
7. **Roxo/teal** reservados a **tags semânticas de sugestão** (pedagógica, hierarquia) — já no protótipo.

### 2.3 Assinatura (elemento único SAD-ILA)

**“Painel de decisão ao lado do trecho sublinhado”** — layout split `doc-pane` + `suggest-pane` com realce `hl` no parágrafo e categorias de sugestão com chips de cor institucional. Não é lista genérica de tickets; é leitura **como revisão em margem**, digitalizada.

Elementos de assinatura adicionais (≥5 para teste):

1. Borda esquerda **dourada** no item de nav ativo (sidebar).
2. Títulos de seção em **Lora** (serif “papel didático”).
3. Dropzones que “viram verde” quando preenchidas (estado arquivo recebido).
4. Stepper de etapas **Preparação → IA → QE → Relatório** no topo do fluxo (evolução do protótipo monolítico).
5. Estatísticas QE em **blocos tipo carimbo** (`qe-stat ok/warn/bad`).
6. Nota `flow-note` de rastreabilidade no relatório (protótipo linha 629–631).

### 2.4 Padrões óbvios a evitar / substituir

| Padrão default | Substituto SAD-ILA |
|----------------|-------------------|
| Sidebar escura + cards brancos flutuantes com sombra forte | Canvas **paper**, cards **panel** com **borda `--line` apenas** (flat institucional) |
| Dashboard com 4 KPIs iguais no topo | KPIs só onde faz sentido: **QE summary** e **relatório**; lista de cursos é **catálogo**, não analytics |
| Fonte Inter/system-ui everywhere | **Lora** títulos + **IBM Plex Sans** UI + **IBM Plex Mono** metadados (org-tag, IDs) |
| Stepper horizontal genérico Material | Stepper com **rótulos de processo ILA** e bloqueio RN-023 |
| Botões Accept/Reject verde/vermelho saturados | `btn-accept` / `btn-reject` com fundos pastel do protótipo (semântica clara, tom institucional) |
| Upload drag-drop cinza neutro | Dropzone **paper-2** tracejada → **green-bg** quando filled |

---

## 3. Protótipo 1.3 vs necessidades dos RFs

| Área protótipo | Cobertura RF | Lacuna / decisão Next.js |
|----------------|--------------|---------------------------|
| Login | RF-001 | **Não modelado** no HTML — criar tela pública institucional (SSG) |
| Lista de cursos | RF-010, RF-011 | **Não modelado** — adicionar `/cursos` + modal cadastro |
| Hub materiais | RF-012, RF-020–021 | Parcialmente fundido em “Início” — separar `/cursos/[id]` |
| Wizard preparação | RF-030–035 | View `v-inicio` — **manter estrutura de cards** (curso, documentos, critérios) |
| HITL sugestões | RF-042, RF-041 | View `v-revisao` — **referência direta RF-081** |
| Matriz QE | RF-050–052 | View `v-qe` — tabela + detail panel |
| Relatório | RF-060–063 | View `v-relatorio` — tabelas serif + downloads |
| Histórico / admin | RF-071, RF-005 | **Ausente** — novas páginas |
| Stepper explícito | RF-080 | **Ausente** — inserir componente transversal |
| RBAC | RF-003, RF-005 | **Ausente** — gates por rota e nav condicional |

---

## 4. Direção proposta (síntese)

**Direção:** *Ferramenta de mesa didática institucional* — fundo papel, estrutura ink, acentos dourado em navegação ativa e avatar; profundidade por **bordas** (`--line`, opacidades sidebar), sombras mínimas ou nulas; densidade **média-alta** em QE e sugestões, **respirada** em preparação (uploads).

**Profundidade:** Apenas bordas (flat) — alinhado ao protótipo e a ferramentas técnicas densas.

**Tipografia:** Lora (presença editorial) + IBM Plex (legibilidade UI).

**Spacing:** Base **4px**; padding de card 22–24px como protótipo.

---

## 5. Verificações craft (mandato)

| Teste | Resultado esperado |
|-------|---------------------|
| **Troca** | Trocar Lora por Inter quebra identidade; trocar paper por gray-50 vira template SaaS — **reprovado** se isso ocorrer. |
| **Piscar** | Hierarquia: sidebar ink → topbar panel → main paper → cards panel; bordas `#DAD5C6` sutis. |
| **Assinatura** | Split revisão, nav gold, dropzone filled verde, qe-stat, flow-note — **≥5 pontos**. |
| **Tokens** | `--ink`, `--paper`, `--line`, `--gold` nomeiam mundo; evitar `--gray-700` como primário. |

---

## 6. Decisões registradas

1. Sidebar **230px** (protótipo) — colapsável &lt;768px em drawer (US-014).
2. Raio **3px** (`--radius`) — técnico, não “friendly bubble”.
3. Categorias de sugestão mapeadas a cores do protótipo (`pedagogica`→purple, `correcao`→red, etc.).
4. Dados sempre via BFF; estados loading/empty/error explícitos por página (ADR-002).
5. Form controls **custom** (skill) — selects de curso/módulo não nativos estilizados.

---

## 7. Rastreio

RF-081, RF-080, RF-042, RF-050, RF-060, US-041, US-014
