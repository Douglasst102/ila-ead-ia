# C4 — Nível 2: Contêineres (Alternativa A)

**Escopo:** único desenho de deploy da v1. O ApiBff **inclui** o consumidor de fila. Reverse proxy TLS é nota de produção, não contêiner obrigatório em dev.

## Diagrama

```mermaid
C4Container
  title SAD-ILA - Contêineres Alternativa A

  Person(revisor, "Usuario autenticado", "Revisor, admin cursos ou admin sistema")

  System_Boundary(sadila, "SAD-ILA") {
    Container(web, "WebApp", "Next.js React TypeScript", "UI responsiva; SSG login; SWR nas rotas autenticadas; token efemero")
    Container(api, "ApiBff", "NestJS TypeScript", "REST /api/v1, RBAC, facades, consumidor AMQP no mesmo processo")
    ContainerDb(pg, "PostgreSQL", "SGBD relacional", "auth_users, cursos, processos, sugestoes, QE, auditoria")
    ContainerDb(minio, "MinIO", "Object storage S3", "docx e PDF isolados por curso_id e processo_id")
    ContainerQueue(rmq, "RabbitMQ", "AMQP", "Filas revisao.ia e export.documento")
  }

  System_Ext(provedorIA, "Provedor de IA", "Ollama ou API configuravel")
  System_Ext(infraComgap, "Infra COMGAP", "Backup e hospedagem")

  Rel(revisor, web, "HTTPS", "Browser")
  Rel(web, api, "REST JSON", "Bearer JWT")
  Rel(api, pg, "SQL", "ORM")
  Rel(api, minio, "S3 API", "Credenciais de servidor")
  Rel(api, rmq, "Publica e consome", "AMQP")
  Rel(api, provedorIA, "Prompt e resposta", "HTTPS via IaFacade")
  Rel(infraComgap, pg, "Backup")
  Rel(infraComgap, minio, "Backup de volume")
```

## Fluxos fundamentais

1. **UI → API:** o WebApp não fala com MinIO, Postgres, RabbitMQ nem IA.
2. **Upload:** ApiBff valida MIME/tamanho, grava MinIO, metadados no PostgreSQL.
3. **Job IA:** ApiBff publica na fila; o **mesmo** processo consome, chama IaFacade, persiste sugestões.
4. **HITL:** decisões só no PostgreSQL; geração de docx final é outro job.

## Contêineres e requisitos

| Contêiner | RF / RFN principais |
|-----------|---------------------|
| WebApp | RF-080, RFN-050 |
| ApiBff | RF-001–091, RFN-001–006, 040–041 |
| PostgreSQL | RFN-003, RF-070 |
| MinIO | RFN-005, RF-020, RF-031 |
| RabbitMQ | RFN-011, RF-090 |
| Provedor IA | RF-040, RFN-008 |

## Nota de produção

HTTPS termina em reverse proxy ou load balancer COMGAP (não desenhado como contêiner v1 de desenvolvimento). Compose local pode expor `web:3000` e `api:3001` em HTTP documentado (RFN-002).
