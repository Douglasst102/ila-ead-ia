# Visão do Produto — SAD-ILA

**Produto:** SAD-ILA — Sistema de Apoio ao Desenvolvimento de Material Didático  
**Organização:** Instituto de Logística da Aeronáutica (ILA), sob gestão do Comando-Geral de Apoio (COMGAP), no âmbito do Comando da Aeronáutica (COMAER)  
**Referência de projeto (fonte protótipo):** 26SISIAR05LOG  
**Versão do documento:** 1.0  
**Data:** 2026-10-01  

---

## 1. Visão geral

### 1.1 Propósito

O SAD-ILA apoia a **Seção de Material Didático do ILA** na produção, organização e **revisão qualificada** de materiais didáticos dos cursos de capacitação logística do COMAER. O sistema combina gestão de cursos e artefatos (materiais, Quadro Estrutural — QE, referências técnicas) com **revisão assistida por inteligência artificial**, mantendo o **revisor humano como decisor final** sobre cada sugestão.

O ILA existe para desenvolver capacidades técnicas e gerenciais dos profissionais do COMAER por ensino e pesquisa em apoio logístico. O SAD-ILA materializa esse propósito ao **reduzir esforço repetitivo de revisão**, **aumentar consistência terminológica e estrutural** e **documentar rastreabilidade** das decisões de revisão.

### 1.2 Problema de negócio

A elaboração de material didático exige alinhamento ao QE, conformidade com referências normativas e padrões pedagógicos do ILA (coerência textual, linguagem dialógica, hierarquia de conteúdo). Hoje, grande parte desse trabalho é **manual, demorado e sujeito a inconsistência** entre revisores e entre edições de um mesmo curso. A conferência QE ↔ material e a revisão técnica consomem tempo especializado que poderia ser direcionado à validação de conteúdo crítico.

### 1.3 Solução proposta (visão)

Plataforma web **moderna, limpa e responsiva** que:

1. Autentica usuários de forma segura e direciona ao painel de cursos.
2. Permite **cadastrar e listar cursos** (título, descrição) e **gerenciar materiais de apoio** por curso (upload e consulta).
3. Orquestra um **processo de revisão** iniciado explicitamente pelo usuário (“Iniciar Revisão”), incluindo — conforme escopo evolutivo — upload de QE e material em Word, referências técnicas, critérios de revisão configuráveis, sugestões de IA com aceite/rejeição, conferência QE, relatórios consolidados e histórico rastreável.

A IA **nunca aplica alterações automaticamente** ao documento; apenas sugere; o revisor decide.

### 1.4 Público-alvo

| Persona | Descrição | Necessidade principal |
|--------|-----------|------------------------|
| **Revisor / elaborador de material didático** | Militar ou civil da Seção de Material Didático ou equivalente | Conduzir revisões com apoio de IA, registrar decisões, gerar versões e relatórios |
| **Coordenador de curso / especialista de conteúdo** | Responsável por validar aderência técnica ao QE | Ver gaps de cobertura, hierarquia e conformidade com referências |
| **Gestor da área de material didático** | Supervisão de produtividade e qualidade | Visibilidade de processos, histórico e padronização |
| **Equipe de TI / sustentação (COMGAP)** | Operação, segurança e integrações | Sistema estável, auditável, aderente a políticas de segurança da instituição |

Alunos dos cursos são **beneficiários indiretos** (material mais consistente); não são usuários diretos do SAD-ILA na visão inicial.

---

## 2. Objetivos

### 2.1 Objetivos de negócio

- **ON-01:** Aumentar a eficiência do ciclo de revisão de material didático sem comprometer rigor técnico e pedagógico.
- **ON-02:** Padronizar critérios de revisão (textual, dialógica, terminológica, hierárquica, QE, técnica) aplicados de forma consistente.
- **ON-03:** Garantir **rastreabilidade** (arquivo original, sugestões, decisões, versão final, responsável e data).
- **ON-04:** Apoiar o reconhecimento do ILA pela eficácia na capacitação e assessoramento científico (alinhado à visão institucional).

### 2.2 Objetivos do produto

- **OP-01:** Disponibilizar gestão centralizada de **cursos** e **materiais de apoio**.
- **OP-02:** Implementar fluxo de **revisão com IA** com interface de decisão por sugestão.
- **OP-03:** Implementar **conferência do Quadro Estrutural** (correspondência conteúdo QE ↔ material, incluindo níveis hierárquicos).
- **OP-04:** Gerar **relatórios** (resumo textual, resumo QE) e exportações (material revisado, PDFs), conforme protótipo de referência.
- **OP-05:** Manter **histórico de processos de revisão** por curso/material.

### 2.3 Métricas de sucesso (mensuráveis)

| Métrica | Descrição | Meta indicativa (a calibrar com ILA) |
|--------|-----------|--------------------------------------|
| **M-01 Tempo médio de ciclo** | Tempo entre “Iniciar Revisão” e relatório final | Redução ≥ 30% vs. processo manual baseline (baseline a medir) |
| **M-02 Taxa de adoção de sugestões** | % sugestões aceitas vs. apresentadas | Monitorar qualidade do modelo; meta não é maximizar cegamente |
| **M-03 Cobertura QE** | % itens QE “contemplados” vs. “parcial/não localizado” | Tendência de melhoria após uso do sistema |
| **M-04 Rastreabilidade** | % processos com histórico completo | 100% dos processos concluídos no sistema |
| **M-05 Disponibilidade** | Uptime do serviço em horário de expediente | ≥ 99% (definir janela com TI) |
| **M-06 Satisfação do revisor** | Pesquisa qualitativa pós-piloto | ≥ 4/5 em utilidade percebida |

