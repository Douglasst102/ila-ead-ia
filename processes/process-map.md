# Mapeamento de Processos — SAD-ILA

**Produto:** SAD-ILA — Sistema de Apoio ao Desenvolvimento de Material Didático  
**Organização:** ILA / COMGAP / COMAER  
**Referência de projeto:** 26SISIAR05LOG  
**Versão:** 1.0  
**Data:** 2026-10-01  

---

## 1. Propósito deste documento

Registrar o inventário de processos de negócio relacionados à gestão de cursos, materiais didáticos e ciclo de revisão qualificada, contrastando **As-Is** (inferido com transparência sobre lacunas) e **To-Be** (alinhado a RN-001–RN-027, RB-01–RB-05 e fases MVP→3 de `product-vision.md`).

**Legenda de evidência**

| Marca | Significado |
|-------|-------------|
| **Evidenciado** | Descrito explicitamente em fontes do repositório |
| **Inferido** | Deduzido de gap-analysis, visão de produto ou prática usual — **a validar com ILA** |
| **Hipótese** | Não há base nas fontes; útil para workshop com stakeholders |

---

## 2. Inventário de processos por área

| Área | ID proc. | Nome do processo | Criticidade (matriz) | Fase SAD-ILA |
|------|----------|------------------|----------------------|--------------|
| **Acesso** | P-ACC-01 | Autenticação e sessão de usuário | Alta | MVP |
| **Gestão de cursos** | P-CUR-01 | Cadastro e manutenção de curso | Alta | MVP |
| **Gestão de cursos** | P-CUR-02 | Listagem e consulta de cursos | Alta | MVP |
| **Materiais** | P-MAT-01 | Upload e consulta de materiais de apoio por curso | Alta | MVP |
| **Revisão** | P-REV-01 | Preparação do processo de revisão (curso, arquivos, critérios) | Alta | MVP (básico) / Fase 2–3 (completo) |
| **Revisão** | P-REV-02 | Revisão assistida por IA (sugestões) | Alta | Fase 2 |
| **Revisão** | P-REV-03 | Decisão human-in-the-loop por sugestão | Crítica | Fase 2 |
| **Revisão** | P-REV-04 | Escalonamento para especialista de conteúdo | Média | Fase 2 |
| **QE** | P-QE-01 | Conferência QE ↔ material (matriz e detalhamento) | Alta | Fase 3 |
| **Encerramento** | P-ENC-01 | Relatório final e exportações | Média | Fase 3 |
| **Governança** | P-GOV-01 | Histórico e rastreabilidade do processo | Alta | Fase 2–3 |
| **Operação TI** | P-TI-01 | Provisionamento de usuários e credenciais | Alta | MVP |
| **Operação TI** | P-TI-02 | Operação, backup e monitoramento (containers) | Alta | P0 infra |
| **Operação TI** | P-TI-03 | Integração e política de uso de IA (backend proxy) | Crítica | Decisão P0 |

Diagramas BPMN (Mermaid): ver `process-diagrams/README.md`.

---

## 3. Mapa de stakeholders → atores de processo

| Papel no processo | Stakeholder (fonte: `stakeholder-matrix.md`) | Participação típica |
|-------------------|-----------------------------------------------|---------------------|
| **Revisor / elaborador** | Revisores, Seção de Material Didático | Executa revisão, decide sugestões, conduz QE |
| **Especialista de conteúdo / coordenador de curso** | Especialistas | Valida lacunas técnicas, aderência QE sensível |
| **Gestor da área** | Direção / gestão ILA | Supervisão, métricas, aprovação de piloto |
| **Administrador de cursos** | Seção MD (**hipótese** — RBAC não definido) | Cadastro de cursos e materiais |
| **Usuário autenticado** | Profissionais autorizados ILA/COMGAP | Acesso a cursos e revisões |
| **Sistema SAD-ILA** | Produto | Orquestra fluxo, persiste histórico, chama IA via backend |
| **Serviço de IA** | Provedor (secundário) | Gera sugestões e análises — **sem** alterar documento |
| **TI / sustentação COMGAP** | TI, Segurança | Auth, infra, compliance, auditoria |

---

## 4. Processos detalhados — área de acesso

### P-ACC-01 — Autenticação e sessão de usuário

| Atributo | As-Is | To-Be |
|----------|-------|-------|
| **Objetivo** | Garantir que apenas pessoas autorizadas acessem material didático | Idem, com trilha técnica auditável |
| **Gatilho** | Necessidade de acessar cursos/materiais/revisão | Usuário abre URL do SAD-ILA |
| **Atores** | Revisor; possivelmente credenciais de rede/ e-mail (**inferido**) | Usuário; SAD-ILA; TI (provisionamento) |
| **Entradas** | Credenciais (**mecanismo não documentado**) | Identificador + segredo ou token SSO (**lacuna**) |
| **Saídas** | Acesso a pastas/arquivos dispersos | Sessão autenticada; JWT para API (**Evidenciado** RN-005, RN-008) |
| **Sistemas** | Ferramentas genéricas, compartilhamento de arquivos (**inferido**, G-02) | SAD-ILA (frontend + BFF), armazenamento de secrets em `.env` (RN-007) |

