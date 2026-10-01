# Título: Trilha de auditoria append-only no PostgreSQL

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

RN-024/025, RF-070–071 e RFN-007 exigem histórico de login, criação de processo, decisões de sugestão, exportação e falha de IA. Payload **sem** conteúdo integral do Word. Correções via evento compensatório, não UPDATE/DELETE silencioso. M-04 meta 100% dos processos concluídos com histórico.

## Decisão

- Tabela de eventos de negócio (nome físico na etapa de dados) com insert-only: `timestamp` UTC, `user_id`, `processo_id` (nullable para login), `tipo`, `payload` resumido, `correlation_id`.
- API `GET /processos/{id}/eventos` somente leitura.
- Aplicação **não** expõe endpoint de exclusão de eventos; retenção/purge é job operacional parametrizado (`RETENTION_DAYS`, RFN-012) após validação Jurídico/Segurança — procedimento, não feature de revisor.
- Originais MinIO referenciados por hash/chave no payload, não duplicados no log.

## Consequências

### Positivas

- Rastreabilidade M-04 e P-GOV-01.
- Simplicidade: um store transacional, sem barramento de eventos global.

### Negativas

- Volume de eventos cresce com cada HITL; índices e retenção necessários.
- Não é ledger criptográfico — integridade é de aplicação + backup COMGAP.

## Alternativas Consideradas

- Event store dedicado (EventStoreDB etc.): fora da stack; overkill para piloto.
- Só logs de aplicação (stdout): rejeitado — não consultáveis por curso (RF-071).
- UPDATE in-place do “estado histórico”: rejeitado (RFN-007).
