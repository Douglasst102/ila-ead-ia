# Contratos API — SAD-ILA

**Fonte da verdade:** `openapi.yaml` (OpenAPI 3.0.3)

## Publicação

| Ambiente | Artefato |
|----------|----------|
| Repositório | `technical/api-contracts/openapi.yaml` |
| Runtime NestJS | Swagger UI em `/api/docs` |
| JSON gerado | `/api/docs-json` |

Implementação deve manter paridade com este arquivo (RFN-040). CI Could validar diff contrato vs decorators.

## Escopo

- Todos os endpoints de `architecture/api-specification.md` expandidos com schemas, segurança Bearer JWT, multipart, Idempotency-Key, jobs 202 e códigos de erro por operação.
- Health `/health` e `/ready` documentados fora do prefixo `/api/v1` (implementação Nest na raiz).

## Split futuro

Se o contrato crescer além de ~3000 linhas, dividir por tags (`auth.yaml`, `processos.yaml`, …) e usar `$ref` com este README como índice.