**Passo a passo To-Be (narrativo):** Usuário informa credenciais na tela de login (RN-005). Backend valida, emite JWT (RN-008) e redireciona ao painel de cursos. Tentativas inválidas são rejeitadas (RN-006). *SSO COMAER: evolução — lacuna RN-008.*

**Rastreabilidade:** RN-005, RN-006, RN-007, RN-008.

---

## 5. Gestão de cursos e materiais

### P-CUR-01 / P-CUR-02 — Cadastro, listagem e consulta de cursos

| Atributo | As-Is | To-Be |
|----------|-------|-------|
| **Objetivo** | Manter catálogo de cursos de capacitação logística | Catálogo centralizado no SAD-ILA |
| **Gatilho** | Novo curso ou atualização cadastral | Usuário autenticado acessa painel |
| **Atores** | Seção MD / coordenador (**inferido**) | Usuário autorizado (papel admin **a definir**) |
| **Entradas** | Título, descrição, metadados em planilha/pasta (**hipótese**) | Título e descrição mínimos (RN-002) |
| **Saídas** | Lista dispersa de cursos | Lista paginada/filtrável (RN-001) |
| **Sistemas As-Is** | Planilhas, pastas de rede, e-mail (**inferido**, gap G-02) | SAD-ILA + banco de dados |

**To-Be:** Após login, usuário visualiza cursos (RN-001), cadastra novo curso com título e descrição (RN-002). RB-04 vincula revisões futuras ao curso.

**Rastreabilidade:** RN-001, RN-002, RB-04.

### P-MAT-01 — Materiais de apoio por curso

| Atributo | As-Is | To-Be |
|----------|-------|-------|
| **Objetivo** | Disponibilizar anexos e versões de apoio ao curso | Repositório por curso no sistema |
| **Gatilho** | Elaboração ou atualização de material | Usuário entra no contexto do curso |
| **Entradas** | Arquivos Word/PDF em pastas (**inferido**) | Upload de arquivos (RN-003) |
| **Saídas** | Cópias locais, e-mail (**inferido**) | Listagem, consulta/download (RN-003) |
| **Sistemas** | Compartilhamento genérico | SAD-ILA storage |

**To-Be:** Dentro do curso, upload e listagem de materiais; ação **Iniciar Revisão** no contexto do material/curso (RN-004).

**Rastreabilidade:** RN-003, RN-004.

*Diagrama:* `process-diagrams/01-gestao-cursos-materiais.md`.

---

## 6. Processo de revisão — preparação (P-REV-01)

| Atributo | As-Is | To-Be |
|----------|-------|-------|
| **Objetivo** | Reunir insumos para revisão qualificada | Preparar processo rastreável no SAD-ILA |
| **Gatilho** | Material pronto para revisão | Clique em **Iniciar Revisão** (RN-004) |
| **Atores** | Revisor | Revisor; SAD-ILA |
| **Entradas** | QE Word, material Word, refs. técnicas em pastas (**inferido**) | Seleção de curso (RN-009); upload QE + material Word (RN-010); refs. múltiplas opcionais (RN-011); critérios selecionados (RN-012) |
| **Saídas** | Pacote informal de arquivos | Processo de revisão instanciado (RB-04) |
| **Sistemas As-Is** | Word, e-mail, checklists Excel (**inferido**, G-05, G-06) | SAD-ILA |

**Passo a passo To-Be:**

1. Revisor seleciona curso (RN-009).
2. Envia QE e material em Word (RN-010).
3. Opcionalmente anexa referências técnicas (RN-011); se ausentes, sistema informa limitação da revisão técnica normativa (**RB-02**).
4. Marca critérios: coerência/coesão, dialógica, ortografia, terminologia, hierarquia/QE, conferência QE, revisão técnica (RN-012).
5. Confirma início; sistema registra responsável, data e arquivos originais (**RN-024**, início de histórico).

**As-Is (macro, inferido):** Revisor localiza QE e material em pastas compartilhadas, alinha critérios por e-mail ou checklist local, inicia revisão manual no Word (controle de alterações/comentários). Sem fila única nem métricas padronizadas (G-08, G-10).

**Rastreabilidade:** RN-004, RN-009–RN-012, RB-02, RB-03, RB-04, RN-023.

---

## 7. Revisão assistida por IA e human-in-the-loop

### P-REV-02 — Geração e apresentação de sugestões

