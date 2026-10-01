# C4 — Nível 1: Contexto

**Sistema:** SAD-ILA  
**Objetivo:** situar usuários e sistemas externos. O frontend não aparece neste nível (está dentro do SAD-ILA).

## Diagrama

```mermaid
C4Context
  title SAD-ILA - Diagrama de contexto

  Person(revisor, "Revisor", "Conduz revisao HITL e conferencia QE")
  Person(adminCursos, "Admin de cursos", "Cadastra cursos e materiais de apoio")
  Person(adminSistema, "Admin de sistema", "Provisiona usuarios e opera o ambiente")
  Person(especialista, "Especialista de conteudo", "Valida flags tecnicas via revisor")

  System(sadila, "SAD-ILA", "Gestao de cursos, revisao assistida por IA, QE, relatorios e auditoria")

  System_Ext(provedorIA, "Provedor de IA", "Ollama on-prem ou endpoint configuravel; somente o backend acessa")
  System_Ext(infraComgap, "Infra COMGAP", "Hospedagem, backup e monitoramento institucionais")

  Rel(revisor, sadila, "Usa via HTTPS", "JWT")
  Rel(adminCursos, sadila, "Usa via HTTPS", "JWT")
  Rel(adminSistema, sadila, "Usa e opera via HTTPS", "JWT")
  Rel(especialista, sadila, "Nao acessa diretamente; parecer registrado pelo revisor")
  Rel(sadila, provedorIA, "Envia trechos e criterios; recebe sugestoes", "HTTPS REST")
  Rel(infraComgap, sadila, "Hospeda containers, backup de banco e volumes")
```

## Atores

| Ator | Relação com o SAD-ILA |
|------|------------------------|
| Revisor | Fluxo completo de revisão (P-REV, P-QE, P-ENC) |
| Admin de cursos | Catálogo e materiais (P-CUR, P-MAT) |
| Admin de sistema | Usuários e saúde do sistema (P-TI-01/02) |
| Especialista | Sem login dedicado v1; interação via flag RF-043 |
| Provedor de IA | Sistema externo; **gate G-09** para material real |
| Infra COMGAP | Operação; RPO/RTO não inventados (RFN-022) |

Alunos dos cursos **não** são usuários do sistema (visão do produto §1.4).
