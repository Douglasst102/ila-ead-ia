# Matriz de Stakeholders — SAD-ILA

**Produto:** SAD-ILA  
**Data:** 2026-10-01  
**Versão:** 1.0  

---

## 1. Resumo

Stakeholders do SAD-ILA concentram-se no **ILA/COMGAP** (uso e gestão do material didático), **TI e segurança** (sustentação e conformidade COMAER) e **fornecedores de capacidade de IA** (secundário, alta dependência técnica). Alunos e organizações consumidoras de cursos são impactados indiretamente pela qualidade do material.

---

## 2. Matriz principal

| Stakeholder | Tipo | Interesse | Influência | Atitude esperada | Prioridade | Estratégia de engajamento |
|-------------|------|-----------|------------|------------------|------------|---------------------------|
| **Seção de Material Didático (ILA)** | Primário | Ferramenta eficiente para revisão e gestão de cursos/materiais | Alta | Apoio / co-criação | **Alta** | Workshops de requisitos, piloto com revisores reais, validação de critérios IA |
| **Revisores / elaboradores de material** | Primário | Interface clara, sugestões úteis, controle sobre aceite/rejeição | Média | Usuários finais críticos | **Alta** | Testes de usabilidade, feedback sobre categorias de sugestão e relatórios |
| **Especialistas de conteúdo / coordenadores de curso** | Primário | Aderência ao QE, identificação de lacunas e hierarquia | Média | Validadores técnicos | **Alta** | Definir regras de escalonamento quando IA sinaliza “validar com especialista” |
| **Direção / gestão do ILA** | Primário | ROI em produtividade, alinhamento à visão institucional, excelência | Alta | Patrocínio | **Alta** | Métricas M-01 a M-06, relatórios de piloto |
| **COMGAP — área de TI / infraestrutura** | Primário | Segurança, operação em containers, integração futura | Alta | Gatekeeper técnico | **Alta** | Revisão de arquitetura, dados sensíveis, JWT, secrets via `.env` |
| **COMGAP — segurança da informação / compliance** | Primário | Proteção de material potencialmente sensível, auditoria | Alta | Aprovação | **Alta** | Threat modeling, classificação de dados, logs e retenção |
| **Comando da Aeronáutica (COMAER)** | Secundário | Capacitação logística eficiente | Média | Beneficiário estratégico | Média | Comunicação via ILA; sem operação direta do sistema |
| **Organizações logísticas assessoradas pelo ILA** | Secundário | Cursos e materiais atualizados | Baixa | Indireto | Baixa | Sem engajamento direto na fase 1 |
| **Alunos dos cursos (EAD/presencial/híbrido)** | Secundário | Material didático de qualidade | Baixa | Beneficiários finais | Média | Pesquisa de satisfação com material (indireto) |
| **Provedor de modelo / serviço de IA** | Secundário | Uso contratual da API, SLAs, custos | Média | Fornecedor | Média | Contrato, DPA, limites de envio de documentos |
| **Equipe de desenvolvimento / sustentação do SAD-ILA** | Secundário | Escopo claro, requisitos estáveis | Média | Entrega | Média | Backlog priorizado, ADRs, documentação |
| **Auditores / controle interno (se aplicável)** | Secundário | Rastreabilidade de alterações em material oficial | Média | Fiscalização | Média | Histórico imutável, trilhas de auditoria |

---

## 3. Mapa poder × interesse (textual)

```
        Alto interesse
              │
   Gerenciar   │   Manter satisfeitos
   de perto     │   (Direção ILA, Seção MD,
   (Revisores,  │    TI/COMGAP, Segurança)
   Especialistas│
              │
──────────────┼──────────────  Alta influência
              │
   Monitorar   │   Manter informados
   (Alunos,    │   (COMAER estratégico,
   Orgs log.)  │    Provedor IA)
              │
        Baixo interesse
```

---

## 4. Necessidades e expectativas por grupo

### 4.1 Seção de Material Didático

- Cadastro e organização de cursos e materiais de apoio.
- Um único lugar para iniciar e acompanhar revisões.
- Relatórios exportáveis para arquivo e prestação de contas interna.

### 4.2 Revisores

- Nenhuma alteração automática no Word sem sua ação.
- Navegação eficiente entre sugestões (melhoria, correção, hierarquia).
- Transição natural da revisão textual para conferência QE.

### 4.3 Especialistas de conteúdo

- Destaque de itens QE não localizados ou parcialmente cobertos.
- Sinalização clara de divergência de **nível hierárquico** (primário/secundário/terciário).
- Recomendações explícitas para validação humana quando a IA não tem base suficiente.

### 4.4 TI e segurança (COMGAP)

- Autenticação robusta (JWT entre frontend e backend; credenciais não hardcoded — ver `TODOs.md`).
- Armazenamento seguro de uploads e segregação por curso/usuário.
- Documentação OpenAPI, CORS, operação em Docker Desktop / containers.
- Definição de onde roda o modelo de IA e se dados saem da rede institucional.

### 4.5 Gestão ILA

- Indicadores de produtividade e qualidade.
- Alinhamento aos valores: rigor científico, excelência, responsabilidade social.

---

## 5. Riscos de stakeholder

| Risco | Stakeholders | Mitigação |
|-------|--------------|-----------|
| Rejeição por desconfiança na IA | Revisores, Especialistas | Human-in-the-loop, explicações por sugestão, piloto controlado |
| Bloqueio por segurança | TI, Segurança | Envolver cedo; opção IA on-premise; classificação de dados |
| Escopo inflado na fase 1 | Direção, Desenvolvimento | Fases MVP → 3 conforme `product-vision.md` |
| Dependência de fornecedor IA | TI, Gestão | Abstração de provedor no backend; critérios de substituibilidade |

---

## 6. Lacunas

- Nomes formais dos cargos e unidades (além de “Seção de Material Didático”) não constam nas fontes.
- Existência de comitê de aprovação de material ou workflow de homologação superior ao revisor não documentada.
- Contato oficial do product owner / patrocinador do projeto 26SISIAR05LOG não informado.
