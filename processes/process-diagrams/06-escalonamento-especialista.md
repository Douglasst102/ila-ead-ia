# BPMN — Escalonamento para especialista de conteúdo

**Processo:** P-REV-04  
**RN:** RN-016 | **RB:** RB-05  

```mermaid
flowchart TB
  subgraph LaneSAD["SAD-ILA / IA"]
    start((Gatilho))
    detect[IA detecta lacuna ou incerteza técnica]
    rec[Recomendar validação pelo especialista RN-016]
    flag[Marcar sugestão ou item QE]
  end

  subgraph LaneRev["Revisor"]
    notif[Visualizar recomendação]
    encaminhar[Encaminhar ao especialista]
    aguardar[Aguardar validação humana]
    regResult[Registrar resultado no processo]
    decCont{Conteúdo controverso?}
    aplicar[Aplicar ajustes conforme parecer]
    manter[Manter decisão revisor com registro RB-05]
  end

  subgraph LaneEsp["Especialista / Coordenador de curso"]
    analise[Analisar aderência técnica QE]
    parecer[Emitir parecer]
  end

  start --> detect --> rec --> flag --> notif --> encaminhar --> analise --> parecer --> aguardar
  aguardar --> regResult --> decCont
  decCont -->|Parecer vinculante técnico| aplicar --> fim((Retomar fluxo revisão/QE))
  decCont -->|Revisor mantém com registro| manter --> fim
```

**Notas:**

- IA **não substitui** o especialista (RN-016, RB-05).
- Canal de encaminhamento as-is: e-mail/reunião (**inferido**); To-Be deve registrar trilha (**detalhe funcional — Requirements Engineer**).
- Exemplos no protótipo: item QE “Penalidades contratuais — não localizado”; “Gestão de riscos — complementar com especialista”.
