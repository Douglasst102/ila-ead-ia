# Requisitos de Negócio — SAD-ILA

**Produto:** SAD-ILA — Sistema de Apoio ao Desenvolvimento de Material Didático  
**Data:** 2026-10-01  
**Versão:** 1.0  

---

## 1. Contexto

O ILA capacita profissionais do COMAER em logística aeronáutica. A Seção de Material Didático produz e revisa apostilas e materiais alinhados a Quadros Estruturais (QE) e referências técnicas. O SAD-ILA digitaliza e acelera esse ciclo com apoio de IA, preservando decisão humana e rastreabilidade.

---

## 2. Objetivos de negócio (resumo)

Referência completa: `product-vision.md` (ON-01 a ON-04, OP-01 a OP-05).

---

## 3. Requisitos de negócio (RN)

Formato: **RN-xxx** — descrição testável em nível de negócio (detalhamento funcional ficará com Requirements Engineer).

### 3.1 Gestão de cursos e materiais

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-001** | O sistema deve permitir que usuários autenticados visualizem a lista de cursos existentes. | Must | visao-inicial |
| **RN-002** | O sistema deve permitir cadastrar novo curso informando pelo menos **título** e **descrição**. | Must | visao-inicial |
| **RN-003** | O sistema deve permitir, dentro de cada curso, **gerenciar materiais de apoio**: enviar arquivos e consultar/listar os anexos. | Must | visao-inicial |
| **RN-004** | O sistema deve oferecer ação explícita **“Iniciar Revisão”** a partir do contexto do curso/material. | Must | visao-inicial |

### 3.2 Acesso e usuários

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-005** | O fluxo do usuário deve iniciar em **tela de autenticação segura** e, após sucesso, direcionar ao **painel principal de cursos**. | Must | visao-inicial |
| **RN-006** | Apenas usuários autorizados devem acessar cursos, materiais e processos de revisão (controle de acesso por autenticação). | Must | visao-inicial, TODOs |
| **RN-007** | Credenciais e segredos de integração **não** devem ser embutidos no código; configuração via ambiente (`.env`), com orientação de segurança documentada para implementação. | Must | TODOs — encaminhar como RFN |
| **RN-008** | Comunicação entre interface web e serviços de negócio deve usar autenticação baseada em **token (JWT)** após login. | Must | TODOs — encaminhar como RFN |

*Mecanismo exato de provisão de usuários (SSO COMAER vs. tabela local) — **lacuna**; RN-005/006 permanecem válidos.*

### 3.3 Processo de revisão — preparação

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-009** | O revisor deve **selecionar o curso** ao qual o material didático pertence antes de iniciar a revisão. | Must | protótipo |
| **RN-010** | O sistema deve aceitar upload do **Quadro Estrutural (QE)** e do **material didático** correspondente, em formato **Word**, para o processo de revisão. | Must | protótipo |
| **RN-011** | O sistema deve aceitar **uma ou mais referências técnicas** (normas, manuais, legislação) para confronto de conformidade. | Should | protótipo |
| **RN-012** | O revisor deve poder **selecionar critérios de revisão** entre dimensões como: coerência/coesão textual, linguagem dialógica, ortografia/gramática, consistência terminológica, subordinação hierárquica conforme QE, conferência com QE, revisão técnica. | Must | protótipo |

### 3.4 Revisão assistida por IA

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-013** | A IA deve **apresentar sugestões** sobre o material; **nenhuma alteração** deve ser aplicada automaticamente ao documento. | Must | protótipo |
| **RN-014** | Cada sugestão deve ser **avaliada pelo revisor** (aceitar ou rejeitar) antes de compor a versão final. | Must | protótipo |
| **RN-015** | Sugestões devem ser **categorizadas** de forma compreensível (ex.: melhoria, correção necessária, ajuste de hierarquia), com **justificativa** textual. | Should | protótipo |
| **RN-016** | Quando a IA identificar lacuna de conteúdo ou incerteza técnica, deve **recomendar validação pelo especialista** responsável, sem substituir esse papel. | Should | protótipo |

### 3.5 Conferência do Quadro Estrutural (QE)

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-017** | O sistema deve comparar itens do **QE** com o **material didático**, indicando situações como: contemplado, cobertura parcial, não localizado. | Must | protótipo |
| **RN-018** | A conferência deve considerar **nível hierárquico** previsto no QE versus nível identificado no material (ex.: primário, secundário, terciário). | Must | protótipo |
| **RN-019** | O revisor deve poder **detalhar** cada item da matriz QE ↔ material (localização, divergências, texto explicativo). | Should | protótipo |

