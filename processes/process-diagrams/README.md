# Diagramas de Processo — SAD-ILA (BPMN em Mermaid)

**Notação:** Fluxos sequenciais com gateways `{decisão}`; swimlanes via `subgraph` quando aplicável. Compatível com renderizadores Mermaid padrão (GitHub, VS Code, etc.).

| Arquivo | Processo | Escopo |
|---------|----------|--------|
| [01-gestao-cursos-materiais.md](./01-gestao-cursos-materiais.md) | P-ACC-01, P-CUR-*, P-MAT-01 | To-Be MVP — gestão e início de revisão |
| [02-revisao-ponta-a-ponta-to-be.md](./02-revisao-ponta-a-ponta-to-be.md) | P-REV-01 → P-ENC-01 | To-Be Fase 3 completa (RN-023) |
| [03-as-is-revisao-manual-macro.md](./03-as-is-revisao-manual-macro.md) | Macro As-Is | **Inferido** — validar com ILA |
| [04-human-in-the-loop-sugestoes-ia.md](./04-human-in-the-loop-sugestoes-ia.md) | P-REV-03 | RB-01, RN-014 |
| [05-conferencia-qe.md](./05-conferencia-qe.md) | P-QE-01 | RN-017–019 |
| [06-escalonamento-especialista.md](./06-escalonamento-especialista.md) | P-REV-04 | RN-016, RB-05 |

**Rastreabilidade:** `processes/process-map.md`, `business/business-requirements.md`.
