# Matriz de Processos Críticos — SAD-ILA

**Produto:** SAD-ILA  
**Data:** 2026-10-01  
**Versão:** 1.0  

---

## 1. Objetivo

Priorizar processos de negócio por criticidade, impacto e dependências, alinhando-se ao gap analysis (P0/P1/P2) e às métricas M-01–M-06 de `product-vision.md`.

**Nota metodológica:** Frequências e volumes são **qualitativas** — não há baseline nas fontes (G-10). Valores numéricos de SLA **não** foram inventados.

---

## 2. Escala de avaliação

| Dimensão | Escala |
|----------|--------|
| **Criticidade** | Crítica / Alta / Média / Baixa |
| **Frequência (estimada)** | Contínua / Recorrente alta / Recorrente média / Esporádica |
| **Impacto se falhar** | Bloqueio operacional / Degradação de qualidade / Retrabalho / Baixo |
| **Prioridade gap** | P0 / P1 / P2 (ref. `gap-analysis.md`) |

---

## 3. Matriz consolidada

| ID | Processo | Dono (papel) | Criticidade | Frequência est. | Impacto | Dependências | Sistemas As-Is | Sistemas To-Be | KPIs | Prioridade |
|----|----------|--------------|-------------|-----------------|---------|--------------|----------------|----------------|------|------------|
| **P-ACC-01** | Autenticação e sessão | TI COMGAP + Seção MD (uso) | Alta | Contínua | Bloqueio | Política SSO; provisionamento usuários | Credenciais dispersas (**lacuna**) | SAD-ILA + JWT | M-05 | **P0** (G-03) |
| **P-CUR-02** | Listagem de cursos | Seção MD / admin curso (**hipótese**) | Alta | Recorrente alta | Retrabalho | P-ACC-01 | Planilhas/pastas (**inferido**) | SAD-ILA | — | **P0** MVP (G-02) |
| **P-CUR-01** | Cadastro de curso | Seção MD | Alta | Recorrente média | Retrabalho | P-ACC-01 | Manual (**inferido**) | SAD-ILA | — | **P0** MVP |
| **P-MAT-01** | Materiais de apoio | Elaborador / Seção MD | Alta | Recorrente alta | Degradação qualidade | P-CUR-* | Pastas compartilhadas (**inferido**) | SAD-ILA storage | — | **P0** MVP |
| **P-REV-01** | Preparação revisão | Revisor | Alta | Recorrente alta | Retrabalho | P-MAT-01; formatos Word | Word, e-mail (**inferido**) | SAD-ILA | M-01 (início ciclo) | **P0** MVP parcial / **P1** completo |
| **P-REV-02** | Sugestões IA | Revisor + Serviço IA | Alta | Recorrente alta | Degradação qualidade / confiança | P-TI-03; G-09 decisão | N/A (manual) | SAD-ILA + IA backend | M-01, M-02, M-06 | **P1** (G-04) |
| **P-REV-03** | Human-in-the-loop | Revisor | **Crítica** | Por sugestão (alta densidade) | Bloqueio legal/institucional se bypass | RB-01; RN-014 | Word track changes (**inferido**) | SAD-ILA UI | M-02, M-04, M-06 | **P1** |
| **P-REV-04** | Escalonamento especialista | Revisor + Especialista | Média–Alta | Esporádica–média | Conteúdo incorreto sensível | RN-016; RB-05 | E-mail/reunião (**inferido**) | SAD-ILA flags + trilha | M-03, M-06 | **P1** |
| **P-QE-01** | Conferência QE | Revisor (+ Especialista) | Alta | Por material/unidade | Degradação estrutural | P-REV-03; QE válido | Checklist manual (**inferido**) | SAD-ILA + IA/heurísticas | M-03, M-01 | **P1** (G-05) |
| **P-ENC-01** | Relatório e exportações | Revisor / Seção MD | Média | Por ciclo concluído | Retrabalho / arquivo | P-QE-01; P-GOV-01 | Word/PDF manual (**inferido**) | SAD-ILA geração docx/pdf | M-04, M-01 (fim ciclo) | **P2** (G-07) |
| **P-GOV-01** | Histórico e rastreabilidade | Seção MD; Auditores | Alta | Contínua (por processo) | Compliance / auditoria | Todos processos revisão | Fragmentado (G-08) | SAD-ILA persistência | M-04 | **P1** (G-08) |
| **P-TI-02** | Operação infra | TI COMGAP | Alta | Contínua | Bloqueio | Docker, backup | N/A produto | Containers, monitoramento | M-05 | **P0** (G-13) |
| **P-TI-03** | Política IA/dados | TI + Segurança + Gestão ILA | **Crítica** | Por chamada IA | Risco institucional | Classificação sigilo | Indefinido (G-09) | Backend proxy IA | — | **P0** decisão |

