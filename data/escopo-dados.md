# Escopo de dados — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Rastreio:** ADR-004, ADR-005, ADR-009, ADR-010, RFN-010  

---

## 1. Visão por camada

| Necessidade de negócio / domínio | Store ou camada | Responsabilidade do dado |
|----------------------------------|-----------------|---------------------------|
| Identidade, RBAC, revogação de JWT (logout) | **PostgreSQL** (`auth_users`, `token_denylist`) | Credenciais (hash), papéis, denylist com TTL |
| Catálogo institucional de cursos | **PostgreSQL** (`cursos`) | Título único, descrição, metadados |
| Materiais de apoio por curso | **PostgreSQL** (`materiais_apoio`) + **MinIO** (blob) | Metadados + `storage_key`; binário fora do SGBD |
| Instância de revisão (máquina de estados) | **PostgreSQL** (`processos_revisao`, `processo_criterios`, `arquivos_processo`) | Estado, critérios, vínculo curso/responsável |
| Arquivos Word do processo (QE, material, referência) | **PostgreSQL** + **MinIO** | Um QE e um material por processo (índices parciais UK) |
| Sugestões de IA e decisão HITL | **PostgreSQL** (`sugestoes_ia`) | Pendente/aceita/rejeitada; trilha de decisor |
| Matriz QE × material | **PostgreSQL** (`qe_itens`) | Cobertura, localização, divergências |
| Processamento assíncrono (IA, export) | **RabbitMQ** (fila) + **PostgreSQL** (`jobs`) | Orquestração; estado e erros persistidos |
| Relatórios exportados (docx/pdf) | **PostgreSQL** (`exportacoes`) + **MinIO** | Referência ao objeto gerado |
| Trilha de auditoria / histórico | **PostgreSQL** (`eventos_auditoria`) | Append-only; payload JSONB |
| Idempotência criação de processo | **PostgreSQL** (`idempotency_keys`) | Dedupe por usuário + chave HTTP |
| Texto enviado ao provedor de IA | **Adapter / memória** (v1) | Trechos extraídos; sem persistência no provedor (ADR-008) |
| Busca full-text em conteúdo Word | *Não modelado v1* | Lacuna: FTS PG ou ElasticSearch em fase futura (ADR-004) |
| Refresh tokens / SSO COMAER | *Não modelado v1* | JWT stateless + denylist Should; SSO F4 (RF-001 premissa) |

---

## 2. Fora do schema relacional

| Artefato | Onde vive | Notas |
|----------|-----------|--------|
| Segredo de assinatura JWT | Variável de ambiente / secrets | RFN-002; não persiste em tabela |
| Pepper de hash de senha | Ambiente | ADR-007; aplicado na camada Auth |
| Objetos `.docx` / `.pdf` | MinIO (`storage_key`) | Prefixos `cursos/{cursoId}/`, `processos/{processoId}/` (ADR-011) |
| Mensagens de job | RabbitMQ (`revisao.ia`, `export.documento`) | Corpo leve; estado canônico em `jobs` |

---

## 3. Retenção e backup (operacional)

| Dado | Política v1 (documentada) | Implementação |
|------|---------------------------|---------------|
| Eventos de auditoria | Retenção alinhada a RFN-007 / backup COMGAP | Sem purge automático no schema; job de limpeza `token_denylist` por `expira_em` (Should) |
| Jobs concluídos | Could — arquivar após N dias | Não implementado no DDL; decisão operacional futura |
| Idempotency keys | TTL curto (aplicação) | Índice em `created_at` para purge |

---

## 4. Lacunas registradas

1. **ORM:** **Prisma** (US-002) em `apps/api/prisma/`; DDL em `data/migrations/` permanece contrato físico aplicado no entrypoint (`apply-data-migrations.mjs`) com tracking em `schema_migrations` até migrações Prisma completas.
2. **Schema PostgreSQL dedicado:** ADR-004 menciona “schema próprio”; v1 usa `public` — evolução Could (`sadila` namespace).
3. **Refresh token persistido:** não modelado; v1 JWT + denylist.
4. **ElasticSearch / ChromaDB:** presentes na stack genérica do ADR-004 como alternativas rejeitadas para v1.

---

## Histórico

| Versão | Data |
|--------|------|
| 1.0 | 2026-10-01 |
