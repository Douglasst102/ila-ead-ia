# BPMN — Revisão ponta a ponta (To-Be — Fase 3)

**Processos:** P-REV-01 → P-REV-04 → P-QE-01 → P-ENC-01 → P-GOV-01  
**RN:** RN-009–RN-025 | **RB:** RB-01–RB-05 | **Ordem:** RN-023  

```mermaid
flowchart TB
  subgraph LaneRev["Revisor"]
    s((Iniciar Revisão))
    selCurso[Selecionar curso]
    upQE[Upload QE Word]
    upMat[Upload material Word]
    upRef[Upload referências técnicas opcional]
    selCrit[Selecionar critérios de revisão]
    confPrep[Confirmar preparação]
    avalSugg[Avaliar cada sugestão IA]
    decSugg{Aceitar ou rejeitar?}
    maisSugg{Mais sugestões?}
    confTxt[Concluir revisão textual]
    confQE[Revisar matriz QE ↔ material]
    detItem[Detalhar itens QE]
    confEnc[Confirmar encerramento]
    export[Baixar docx / PDFs / relatório]
    fim((Processo concluído))
  end

  subgraph LaneSAD["SAD-ILA"]
    warnRef{Ausência de refs.?}
    msgRB02[Informar limitação revisão técnica RB-02]
    procIA[Processar critérios via backend IA]
    showSugg[Apresentar sugestões categorizadas RN-013]
    logDec[Registrar decisão RN-024]
    buildVer[Gerar versão pós-aceites RB-01]
    matrizQE[Calcular matriz QE RN-017-018]
    relFinal[Consolidar relatório RN-020]
    hist[Persistir histórico RN-024]
  end

  subgraph LaneIA["Serviço de IA"]
    genSugg[Gerar sugestões sem alterar doc]
  end

  s --> selCurso --> upQE --> upMat --> upRef --> selCrit --> confPrep
  confPrep --> warnRef
  warnRef -->|Sim| msgRB02 --> procIA
  warnRef -->|Não| procIA
  procIA --> genSugg --> showSugg --> avalSugg --> decSugg
  decSugg --> logDec --> maisSugg
  maisSugg -->|Sim| avalSugg
  maisSugg -->|Não| confTxt --> buildVer --> matrizQE --> confQE --> detItem --> confEnc
  confEnc --> relFinal --> export --> hist --> fim
```

**Subprocessos detalhados:** `04-human-in-the-loop-sugestoes-ia.md`, `05-conferencia-qe.md`, `06-escalonamento-especialista.md`.

**RB-03:** Critérios não selecionados não entram no relatório como concluídos.
