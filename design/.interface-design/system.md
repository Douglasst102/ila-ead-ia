# Sistema de interface — SAD-ILA (sessões futuras)

**Atualizado:** 2026-10-01

## Direção e sensação

Ferramenta institucional ILA/COMAER para revisão de material didático: **papel didático** (fundos warm paper) + **precisão aeronáutica** (ink, Plex). Human-in-the-loop visível; nunca “automação brilhante”.

## Profundidade

**Apenas bordas** — cards com `1px` `--line`, sem drop shadows em cards. Overlays/modais podem usar sombra leve.

## Spacing

Base **4px**. Padding simétrico em cards (**24px**). Gap entre cards **20px**.

## Tipografia

- Títulos: **Lora** 600
- UI: **IBM Plex Sans**
- Meta/código: **IBM Plex Mono**

## Padrões chave

1. **AppShell:** sidebar ink 230px, topbar panel, main paper.
2. **Nav ativo:** borda esquerda dourada + fundo branco 9% opacity.
3. **StepperRevisao:** Preparação → Revisão IA → QE → Relatório; etapas bloqueadas conforme estado.
4. **Split HITL:** doc-pane + suggest-pane; highlight trecho ativo.
5. **Dropzone:** dashed paper-2 → filled green-bg.
6. **QE stats:** blocos ok/warn/bad com número serif grande.
7. **Botões decisão:** accept/reject pastel (protótipo), primary ink.

## Tokens nomeados (preferir)

`--ink`, `--paper`, `--line`, `--gold`, `--panel`, `--steel` — mapear para primitivos em `design-system.md`.

## Evitar

Inter/Roboto default, gray-50 canvas, cards com sombra forte, KPI grid genérico, stepper Material puro, selects nativos estilizados.