*Baseline e metas numéricas finais dependem de medição do processo atual — ver lacunas em `gap-analysis.md`.*

---

## 3. Escopo

### 3.1 Dentro do escopo (visão alvo)

- Autenticação segura e sessão de usuário.
- CRUD de cursos (mínimo: listar, cadastrar com título e descrição).
- Materiais de apoio por curso: upload, listagem, consulta/download.
- Processo de revisão: seleção de curso, envio de arquivos (QE, material Word, referências técnicas múltiplas), seleção de critérios de revisão.
- Revisão assistida por IA com categorização de sugestões (ex.: melhoria, correção, hierarquia) e fluxo aceitar/rejeitar.
- Tela de conferência QE com estatísticas e detalhamento por item.
- Relatório final consolidado e exportações indicadas no protótipo (`.docx` revisado, PDFs de revisão e conferência QE).
- Registro de histórico e rastreabilidade do processo.
- Interface responsiva e identidade visual alinhada ao protótipo institucional (referência em `others_artifacts/sad-ila-prototype 1.3.html`).

### 3.2 Fora do escopo (visão inicial)

- **LMS completo** (matrículas, avaliações de alunos, certificados de conclusão de curso EAD).
- **Publicação automática** de material em canais externos sem validação humana final.
- **Substituição do especialista** na validação de conteúdo técnico sensível ou classificado.
- **Edição colaborativa em tempo real** tipo Google Docs (salvo decisão futura explícita).
- **Integração com sistemas COMAER** não especificados nas fontes (SSO, GED corporativo, etc.) — tratadas como evolução após definição com TI.

### 3.3 Premissas

- Usuários são **profissionais autorizados** do ILA/COMGAP (ou convidados formalmente).
- Materiais e referências são fornecidos pelo usuário no formato esperado (ex.: Word para material/QE conforme protótipo).
- Existe **provedor de IA** (interno ou contratado) acessível pelo backend, com política de uso aceita pela instituição.
- Infraestrutura roda em **containers (Docker)**, conforme ambiente do projeto.

### 3.4 Restrições

- Valores institucionais: hierarquia, disciplina, excelência, rigor científico, responsabilidade social.
- Possível **classificação ou sensibilidade** de conteúdo logístico/militar — requisitos de segurança e hospedagem a detalhar com COMGAP (ver `business-requirements.md`).
- Decisões de revisão permanecem **human-in-the-loop** (requisito de negócio não negociável nas fontes).

---

## 4. Valores e princípios de produto

- **Rigor científico:** sugestões de IA são apoio; validação técnica permanece com o especialista quando indicado (ex.: lacunas de conteúdo no QE).
- **Transparência:** toda sugestão exibe justificativa; histórico preserva decisões.
- **Disciplina processual:** fluxo explícito (início → revisão → QE → relatório), sem atalhos que eliminem conferência.
- **Excelência na experiência:** interface clara, adequada a uso profissional institucional.

---

## 5. Referências de entrada

| Fonte | Conteúdo utilizado |
|-------|-------------------|
| `others_artifacts/visao-inicial.txt` | Fluxo macro: auth, cursos, materiais, iniciar revisão |
| `others_artifacts/ila-missao-visao-valores.txt` | Contexto ILA, missão, visão, valores |
| `others_artifacts/sad-ila-prototype 1.3.html` | Jornada detalhada, critérios IA, QE, relatórios, rastreabilidade |
| `TODOs.md` (repositório) | Diretrizes de segurança (JWT, hash de senha, `.env`) para encaminhamento ao Requirements Engineer |

---

## 6. Lacunas de informação (não inventadas)

- Modelo de autenticação institucional (SSO vs. cadastro local exclusivo).
- Provedor, modelo e política de dados para IA (on-premise, nuvem, anonimização).
- Nível de classificação de sigilo dos documentos e requisitos de hospedagem.
- Volume esperado (cursos, revisões/mês, tamanho médio de arquivos).
- Processo **as-is** formal (BPM, SLAs, papéis RACI) — será objeto do Process Analyst.
- Pasta `legacy/` inexistente no repositório — sem inventário de sistema anterior.

---

## 7. Evolução sugerida (fases)

| Fase | Foco | Entregáveis de negócio |
|------|------|------------------------|
| **MVP** | Cursos, materiais de apoio, auth, início de revisão com upload básico | Valor imediato na organização; base para piloto |
| **Fase 2** | Revisão IA completa + decisão por sugestão | Redução de esforço textual |
| **Fase 3** | Conferência QE + relatórios + exportações | Fechamento do ciclo conforme protótipo |
| **Fase 4** | Integrações institucionais, métricas avançadas, hardening de segurança | Escala e compliance plenos |

Priorização final cabe ao ILA/COMGAP após validação de requisitos e arquitetura.
