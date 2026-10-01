# BPMN — Subprocesso: decisão human-in-the-loop (sugestões IA)

**Processo:** P-REV-03  
**RN:** RN-013, RN-014, RN-015 | **RB:** RB-01  

```mermaid
flowchart TB
  subgraph LaneRev["Revisor"]
    start((Sugestão apresentada))
    ler[Ler trecho + categoria + justificativa]
    dec{Aceitar sugestão?}
    aceitar[Aceitar explicitamente]
    rejeitar[Rejeitar explicitamente]
    prox{Próxima sugestão?}
    done((Etapa textual concluída))
  end

  subgraph LaneSAD["SAD-ILA"]
    noAuto[Nenhuma alteração automática RN-013]
    queue[Fila de sugestões]
    applyAceite[Acumular alteração para versão final RB-01]
    skipRej[Descartar sugestão rejeitada]
    audit[Log: sugestão + decisão + usuário + data RN-024]
  end

  start --> noAuto --> queue --> ler --> dec
  dec -->|Sim| aceitar --> applyAceite --> audit
  dec -->|Não| rejeitar --> skipRej --> audit
  audit --> prox
  prox -->|Sim| queue
  prox -->|Não| done
```

**Regra:** Versão final `.docx` só reflete aceites (RN-021), nunca auto-aplicação da IA.
