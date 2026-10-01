# Título: Integração de IA via Facade, Ollama no piloto e gate G-09

**Status:** Aceita (abstração e flag); **Proposta** (provedor e política de produção)

**Data:** 2026-10-01

## Contexto

RF-090 exige abstração de provedor no backend; RF-040 gera sugestões **sem** auto-aplicação; RFN-008 impõe gate de produção até decisão institucional (on-prem / nuvem / anonimização). G-09 e V-02/V-03 permanecem abertos. Stack atual inclui **Ollama**. Frontend nunca chama IA.

Dados enviados ao provedor (quando habilitado): trechos de texto extraídos do material, critérios selecionados, metadados de processo (ids, não necessariamente título institucional completo). **Não** enviar senhas nem arquivos binários completos se o adapter puder operar sobre texto extraído. Persistência no provedor: proibida além do contrato DPA se cloud.

## Decisão

1. Interface `IaProvider` no módulo **IaFacade**; implementação v1 **Ollama** (URL/modelo via env).
2. Feature flag `AI_ENABLED` (default false em produção até G-09). Com flag off, RF-040 não executa; processo permanece utilizável para catálogo/MVP e critérios não-IA.
3. Chaves e endpoints **somente** no processo backend.
4. Timeout, retry limitado e circuit breaker na Facade (RF-091).
5. **Não** selecionar provedor cloud de produção neste ADR — status **Proposta** até workshop G-09.

## Consequências

### Positivas

- HITL e proxy cumpridos; troca de provedor sem mudar controllers.
- Piloto on-prem possível com Ollama se a decisão institucional for local.
- Material real não vaza para cloud por acidente de configuração (flag).

### Negativas

- Qualidade PT-BR do modelo Ollama é desconhecida (M-02 a calibrar).
- Produção com IA continua bloqueada até G-09 — lacuna registrada, não fechada.

## Alternativas Consideradas

- Frontend chama OpenAI/Ollama: rejeitado (RN-007, RF-090).
- Fixar provedor cloud agora: rejeitado — inventaria decisão G-09.
- IA síncrona na request HTTP: rejeitado (RFN-011, ADR-009).
