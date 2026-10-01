# Título: Monólito modular com BFF único (Alternativa A)

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

O SAD-ILA começa do zero (gap G-01), com um time Scrum, domínio ainda aberto (G-09, SSO, sigilo) e carga de piloto da ordem de dezenas de usuários e centenas de cursos (RFN-010). As orientações da casa (§2.1) recomendam **Modular Monolith** como ponto de partida. Requisitos exigem BFF/Facade (RFN-041), fila para IA (RFN-011) e Docker Compose (RFN-020).

Alternativas de deploy: (A) um processo API com módulos e consumidor AMQP interno; (B) API + worker separado; (C) microsserviços por bounded context.

## Decisão

Adotar a **Alternativa A**: um contêiner **ApiBff** NestJS modular (Auth, Cursos, Materiais, ProcessoRevisao, IaFacade, Jobs, QeConferencia, Relatorios, Storage, Auditoria), frontend separado, PostgreSQL, MinIO e RabbitMQ.

O consumidor de filas reside **no mesmo codebase e no mesmo deploy** na v1.

## Consequências

### Positivas

- Menor carga operacional no Docker Desktop e na TI COMGAP do piloto.
- Fronteiras de módulo permitem extração futura de worker (B) sem reescrever domínio.
- Alinha valor de negócio (time-to-market MVP E1–E2) às orientações §1.1 e §2.1.

### Negativas

- Jobs longos de IA compartilham o processo HTTP; mitigado por prefetch baixo e timeouts (ADR-009).
- Scale independente de IA exige mudança posterior para B.

## Alternativas Consideradas

- Alternativa B (Core + AI Worker): rejeitada na v1 por ops extra sem evidência de contenção; **evolução** se o piloto medir degradação de p95.
- Alternativa C (microsserviços): rejeitada no piloto — complexidade distribuída sem múltiplos times (Conway) e com domínio incompleto.
