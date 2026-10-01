# Modelo de dados (ERD) — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**SGBD:** PostgreSQL 15+  
**DDL executável:** `data/migrations/001_initial_schema.sql` (espelho: `schema.sql`)  
**Rastreio:** RFN-003, RFN-005, RF-070, ADR-004, ADR-007, ADR-010  

---

## 1. Diagrama lógico

```mermaid
erDiagram
  auth_users ||--o{ materiais_apoio : "autor"
  auth_users ||--o{ processos_revisao : "responsavel"
  auth_users ||--o{ eventos_auditoria : "ator"
  auth_users ||--o{ sugestoes_ia : "decisor"
  auth_users ||--o{ token_denylist : "revoga"

  cursos ||--o{ materiais_apoio : "contem"
  cursos ||--o{ processos_revisao : "vincula"
  cursos {
    uuid id PK
    varchar titulo UK
    text descricao
    timestamptz created_at
    timestamptz updated_at
  }

  auth_users {
    uuid id PK
    varchar email UK
    varchar nome
    varchar password_hash
    varchar password_salt
    varchar hash_algorithm
    varchar[] roles
    boolean ativo
    timestamptz created_at
    timestamptz updated_at
  }

  materiais_apoio {
    uuid id PK
    uuid curso_id FK
    uuid autor_id FK
    varchar nome_original
    bigint tamanho_bytes
    varchar mime_type
    varchar storage_key UK
    timestamptz created_at
  }

  processos_revisao {
    uuid id PK
    uuid curso_id FK
    uuid responsavel_id FK
    uuid material_apoio_id FK
    varchar estado
    boolean ciente_limitacao_rb02
    timestamptz preparacao_confirmada_em
    timestamptz encerrado_em
    timestamptz created_at
    timestamptz updated_at
  }

  processos_revisao ||--o{ arquivos_processo : "possui"
  processos_revisao ||--o{ processo_criterios : "seleciona"
  processos_revisao ||--o{ sugestoes_ia : "gera"
  processos_revisao ||--o{ qe_itens : "matriz"
  processos_revisao ||--o{ jobs : "dispara"
  processos_revisao ||--o{ exportacoes : "exporta"
  processos_revisao ||--o{ eventos_auditoria : "rastreia"
  processos_revisao ||--o{ idempotency_keys : "dedupe"

  arquivos_processo {
    uuid id PK
    uuid processo_id FK
    varchar tipo
    varchar nome_original
    varchar mime_type
    bigint tamanho_bytes
    varchar storage_key UK
    timestamptz created_at
  }

  processo_criterios {
    uuid processo_id FK
    varchar criterio_codigo
  }

  sugestoes_ia {
    uuid id PK
    uuid processo_id FK
    varchar categoria
    varchar estado
    text trecho_referencia
    int trecho_offset
    int trecho_length
    text texto_sugerido
    text justificativa
    boolean validar_especialista
    text nota_encaminhamento
    uuid decidido_por_id FK
    timestamptz decidido_em
    timestamptz created_at
  }

  qe_itens {
    uuid id PK
    uuid processo_id FK
    varchar codigo_hierarquia
    text titulo_item
    varchar status_cobertura
    text localizacao_material
    text divergencias
    text observacoes
    int ordem
    timestamptz updated_at
  }

  jobs {
    uuid id PK
    uuid processo_id FK
    varchar tipo
    varchar estado
    varchar fila
    text error_code
    text error_message
    jsonb result_meta
    timestamptz started_at
    timestamptz finished_at
    timestamptz created_at
  }

  exportacoes {
    uuid id PK
    uuid processo_id FK
    uuid job_id FK
    varchar formato
    varchar storage_key
    bigint tamanho_bytes
    timestamptz created_at
  }

  eventos_auditoria {
    uuid id PK
    uuid processo_id FK
    uuid user_id FK
    varchar tipo
    jsonb payload
    timestamptz created_at
  }

  token_denylist {
    uuid id PK
    varchar token_fingerprint UK
    uuid user_id FK
    timestamptz expira_em
    timestamptz created_at
  }

  idempotency_keys {
    varchar key PK
    uuid user_id FK
    uuid processo_id FK
    timestamptz created_at
  }
```

---

## 2. Enumerações

### `processos_revisao.estado`

`rascunho`, `preparacao_concluida`, `revisao_ia`, `qe`, `relatorio`, `concluido`

### `arquivos_processo.tipo`

`qe`, `material`, `referencia`

### `sugestoes_ia.estado`

`pendente`, `aceita`, `rejeitada`

### `sugestoes_ia.categoria`

`melhoria`, `correcao_necessaria`, `ajuste_hierarquia`, `validar_especialista`

### `qe_itens.status_cobertura`

`contemplado`, `cobertura_parcial`, `nao_localizado`

### `processo_criterios.criterio_codigo`

`coerencia_coesao`, `linguagem_dialogica`, `ortografia_gramatica`, `consistencia_terminologica`, `subordinacao_hierarquica`, `conferencia_qe`, `revisao_tecnica_normativa`

### `jobs.tipo` / `jobs.estado`

Tipos: `revisao_ia`, `export_docx`, `export_pdf`  
Estados: `queued`, `running`, `succeeded`, `failed`

---

## 3. Regras de integridade

| Regra | Implementação |
|-------|----------------|
| Título curso único | `UNIQUE (titulo)` em `cursos` |
| Append-only auditoria | Sem UPDATE/DELETE na app; trigger opcional deny UPDATE |
| Originais imutáveis | Sem UPDATE em `storage_key` de arquivos_processo após insert |
| HITL export | Relatórios leem sugestões `aceita` apenas (aplicação) |
| FK processo → curso | ON DELETE RESTRICT |
| Papéis | Array PostgreSQL `varchar[]` ou tabela N:N Could — v1 array |

---

## 4. Índices (resumo)

Ver `schema.sql`. Principais:

- `processos_revisao (curso_id, estado, created_at DESC)`
- `eventos_auditoria (processo_id, created_at)`
- `sugestoes_ia (processo_id, estado)`
- `jobs (processo_id, created_at DESC)`
- `materiais_apoio (curso_id, created_at DESC)`

---

## 5. Autenticação e tokens

- **auth_users:** credenciais isoladas (RFN-003).
- **token_denylist (Should):** revogação logout; limpeza job por `expira_em`.
- **Refresh tokens:** não modelados v1.

---

## 6. Normalização

- Catálogo (`cursos`, `materiais_apoio`) separado de instâncias de fluxo (`processos_revisao`).
- Critérios N:N via `processo_criterios` (PK composta).
- Jobs e exportações desnormalizam `storage_key` para download rápido.

---

## Histórico

| Versão | Data |
|--------|------|
| 1.0 | 2026-10-01 |