| As-Is | To-Be |
|-------|-------|
| Revisor lê integralmente o material e anota correções manualmente (**Evidenciado** product-vision §1.2) | Backend envia material + critérios + refs. ao serviço de IA; IA retorna sugestões categorizadas com justificativa (RN-013, RN-015) |
| Sem categorização uniforme entre revisores (**inferido**) | Categorias: melhoria, correção necessária, ajuste de hierarquia (protótipo) |
| Alterações aplicadas pelo próprio revisor no Word | **Nenhuma** alteração automática no documento (RN-013, **RB-01**) |

### P-REV-03 — Decisão por sugestão (human-in-the-loop)

**Regra central:** RB-01, RN-014 — cada sugestão exige aceite ou rejeição explícita antes de compor versão final.

**Passo a passo To-Be:**

1. Sistema exibe sugestões uma a uma ou em lista navegável (protótipo).
2. Revisor lê trecho, motivo e categoria.
3. Decisão: **Aceitar** ou **Rejeitar** (RN-014).
4. Sistema registra decisão, timestamp e usuário (RN-024).
5. Ao concluir todas as sugestões dos critérios selecionados, permite avançar para conferência QE (RN-023), desde que fluxo textual esteja completo para escopo escolhido.

**RB-03:** Critérios não selecionados na preparação não aparecem como concluídos no relatório final.

*Diagramas:* `process-diagrams/02-revisao-ponta-a-ponta-to-be.md`, `process-diagrams/04-human-in-the-loop-sugestoes-ia.md`.

### P-REV-04 — Escalonamento para especialista (RN-016)

Quando IA identifica lacuna de conteúdo ou incerteza técnica, recomenda validação pelo especialista **sem substituí-lo** (RN-016, **RB-05**).

**As-Is (inferido):** Revisor interrompe fluxo, contata especialista por e-mail/reunião, aguarda parecer, retoma Word manualmente.

**To-Be:** Sistema marca sugestão/item QE com flag “validar com especialista”; revisor registra encaminhamento e, quando aplicável, anota resultado da validação humana no processo (**detalhe funcional a especificar**). Conteúdo controverso permanece decisão do especialista (RB-05).

*Diagrama:* `process-diagrams/06-escalonamento-especialista.md`.

---

## 8. Conferência do Quadro Estrutural (P-QE-01)

| Atributo | As-Is | To-Be |
|----------|-------|-------|
| **Objetivo** | Verificar aderência estrutural e de cobertura QE ↔ material | Matriz sistemática com status e hierarquia |
| **Gatilho** | Após revisão textual (manual ou assistida) | Após conclusão da etapa de sugestões IA (RN-023, protótipo) |
| **Atores** | Revisor; eventualmente especialista (**inferido**) | Revisor; IA (apoio); especialista se RN-016 |
| **Entradas** | QE e material lado a lado (**inferido**) | Versão material pós-decisões IA + QE parseado |
| **Saídas** | Anotações em checklist/Word (**inferido**) | Status por item: contemplado, parcial, não localizado (RN-017); nível QE vs material (RN-018); detalhamento editável (RN-019) |

**Passo a passo To-Be:**

1. Sistema apresenta tabela QE ↔ material com localização, níveis e situação (protótipo).
2. Revisor seleciona linha para detalhe (RN-019).
3. Trata divergências de hierarquia (correções já aceitas na revisão IA refletidas no relatório — protótipo).
4. Itens críticos (ex.: “não localizado”) disparam recomendação de especialista (RN-016).
5. Revisor confirma conferência para encerramento.

**As-Is:** Leitura cruzada manual, checklists possivelmente Word/Excel (gap G-05, **inferido**).

**Rastreabilidade:** RN-017, RN-018, RN-019, RN-023.

*Diagrama:* `process-diagrams/05-conferencia-qe.md`.

---

## 9. Encerramento, relatórios e exportações (P-ENC-01)

| As-Is | To-Be |
|-------|-------|
| Relatório redigido manualmente ou ausente (**inferido**, G-07) | Relatório final com resumo textual + resumo QE (RN-020) |
| Entrega de `.docx` por e-mail/pasta | Download material revisado `.docx` (RN-021) |
| PDFs ad hoc | PDF relatório de revisão e PDF conferência QE (RN-022, Should) |

**Passo a passo To-Be:** Sistema consolida contagens (sugestões aceitas/rejeitadas, itens QE contemplados/parciais/não localizados — protótipo). Usuário exporta artefatos. Processo marcado como concluído; histórico completo (RN-024, M-04).

**Rastreabilidade:** RN-020–RN-022, RN-024.

---

## 10. Governança e histórico (P-GOV-01)

| As-Is | To-Be |
|-------|-------|
| Fragmentado: e-mail, versões de arquivo, comentários Word (**Evidenciado** gap G-08) | Registro único: original, sugestões, decisões, versão final, responsável, data (RN-024) |
| Auditoria difícil | Suporte a prestação de contas (RN-025) |

