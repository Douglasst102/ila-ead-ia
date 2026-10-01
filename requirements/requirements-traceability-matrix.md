# Matriz de Rastreabilidade de Requisitos — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  

---

## 1. Objetivo

Ligar **necessidades de negócio (RN)**, **requisitos funcionais (RF)**, **requisitos não funcionais (RFN)**, **processos (P-xxx)**, **gaps (G-xxx)** e **User Stories (US-xxx)** para garantir cobertura e priorização.

---

## 2. RN → RF / RFN

| RN | Descrição (resumo) | RF | RFN |
|----|-------------------|-----|-----|
| RN-001 | Listar cursos | RF-010 | RFN-030 |
| RN-002 | Cadastrar curso | RF-011 | RFN-004 |
| RN-003 | Materiais de apoio | RF-020, RF-021 | RFN-005 |
| RN-004 | Iniciar Revisão | RF-022 | — |
| RN-005 | Login → painel | RF-001, RF-004 | RFN-002, RFN-050 |
| RN-006 | Acesso autorizado | RF-003, RF-005 | RFN-004 |
| RN-007 | Secrets em `.env` | — | RFN-001 |
| RN-008 | JWT | RF-002 | RFN-002 |
| RN-009 | Selecionar curso revisão | RF-030 | — |
| RN-010 | Upload QE + material Word | RF-031 | RFN-005, RFN-010 |
| RN-011 | Referências técnicas | RF-032 | RFN-005 |
| RN-012 | Critérios de revisão | RF-033 | — |
| RN-013 | IA sugere, não aplica | RF-040 | RFN-008, RFN-060 |
| RN-014 | Aceitar/rejeitar | RF-042 | RFN-007 |
| RN-015 | Categorizar + justificar | RF-041 | — |
| RN-016 | Validar especialista | RF-043 | — |
| RN-017 | Status QE ↔ material | RF-050 | — |
| RN-018 | Nível hierárquico | RF-051 | — |
| RN-019 | Detalhar item QE | RF-052 | — |
| RN-020 | Relatório final UI | RF-060 | — |
| RN-021 | Export `.docx` | RF-061 | RFN-005 |
| RN-022 | PDFs | RF-062 | — |
| RN-023 | Ordem do fluxo | RF-035, RF-044, RF-053, RF-080 | RFN-060 |
| RN-024 | Histórico | RF-070, RF-063 | RFN-007 |
| RN-025 | Auditoria | RF-071 | RFN-007 |
| RN-026 | UI responsiva | RF-080 | RFN-030 |
| RN-027 | Identidade ILA | RF-081 | — |

---

## 3. Regras de negócio → RF

| RB | RF impactados |
|----|---------------|
| RB-01 | RF-040, RF-042, RF-061, RFN-060 |
| RB-02 | RF-034 |
| RB-03 | RF-033, RF-060 |
| RB-04 | RF-022, RF-030, RF-035 |
| RB-05 | RF-043 |

---

## 4. Processos → RF (principais)

| Processo | RF |
|----------|-----|
| P-ACC-01 | RF-001–005 |
| P-CUR-01/02 | RF-010–012 |
| P-MAT-01 | RF-020–022 |
| P-REV-01 | RF-030–035 |
| P-REV-02 | RF-040, RF-041, RF-090, RF-091 |
| P-REV-03 | RF-042, RF-044 |
| P-REV-04 | RF-043 |
| P-QE-01 | RF-050–053 |
| P-ENC-01 | RF-060–063 |
| P-GOV-01 | RF-070–071 |
| P-TI-03 | RF-090, RFN-008 |

---

## 5. Objetivos de negócio / produto → RF

| ID | RF / RFN |
|----|----------|
| ON-01 | RF-040–044, RF-050, RFN-011 |
| ON-02 | RF-033, RF-041 |
| ON-03 | RF-070–071, RFN-007 |
| ON-04 | RF-080, RF-081 |
| OP-01 | RF-010–021 |
| OP-02 | RF-040–044 |
| OP-03 | RF-050–053 |
| OP-04 | RF-060–062 |
| OP-05 | RF-070–071 |

---

## 6. Gaps → RF / RFN / US

| Gap | Fechamento |
|-----|------------|
| G-01 | Conjunto MVP→F3 (US-001+) |
| G-02 | RF-010–021, US-008–013 |
| G-03 | RF-001–005, US-001–005 |
| G-04 | RF-040–044, US-020–026 |
| G-05 | RF-050–053, US-030–033 |
| G-06 | RF-032, US-022 |
| G-07 | RF-060–062, US-034–036 |
| G-08 | RF-070–071, US-037–038 |
| G-09 | RFN-008, US-025, decisão workshop |
| G-13 | RFN-020, US-002 (infra) |
| G-14 | RFN-040, US-003 |

---

## 7. RF → User Story (índice)

| RF | US |
|----|-----|
| RF-001, RF-002, RF-004 | US-001, US-004 |
| RF-003 | US-005 |
| RF-005 | US-006 |
| RF-010 | US-008 |
| RF-011 | US-009 |
| RF-012 | US-010 |
| RF-020, RF-021 | US-011, US-012 |
| RF-022 | US-013 |
| RF-080 | US-014 |
| RF-030–035 | US-020–024 |
| RF-040, RF-041, RF-090, RF-091 | US-025, US-026 |
| RF-042, RF-044 | US-027, US-028 |
| RF-043 | US-029 |
| RF-050–053 | US-030–033 |
| RF-060–063 | US-034–036 |
| RF-070–071 | US-037, US-038 |
| RF-080, RF-081 | US-014, US-041 |
| RFN transversais | US-002, US-003, US-007 |

---

## 8. Lacunas de informação → validação

| Lacuna | Item validação | RF/RFN afetados |
|--------|----------------|-----------------|
| SSO | V-04 | RF-W01 |
| Sigilo | V-02 | RFN-008 |
| IA cloud | V-03 | RF-090 |
| Tamanho arquivo | V-05 | RFN-010 |
| RBAC formal | V-07 + RACI | RF-003, RF-005 |
| Retenção | V-10 | RFN-012 |

---

## 9. Cobertura

- **RN-001 a RN-027:** mapeados (RN-007/008 via RFN).
- **RB-01 a RB-05:** mapeados.
- **Processos P-ACC a P-GOV:** mapeados (P-TI-02 via RFN-020/021).

**Status:** cobertura completa em nível de especificação; detalhes de API e modelo físico pendem Software Architect / Technical Analyst.
