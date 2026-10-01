# Diagramas C4 — SAD-ILA

**Arquitetura:** Alternativa A (monólito modular + BFF)  
**Notação:** Modelo C4 (Contexto, Contêineres, Componentes) em Mermaid  
**Guia:** `.cursor/skills/architecture-design/references/c4-model-guide.md`  
**Nível Código:** omitido (gerado na implementação)

| Nível | Arquivo |
|-------|---------|
| Contexto | [01-context.md](01-context.md) |
| Contêineres | [02-containers.md](02-containers.md) |
| Componentes (ApiBff) | [03-components-bff.md](03-components-bff.md) |

**Legenda rápida**

- **Pessoa:** usuário da Seção MD / TI
- **Sistema:** SAD-ILA (fronteira)
- **Sistema externo:** Provedor IA, Infra COMGAP
- **Contêiner:** processo/deploy (WebApp, ApiBff, PostgreSQL, MinIO, RabbitMQ)
- **Componente:** módulo NestJS dentro do ApiBff

Não há diagrama de deploy da Alternativa B (worker separado) — rejeitada na v1 (SAD §12).
