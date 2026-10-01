# Título: Backend NestJS como BFF com OpenAPI

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

O backend deve ser BFF: OpenAPI pública, CORS configurável, proxy de IA, Facade para composição DB + storage + IA (`TODOs.md`, RFN-006, RFN-040, RFN-041, RF-090). O projeto padronizou JavaScript/Node.js. Stacks atuais incluem NestJS, NodeJs, TypeScript e também Spring Boot.

## Decisão

Implementar o **ApiBff em NestJS (TypeScript)**:

- REST `/api/v1` documentada em OpenAPI 3 (Swagger `/api/docs`).
- Módulos = bounded contexts do SAD.
- Guards JWT + RBAC em rotas mutáveis e downloads.
- CORS via `CORS_ORIGINS`.
- Facade de IA e de composição no servidor; frontend não orquestra integrações.

## Consequências

### Positivas

- Um ecossistema TS com o frontend; módulos Nest mapeiam C4 Component.
- Swagger nativo atende G-14 / US-003.
- Injeção de dependência facilita adapters (MinIO, AMQP, Ollama).

### Negativas

- Event loop Node: I/O longo de IA **não** pode ser síncrono na request HTTP (ADR-009).
- Time Java/JHipster da casa não reaproveita código neste produto.

## Alternativas Consideradas

- Spring Boot: alinhado à stack Java da casa, mas contradiz o TODO Node.js e duplica runtime.
- Flask/Python: rejeitado pelo mesmo TODO.
- Nest como API “anêmica” e orquestração no frontend: viola RFN-041.
