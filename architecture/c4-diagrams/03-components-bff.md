# C4 — Nível 3: Componentes do ApiBff

**Contêiner:** ApiBff (NestJS)  
**Estilo interno:** módulos de domínio + adapters. Sem diagrama de classes (nível Código omitido).

## Diagrama

```mermaid
C4Component
  title ApiBff - Componentes internos

  Container_Ext(web, "WebApp", "Next.js")
  ContainerDb_Ext(pg, "PostgreSQL", "SGBD")
  ContainerDb_Ext(minio, "MinIO", "S3")
  ContainerQueue_Ext(rmq, "RabbitMQ", "AMQP")
  System_Ext(provedorIA, "Provedor de IA", "Ollama ou cloud")

  Container_Boundary(api, "ApiBff") {
    Component(http, "HttpApi", "Nest controllers /api/v1", "JWT guard, CORS, OpenAPI, health")
    Component(auth, "Auth", "Modulo", "Login, JWT, denylist, auth_users")
    Component(users, "Users", "Modulo", "Provisionamento admin_sistema")
    Component(cursos, "Cursos", "Modulo", "Catalogo e hub")
    Component(materiais, "Materiais", "Modulo", "Metadados de apoio")
    Component(processo, "ProcessoRevisao", "Modulo", "Maquina de estados e wizard")
    Component(ia, "IaFacade", "Modulo", "Adapter, timeout, circuit breaker")
    Component(jobs, "Jobs", "Modulo", "Publish/consume AMQP no mesmo processo")
    Component(qe, "QeConferencia", "Modulo", "Matriz e itens QE")
    Component(rel, "Relatorios", "Modulo", "Agregados e export")
    Component(store, "Storage", "Modulo", "Cliente MinIO e validacao MIME")
    Component(aud, "Auditoria", "Modulo", "Eventos append-only")
  }

  Rel(web, http, "REST JWT")
  Rel(http, auth, "Usa")
  Rel(http, users, "Usa")
  Rel(http, cursos, "Usa")
  Rel(http, materiais, "Usa")
  Rel(http, processo, "Usa")
  Rel(http, qe, "Usa")
  Rel(http, rel, "Usa")
  Rel(http, jobs, "Consulta status")
  Rel(auth, pg, "Le e grava")
  Rel(users, pg, "Le e grava")
  Rel(cursos, pg, "Le e grava")
  Rel(materiais, pg, "Metadados")
  Rel(materiais, store, "Upload/download")
  Rel(processo, pg, "Estado")
  Rel(processo, store, "Arquivos do processo")
  Rel(processo, jobs, "Enfileira IA")
  Rel(processo, aud, "Eventos")
  Rel(jobs, rmq, "AMQP")
  Rel(jobs, ia, "Executa analise")
  Rel(jobs, rel, "Export pesado")
  Rel(ia, provedorIA, "HTTPS")
  Rel(qe, pg, "Itens")
  Rel(rel, store, "Arquivos gerados")
  Rel(store, minio, "S3")
  Rel(aud, pg, "Insert-only")
```

## Regras de dependência

- **HttpApi** não contém regra de negócio além de validação de DTO e guards.
- **ProcessoRevisao** não chama o provedor de IA diretamente — apenas **Jobs** + **IaFacade**.
- **IaFacade** é o único componente que conhece URL/chave do provedor (env).
- **Auditoria** não atualiza linhas históricas.
- **Storage** não interpreta critérios de revisão.

## Mapeamento para User Stories (resumo)

| Módulo | US |
|--------|-----|
| HttpApi, health | US-002, US-003, US-007 |
| Auth, Users | US-001, US-004–006 |
| Cursos, Materiais | US-008–012 |
| ProcessoRevisao | US-013, US-020–024, US-028 |
| IaFacade, Jobs | US-025, US-026 |
| HITL via Processo + HTTP | US-027, US-029 |
| QeConferencia | US-030–032 |
| Relatorios | US-034–036 |
| Auditoria | US-037, US-038 |
