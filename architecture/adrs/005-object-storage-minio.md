# Título: Object storage MinIO para materiais e artefactos

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

Uploads de PDF/Word (RF-020, RF-031–032), originais imutáveis (RN-024) e exportações docx/pdf (RF-061–062) exigem blobs. RFN-005 pede isolamento por `curso_id`/`processo_id` e URLs não adivinháveis. Stack atual: MinIO. RFN-020 pede volume nomeado no Compose.

## Decisão

Usar **MinIO** (API S3) como store de objetos:

- Prefixos `cursos/{cursoId}/materiais/{uuid}` e `processos/{processoId}/{tipo}/{uuid}`.
- Metadados no PostgreSQL; binário só no MinIO.
- Download **sempre** via BFF autenticado (sem bucket público).
- Originais de processo não são sobrescritos; novas gerações são novos objetos.

## Consequências

### Positivas

- Isolamento e UUID atendem RFN-005.
- Evolução para S3 institucional sem mudar o módulo Storage.
- Backup de volume separado do banco (RFN-022).

### Negativas

- Serviço adicional no Compose.
- Consistência PG ↔ objeto é responsabilidade do BFF (falha de upload = transação compensatória / não confirmar metadados).

## Alternativas Consideradas

- Filesystem no disco do ApiBff: rejeitado — pior isolamento, difícil scale-out do BFF.
- Armazenar blobs em BYTEA no Postgres: rejeitado — infla backup e p95 de DB.
