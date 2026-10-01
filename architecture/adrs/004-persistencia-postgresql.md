# Título: Persistência transacional em PostgreSQL

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

O domínio exige usuários/auth, cursos, processos com máquina de estados, sugestões HITL, matriz QE e trilha de auditoria (RF-070, RFN-003, RFN-007). Volumes de piloto cabem em SGBD relacional (RFN-010). Stacks atuais: Postgres, Redis, ElasticSearch, ChromaDB.

## Decisão

Usar **PostgreSQL** como sistema de registro:

- Tabela lógica `auth_users` dedicada (hash de senha, papéis).
- Entidades de negócio em schema próprio (detalhe no data-engineer).
- Eventos de auditoria na mesma instância, tabela append-only.
- Sem ElasticSearch/Chroma na v1.

ORM concreto (Prisma vs TypeORM) fica para o Technical Analyst.

## Consequências

### Positivas

- ACID nas decisões HITL e transições de estado (409 em conflito).
- Backup clássico alinhado a P-TI-02 / RFN-022.
- JSONB disponível para payload resumido de auditoria.

### Negativas

- Busca full-text em conteúdo de Word não é requisito Must; se surgir, ES ou FTS PG depois.
- Uma instância é SPOF no Compose — mitigação operacional COMGAP, não app.

## Alternativas Consideradas

- Somente MinIO + arquivos JSON: rejeitado — HITL e RBAC precisam de consultas relacionais.
- ElasticSearch como store primário: rejeitado — não substitui transações.
- Redis como banco: rejeitado — não é sistema de registro.
