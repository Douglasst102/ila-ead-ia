# Oportunidades de Melhoria — SAD-ILA

**Produto:** SAD-ILA  
**Data:** 2026-10-01  
**Versão:** 1.0  

---

## 1. Contexto

Este documento consolida gargalos do **As-Is** inferido, oportunidades de automação e simplificação via **SAD-ILA**, riscos de processo, quick wins versus mudanças organizacionais, itens de validação com stakeholders e **RACI sugerido** para processos críticos.

Fontes: `gap-analysis.md` (§2, §6, §8), `product-vision.md` (§6), `stakeholder-matrix.md` (§6).

---

## 2. Gargalos As-Is (evidência vs inferência)

| # | Gargalo | Tipo | Evidência / nota | Impacto |
|---|---------|------|------------------|---------|
| GAP-P01 | Revisão textual 100% manual, repetitiva | **Evidenciado** (product-vision §1.2) | Tempo especializado em ortografia/estilo | Alto — M-01 |
| GAP-P02 | Conferência QE por leitura cruzada | **Inferido** (gap G-05) | Inconsistência entre revisores/unidades | Alto — M-03 |
| GAP-P03 | Catálogo de cursos/materiais disperso | **Inferido** (G-02) | Perda de tempo localizando arquivos | Médio |
| GAP-P04 | Confronto normativo sem engine unificada | **Inferido** (G-06) | Revisão técnica incompleta ou ad hoc | Médio |
| GAP-P05 | Histórico fragmentado (e-mail, Word, pastas) | **Evidenciado** (G-08) | Auditoria e prestação de contas difíceis | Alto — M-04 |
| GAP-P06 | Critérios de revisão não padronizados | **Inferido** (ON-02) | Relatórios incomparáveis entre ciclos | Médio |
| GAP-P07 | Escalonamento a especialista informal | **Inferido** (RN-016 contexto) | Atrasos e falta de registro | Médio |
| GAP-P08 | Ausência de baseline de tempo/qualidade | **Evidenciado** (G-10, M-01) | ROI do piloto difícil de provar | Médio |
| GAP-P09 | Decisão de IA/dados não tomada | **Evidenciado** (G-09) | Bloqueio operacional se material sensível | Crítico |

---

## 3. Automação e melhoria via SAD-ILA

| Oportunidade | Processo | Solução To-Be | Fase | RN/RB |
|--------------|----------|---------------|------|-------|
| **O-01** Hub único cursos + materiais | P-CUR-*, P-MAT-01 | CRUD + storage | MVP | RN-001–004 |
| **O-02** Fluxo guiado de revisão | P-REV-01 | Wizard preparação | MVP→3 | RN-009–012, RN-023 |
| **O-03** Sugestões IA categorizadas | P-REV-02 | Backend IA + UI | Fase 2 | RN-013, RN-015 |
| **O-04** Registro automático de decisões | P-REV-03 | Aceitar/rejeitar + log | Fase 2 | RN-014, RB-01, RN-024 |
| **O-05** Matriz QE automatizada | P-QE-01 | Parsing + IA/heurísticas | Fase 3 | RN-017–019 |
| **O-06** Relatórios e exportações | P-ENC-01 | Geração docx/pdf | Fase 3 | RN-020–022 |
| **O-07** Trilha única de auditoria | P-GOV-01 | Histórico imutável | Fase 2–3 | RN-024, RN-025 |
| **O-08** Alerta refs. ausentes | P-REV-01 | Mensagem RB-02 | Fase 2 | RB-02 |
| **O-09** Flag “validar especialista” | P-REV-04 | RN-016 no fluxo | Fase 2 | RN-016, RB-05 |

---

## 4. Simplificações de processo

| Antes (As-Is) | Depois (To-Be) | Benefício |
|---------------|----------------|-----------|
| Múltiplas pastas por curso | Um curso = container lógico no sistema | Menos erro de versão |
| Checklist QE em planilha separada | Mesma sessão pós-revisão IA | RN-023 continuidade |
| Relatório redigido do zero | Agregação automática de contagens | M-01 fim de ciclo |
| Critérios “implícitos” | Seleção explícita + RB-03 | Relatório honesto sobre escopo |

---

## 5. Riscos de processo (To-Be)

