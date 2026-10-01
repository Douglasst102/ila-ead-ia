# BPMN — Revisão manual As-Is (macro)

**Status:** **Inferido** a partir de `product-vision.md`, `gap-analysis.md` — **validar com Seção MD (ILA)**.  
**Não representa BPM formal documentado** (lacuna G-11).

```mermaid
flowchart TB
  subgraph LaneMD["Seção MD / Revisor"]
    start((Demanda de revisão))
    locCurso[Localizar pasta/planilha do curso]
    obterArq[Obter QE e material Word]
    revManual[Revisão textual manual no Word]
    confManual[Conferência QE leitura cruzada]
    normManual[Consultar normas/manuais separados]
    ajustes[Aplicar correções no documento]
    parecerEsp{Incerteza técnica?}
    contatoEsp[Contatar especialista e-mail/reunião]
    aguardar[Aguardar parecer]
    versaoFinal[Gerar versão final]
    entrega[Enviar por e-mail / pasta compartilhada]
    histFrag[Histórico em comentários Word / e-mail]
    fim((Concluído))
  end

  start --> locCurso --> obterArq --> revManual --> confManual --> normManual --> ajustes
  ajustes --> parecerEsp
  parecerEsp -->|Sim| contatoEsp --> aguardar --> ajustes
  parecerEsp -->|Não| versaoFinal --> entrega --> histFrag --> fim
```

**Gargalos associados:** GAP-P01, GAP-P02, GAP-P05 (`improvement-opportunities.md`).