---

## 4. Processos críticos — detalhamento (top 6)

### 4.1 P-REV-03 — Human-in-the-loop (Crítica)

- **Por quê:** RB-01 e valores institucionais exigem revisor como decisor; bypass automatizaria risco de conteúdo oficial incorreto.
- **Dependências:** UI de sugestões, persistência de decisões, geração de versão final apenas pós-aceites.
- **KPIs:** M-02 (qualidade do modelo, não maximizar cegamente), M-04, M-06.
- **Gap:** G-04.

### 4.2 P-TI-03 — Política de IA e dados (Crítica)

- **Por quê:** Material logístico/militar pode ser sensível; envio a nuvem externa pode ser inviável.
- **Dono:** COMGAP Segurança + patrocinador ILA.
- **Gap:** G-09 — **decisão** antes de piloto com dados reais.

### 4.3 P-REV-02 + P-QE-01 — Núcleo de valor (Alta)

- **Por quê:** Diferencial do produto (ON-01, ON-02); expectativa do protótipo.
- **Risco:** Imprecisão IA → perda de confiança (gap-analysis §8).
- **KPIs:** M-01, M-03, M-06.

### 4.4 P-GOV-01 — Rastreabilidade (Alta)

- **Por quê:** RN-024/025, auditores, prestação de contas Seção MD.
- **KPI:** M-04 meta 100% processos concluídos no sistema.

### 4.5 P-ACC-01 + P-TI-02 — Fundação (Alta)

- **Por quê:** Sem auth e infra estável, nenhum processo To-Be opera (G-01, G-03, G-13).

### 4.6 P-MAT-01 + P-CUR-* — Base operacional (Alta)

- **Por quê:** Hub de cursos (visao-inicial); prerequisite para RB-04.

---

## 5. Mapa de dependências (resumo)

```
P-TI-03 (decisão IA) ──► P-REV-02 ──► P-REV-03 ──► P-QE-01 ──► P-ENC-01
                              │              │
                              └──────────────┴──► P-GOV-01
P-ACC-01 ──► P-CUR-* ──► P-MAT-01 ──► P-REV-01 ──► (mesmo fluxo acima)
P-TI-02 ──► (todos processos To-Be)
```

---

## 6. Priorização executiva (alinhada gap analysis)

| Prioridade | Processos | Objetivo de negócio |
|------------|-----------|---------------------|
| **P0** | P-ACC-01, P-CUR-*, P-MAT-01, P-TI-02, decisão P-TI-03 | Fundação MVP + segurança |
| **P1** | P-REV-01 completo, P-REV-02/03/04, P-QE-01, P-GOV-01 | Fechar G-04, G-05, G-08, G-11; métricas M-01 piloto |
| **P2** | P-ENC-01 exportações avançadas, refs. técnicas aprofundadas (RN-011) | G-06, G-07; SSO (G-12 evolução) |

---

## 7. Lacunas que afetam a matriz

- **Dono formal** por processo (RACI) — ver `improvement-opportunities.md`.
- **Frequência quantitativa** (revisões/mês, usuários simultâneos).
- **Comitê de homologação** além do revisor — altera criticidade de P-ENC-01.

---

## 8. Referências

- `processes/process-map.md`
- `business/gap-analysis.md` §4
- `business/product-vision.md` §2.3 (M-01–M-06)