| Risco | Mitigação processual |
|-------|----------------------|
| Revisor aceitar sugestões IA sem ler (**confiança excessiva**) | Treinamento; M-02 monitorado; justificativa obrigatória por sugestão (RN-015) |
| Pular conferência QE após IA | RN-023 ordem fixa; UI sem atalho (disciplina processual — product-vision §4) |
| Material classificado enviado a IA externa | Gate P-TI-03 antes de habilitar P-REV-02 em produção |
| MVP percebido incompleto vs protótipo | Comunicação de fases (gap §5); piloto com escopo acordado |
| RBAC indefinido → cadastro indevido de curso | RACI + papéis mínimos antes rollout amplo |

---

## 6. Quick wins vs mudanças organizacionais

### Quick wins (baixa resistência, alto valor percebido)

1. **MVP:** painel de cursos + materiais + auth (O-01) — organização imediata mesmo sem IA.
2. **Piloto Fase 2:** apenas critérios textuais (gramática, coesão) antes de QE completo.
3. **Medição manual paralela** durante piloto para iniciar M-01 baseline (G-10).

### Mudanças organizacionais (exigem patrocínio ILA)

1. Adotar SAD-ILA como **fonte oficial** de histórico de revisão (substituir e-mail como registro).
2. Definir **política de dados** e provedor IA aprovado (G-09).
3. Formalizar **escalonamento** revisor → especialista com SLA interno (**a validar** — não inventado).
4. Possível **comitê de homologação** pós-relatório — lacuna stakeholder-matrix §6.

---

## 7. Itens de validação com stakeholders (lacunas §6 gap-analysis + product-vision §6)

| # | Pergunta / validação | Stakeholder sugerido |
|---|----------------------|----------------------|
| V-01 | Quais ferramentas as-is (rede, GED, planilhas)? | Seção MD |
| V-02 | Classificação máxima de sigilo dos Word/QE | Segurança COMGAP |
| V-03 | IA on-prem vs nuvem; anonimização | TI + Segurança |
| V-04 | SSO obrigatório na v1? | TI COMGAP |
| V-05 | Volume e tamanho máximo de arquivos | Seção MD + TI |
| V-06 | Existe homologação superior ao revisor? | Direção ILA |
| V-07 | Nomes/cargos para RACI e product owner 26SISIAR05LOG | Patrocinador |
| V-08 | Baseline tempo ciclo revisão manual | Revisores + Gestão |
| V-09 | Provedor IA institucional aprovado | COMGAP + contratos |
| V-10 | Política retenção/exclusão uploads e logs | Segurança + Jurídico (**se aplicável**) |

---

## 8. RACI sugerido (processos críticos)

*Papéis formais são lacuna — matriz **proposta** para workshop.*

**Papéis:** **R** Responsável | **A** Aprovador | **C** Consultado | **I** Informado

| Processo | Revisor | Especialista | Seção MD (gestão) | TI COMGAP | Segurança | Direção ILA |
|----------|---------|--------------|-------------------|-----------|-----------|-------------|
| P-ACC-01 | I | I | C | **R/A** | C | I |
| P-CUR-01/02 | C | I | **R/A** | C | I | I |
| P-MAT-01 | **R** | I | A | C | I | I |
| P-REV-01 | **R/A** | C | I | I | C (dados) | I |
| P-REV-02/03 | **R/A** | C | I | C (IA) | C | I |
| P-REV-04 | R | **A** (conteúdo) | I | I | I | I |
| P-QE-01 | **R** | **A** (lacunas) | C | I | I | I |
| P-ENC-01 | **R** | C | A (arquivo oficial?) | I | I | I |
| P-GOV-01 | R | I | **A** | C | **C** | I |
| P-TI-02/03 | I | I | C | **R/A** | **A** (IA/dados) | I |

**Nota:** Célula “A (arquivo oficial?)” depende de V-06.

---

## 9. Relação com fechamento de gaps

| Gap | Oportunidade principal |
|-----|------------------------|
| G-02 | O-01 |
| G-04 | O-03, O-04 |
| G-05 | O-05 |
| G-07 | O-06 |
| G-08 | O-07 |
| G-09 | P-TI-03 + V-02, V-03 |
| G-10 | Quick win medição + M-01 |
| G-11 | Este pacote `processes/` |

---

## 10. Próximos passos recomendados

1. Workshop Seção MD: validar V-01, V-06, V-08 e RACI §8.
2. Reunião TI/Segurança: V-02, V-03, V-04 antes de Fase 2.
3. Requirements Engineer: converter RB/RN em fluxos funcionais e RBAC.
4. Iniciar piloto com escopo de fase explicitamente assinado (MVP vs Fase 3).

---

## 11. Referências

- `processes/process-map.md`
- `processes/critical-processes-matrix.md`
- `business/gap-analysis.md`