**KPIs associados:** M-04 (100% processos concluídos com histórico completo), M-02 (taxa aceite sugestões), M-03 (cobertura QE).

---

## 11. Operação TI (COMGAP)

### P-TI-01 — Provisionamento de usuários

**As-Is:** Controle ad hoc (**lacuna**).  
**To-Be:** Cadastro local ou integração SSO (**a validar**); apenas usuários autorizados (RN-006).

### P-TI-02 — Sustentação e disponibilidade

Containers Docker (**Evidenciado** ambiente projeto), backup, monitoramento. Meta indicativa M-05 (≥ 99% expediente — **a calibrar com TI**).

### P-TI-03 — Política de IA e dados

Backend como único ponto de integração com API de IA; secrets não no frontend (business-requirements §3.9). Decisão G-09 (classificação, on-prem vs nuvem) **bloqueia** operação se não resolvida.

**Dados trocados (auth/integração):** JWT entre frontend e BFF; credenciais de IA apenas no servidor; uploads segregados por curso/usuário (stakeholder-matrix §4.4).

---

## 12. Fluxo crítico ponta a ponta — narrativa comparativa

### 12.1 As-Is — Revisão manual (macro)

1. **Organizar curso:** localizar pasta/planilha do curso (**inferido**).
2. **Obter material e QE** de elaboradores (e-mail/pasta).
3. **Revisão textual manual** no Word (ortografia, estilo, terminologia).
4. **Conferência QE** manual item a item.
5. **Consulta normas** em PDFs/manuais separados (**inferido**).
6. **Consolidar versão final** e enviar por canal informal.
7. **Histórico** disperso (G-08).

*Sem SLA documentado; tempo baseline não medido (M-01, G-10).*

*Diagrama:* `process-diagrams/03-as-is-revisao-manual-macro.md`.

### 12.2 To-Be — Revisão com SAD-ILA (Fase 3 completa)

1. Login → painel de cursos (RN-005).
2. Selecionar curso / material → **Iniciar Revisão** (RN-004).
3. Preparação: uploads, critérios, refs. (RN-009–RN-012).
4. IA gera sugestões; revisor aceita/rejeita cada uma (**RB-01**, RN-014).
5. Escalonamentos a especialista quando indicado (RN-016, RB-05).
6. Conferência QE matriz + detalhes (RN-017–RN-019).
7. Relatório e exportações (RN-020–RN-022).
8. Histórico persistido (RN-024).

**Ordem obrigatória:** preparação → revisão IA → conferência QE → relatório (RN-023).

*Diagrama:* `process-diagrams/02-revisao-ponta-a-ponta-to-be.md`.

### 12.3 To-Be por fase de produto

| Fase | Processos habilitados |
|------|------------------------|
| **MVP** | P-ACC-01, P-CUR-*, P-MAT-01, início P-REV-01 (upload básico) |
| **Fase 2** | P-REV-02, P-REV-03, P-REV-04, P-GOV-01 (núcleo IA + histórico) |
| **Fase 3** | P-QE-01, P-ENC-01 (paridade protótipo 1.3) |
| **Fase 4** | SSO, métricas avançadas, integrações COMAER (fora escopo inicial) |

---

## 13. Matriz de rastreabilidade processo ↔ RN/RB

| Processo | RN / RB principais |
|----------|-------------------|
| P-ACC-01 | RN-005–008 |
| P-CUR-01/02 | RN-001, RN-002 |
| P-MAT-01 | RN-003, RN-004 |
| P-REV-01 | RN-009–012, RB-02, RB-03, RB-04 |
| P-REV-02/03 | RN-013–015, RB-01, RN-023 |
| P-REV-04 | RN-016, RB-05 |
| P-QE-01 | RN-017–019 |
| P-ENC-01 | RN-020–022 |
| P-GOV-01 | RN-024, RN-025 |
| Experiência transversal | RN-026, RN-027 |

---

## 14. Lacunas para validação com ILA (processo)

1. Ferramentas e pastas **as-is** reais (GED, SharePoint, rede COMAER?).
2. Existência de workflow de **homologação** acima do revisor (stakeholder-matrix §6).
3. Papéis RBAC: quem cadastra curso vs quem revisa.
4. Frequência e volume de revisões (matriz crítica qualitativa).
5. Procedimento formal quando QE e material divergem antes de publicação.
6. Baseline de tempo por etapa (M-01).

---

## 15. Referências

- `business/product-vision.md`
- `business/business-requirements.md`
- `business/gap-analysis.md` (G-01–G-14, G-11)
- `business/stakeholder-matrix.md`
- `others_artifacts/visao-inicial.txt`
- `others_artifacts/sad-ila-prototype 1.3.html`