### 3.6 Relatórios, exportações e encerramento

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-020** | Ao concluir o fluxo, o sistema deve apresentar **relatório final** consolidando resumo da revisão textual e resumo da conferência QE (contagens agregadas). | Must | protótipo |
| **RN-021** | O usuário deve poder obter **material revisado** em formato Word (`.docx`). | Must | protótipo |
| **RN-022** | O usuário deve poder obter **relatório de revisão** e **relatório de conferência do QE** em PDF. | Should | protótipo |
| **RN-023** | O fluxo deve permitir progressão lógica: preparação → revisão IA → conferência QE → relatório final. | Must | protótipo |

### 3.7 Rastreabilidade e histórico

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-024** | O sistema deve registrar **histórico do processo**: arquivo original, sugestões apresentadas, decisões do revisor, versão final, **data** e **responsável** pela revisão. | Must | protótipo |
| **RN-025** | Registros de histórico devem suportar **prestação de contas** e auditoria interna (integridade e não repúdio a detalhar em requisitos não funcionais). | Should | protótipo, stakeholders TI |

### 3.8 Experiência e qualidade institucional

| ID | Requisito | Prioridade | Fonte |
|----|-----------|------------|-------|
| **RN-026** | A interface deve ser **moderna, limpa e responsiva**, adequada a uso profissional institucional. | Must | visao-inicial |
| **RN-027** | A identidade visual deve refletir contexto **ILA/COMGAP/COMAER** (referência de protótipo HTML institucional). | Should | protótipo |

### 3.9 Dados sensíveis, compliance e integrações (encaminhamento)

Estes pontos devem virar **requisitos não funcionais e de segurança** na etapa de Requirements Engineer:

| Tema | Orientação de negócio |
|------|------------------------|
| **Material classificado ou sensível** | Definir classificação máxima suportada e se documentos podem ser enviados a IA externa. |
| **Retenção e exclusão** | Política de tempo de guarda de uploads e logs. |
| **Integrações COMAER** | SSO, diretórios corporativos, GED — fora do escopo até decisão formal. |
| **API externa de IA** | Backend como único ponto de integração (proxy/fachada), sem exposição de chaves ao frontend — alinhado a `TODOs.md`. |

---

## 4. Regras de negócio (RB)

| ID | Regra |
|----|--------|
| **RB-01** | Toda alteração no texto do material revisado derivada de sugestão de IA exige **aceite explícito** do revisor. |
| **RB-02** | Referências técnicas são **opcionais** no sentido de quantidade, porém quando ausentes a **revisão técnica normativa** pode ficar limitada — o sistema deve deixar isso claro ao usuário. |
| **RB-03** | Critérios de revisão não selecionados no início **não** devem ser apresentados como concluídos no relatório final. |
| **RB-04** | Um processo de revisão está **vinculado** a um curso (e material/QE específicos) para fins de rastreabilidade. |
| **RB-05** | Decisões sobre conteúdo técnico controverso permanecem com o **especialista humano**, mesmo quando a IA aponta conformidade ou divergência. |

---

## 5. Restrições de negócio

- Atividades alinhadas à **missão do ILA**: ensino e pesquisa em apoio logístico.
- Observância dos **valores institucionais** (hierarquia, disciplina, excelência, rigor científico, etc.).
- Ambiente de implementação orientado a **containers Docker** (regra de ambiente do projeto).

---

## 6. Premissas

- Revisores possuem competência para interpretar sugestões de IA e o QE.
- Formato Word é aceito pelos elaboradores como padrão de entrega na Seção de Material Didático.
- Haverá ambiente de **piloto** antes de rollout amplo.

---

## 7. Dependências externas

- Disponibilidade de **serviço de IA** com qualidade adequada para português técnico-jurídico administrativo.
- Infraestrutura COMGAP para hospedagem, backup e monitoramento.
- Definição institucional sobre **tratamento de dados** em modelos de linguagem.

---

## 8. Rastreabilidade às fontes

| Artefato | Uso |
|----------|-----|
| `others_artifacts/visao-inicial.txt` | RN-001 a RN-008, RN-026 |
| `others_artifacts/sad-ila-prototype 1.3.html` | RN-009 a RN-025, RN-027 |
| `others_artifacts/ila-missao-visao-valores.txt` | Contexto e restrições culturais |
| `TODOs.md` | RN-007, RN-008, temas de segurança |

---

## 9. Lacunas registradas

- Papéis formais (RBAC): revisor vs. administrador de cursos vs. gestor.
- SLAs de processamento de IA para documentos grandes.
- Política de versionamento de cursos e materiais (uma revisão por versão?).
- Requisitos de acessibilidade (WCAG) não mencionados nas fontes.
