# Título: Processamento assíncrono de IA e export via RabbitMQ no mesmo deploy

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

RFN-011 pede job + polling ou SSE para documentos longos, timeout default 180 s. RF-091 exige estado recuperável. Stack atual: RabbitMQ. Alternativa B (worker separado) foi rejeitada na v1 (ADR-001). NestJS + BullMQ usaria Redis (também na stack), mas a casa lista RabbitMQ como messaging.

## Decisão

- **RabbitMQ** com filas duráveis `revisao.ia` e `export.documento`.
- Publisher e **consumer no mesmo processo** NestJS (módulo Jobs); prefetch baixo (1–2).
- API responde **202** + `jobId`; WebApp faz **polling** `GET /api/v1/jobs/{id}` (SSE = Could posterior).
- Retry com backoff limitado; falhas viram estado `failed` + evento de auditoria + botão retry.
- Não bloquear a thread HTTP aguardando o provedor.

## Consequências

### Positivas

- Atende RFN-011 sem segundo contêiner.
- Filas AMQP alinhadas à stack da casa.
- Extração do consumer para worker (Alt. B) reusa as mesmas filas.

### Negativas

- Pico de CPU de parsing/IA compete com API no mesmo replica.
- Polling gera tráfego extra (aceitável no piloto).

## Alternativas Consideradas

- Worker em contêiner separado: adiadas (ADR-001).
- Redis + BullMQ: rejeitada na v1 para não introduzir Redis só para fila; revisitar se o time preferir idioma Node nativo **e** já houver Redis para cache.
- Processamento 100% síncrono: rejeitado — timeout 180 s estoura UX e proxy.
- SSE/WebSocket como único canal: Could; polling é mais simples de operar e testar.
