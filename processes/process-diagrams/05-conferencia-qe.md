# BPMN — Conferência do Quadro Estrutural (QE)

**Processo:** P-QE-01  
**RN:** RN-017, RN-018, RN-019 | **Entrada:** pós P-REV-03 (RN-023)  

```mermaid
flowchart TB
  subgraph LaneRev["Revisor"]
    start((Entrada conferência QE))
    verMatriz[Visualizar tabela QE ↔ material]
    selLinha[Selecionar item da matriz]
    analisar[Analisar localização níveis e situação]
    sit{Situacao do item}
    okItem[Item contemplado — confirmar]
    parcial[Item parcial — registrar observação]
    naoLoc[Item não localizado]
    hier{Divergência hierárquica?}
    acaoHier[Registrar ação / referência à revisão IA]
    mais{Mais itens?}
    conf[Confirmar conferência QE]
    fim((Avançar para relatório))
  end

  subgraph LaneSAD["SAD-ILA"]
    calc[Comparar QE x material RN-017]
    niveis[Exibir nível QE vs material RN-018]
    det[Painel detalhamento RN-019]
    flagEsp[Recomendar validação especialista RN-016]
    stats[Agregar contagens para RN-020]
  end

  start --> calc --> verMatriz --> selLinha --> analisar --> sit
  sit -->|Contemplado| okItem --> niveis
  sit -->|Parcial| parcial --> det
  sit -->|Não localizado| naoLoc --> flagEsp --> det
  okItem --> hier
  parcial --> hier
  det --> hier
  hier -->|Sim| acaoHier --> mais
  hier -->|Não| mais
  mais -->|Sim| selLinha
  mais -->|Não| conf --> stats --> fim
```

**Status possíveis (RN-017):** contemplado, cobertura parcial, não localizado.
