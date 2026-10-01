# Backlog Priorizado — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Metodologia:** MoSCoW + alinhamento gaps P0/P1/P2 (`business/gap-analysis.md`)

---

## 1. Épicos

| Epic | Nome | Fase | Objetivo |
|------|------|------|----------|
| **E0** | Fundação técnica | P0 | Docker, API base, OpenAPI, CI mínimo |
| **E1** | Acesso e identidade | MVP | Login JWT, RBAC mínimo, admin usuários |
| **E2** | Cursos e materiais | MVP | Hub operacional ILA |
| **E3** | Preparação de revisão | F2 | Wizard, uploads processo, critérios |
| **E4** | Revisão IA + HITL | F2 | Diferencial ON-01/ON-02 |
| **E5** | Conferência QE | F3 | ON-03, paridade protótipo |
| **E6** | Relatórios e exportações | F3 | Entregáveis oficiais |
| **E7** | Governança e histórico | F2–F3 | RN-024/025, M-04 |
| **E8** | UX institucional | Transversal | RN-026/027 |

---

## 2. Must have (MVP + núcleo)

| Ordem | Item | US | RF | Gap |
|-------|------|-----|-----|-----|
| 1 | Infra Docker + health | US-002 | RFN-020 | G-13 |
| 2 | OpenAPI + CORS + v1 API | US-003 | RFN-040, RFN-006 | G-14 |
| 3 | Login + JWT + logout | US-001, US-004 | RF-001–002 | G-03 |
| 4 | Guard de rotas + RBAC | US-005 | RF-003 | G-03 |
| 5 | Admin usuários | US-006 | RF-005 | P-TI-01 |
| 6 | Listar cursos | US-008 | RF-010 | G-02 |
| 7 | Cadastrar curso | US-009 | RF-011 | G-02 |
| 8 | Detalhe curso (hub) | US-010 | RF-012 | G-02 |
| 9 | Upload/lista/download material | US-011, US-012 | RF-020–021 | G-02 |
| 10 | Iniciar revisão (instância) | US-013 | RF-022 | — |
| 11 | Shell layout + responsivo | US-014 | RF-080 | G-12 |
| 12 | **Decisão G-09** (gate IA) | Workshop | RFN-008 | G-09 |

---

## 3. Should have (Fase 2 — revisão IA)

| Ordem | Item | US | RF |
|-------|------|-----|-----|
| 13 | Facade IA + jobs | US-025 | RF-090–091 |
| 14 | Wizard preparação completo | US-020–024 | RF-030–035 |
| 15 | Processamento sugestões | US-026 | RF-040–041 |
| 16 | UI aceitar/rejeitar | US-027 | RF-042 |
| 17 | Avanço controlado para QE | US-028 | RF-044 |
| 18 | Flag especialista | US-029 | RF-043 |
| 19 | Trilha append-only | US-037 | RF-070 |
| 20 | Consulta histórico | US-038 | RF-071 |
| 21 | Identidade visual protótipo | US-041 | RF-081 |

---

## 4. Should have (Fase 3 — QE e entregáveis)

| Ordem | Item | US | RF |
|-------|------|-----|-----|
| 22 | Matriz QE | US-030 | RF-050–051 |
| 23 | Detalhe item QE | US-031 | RF-052 |
| 24 | Concluir QE | US-032 | RF-053 |
| 25 | Relatório final UI | US-034 | RF-060 |
| 26 | Export docx revisado | US-035 | RF-061 |
| 27 | Encerramento processo | US-036 | RF-063 |

---

## 5. Could have (P2 / refinamento)

| Item | US | RF/RNF |
|------|-----|--------|
| PDFs relatório | US-036 (ext.) | RF-062 |
| Referências técnicas avançadas | US-022 | RF-032 |
| Refresh token | — | RFN-002 |
| Métricas Prometheus | US-009 | RFN-042 |
| WCAG AA completo | — | RFN-031 |
| SSO COMAER | — | RF-W01 |

---

## 6. Won't have (esta versão)

- LMS, publicação automática, edição colaborativa tempo real (ver `functional-requirements.md` RF-W01–W04).

---

## 7. Dependências entre épicos

```
E0 → E1 → E2 → E3 → E4 → E5 → E6
         └──────────────→ E7
E8 (paralelo a E2+)
Decisão G-09 → E4 (produção)
```

---

## 8. Critérios de pronto por release

### Release MVP

- [ ] US-001 a US-014 implementadas e testadas (E2E login + curso + upload).
- [ ] RFN-001 a RFN-006 verificados em review de segurança.
- [ ] OpenAPI publicada.

### Release F2

- [ ] Fluxo preparação → sugestões → decisões → histórico (US-020–029, US-037).
- [ ] Gate G-09 documentado e aplicado.
- [ ] M-04 parcial (100% processos F2 com trilha).

### Release F3

- [ ] Fluxo ponta a ponta RN-023 (piloto).
- [ ] Export docx Must; PDF Should.
- [ ] Meta M-01 mensurável (baseline piloto).

---

## 9. Riscos de priorização

| Risco | Mitigação no backlog |
|-------|----------------------|
| Piloto exige IA no dia 1 | Antecipar E4 após E2, mantendo MVP organizacional |
| QE impreciso | Entregar matriz + edição humana (RF-052) antes de automação agressiva |
| Escopo PDF | Could; não bloqueia docx Must |
