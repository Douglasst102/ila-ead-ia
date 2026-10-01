# Título: Isolamento de uploads e downloads autenticados

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

RFN-005 e stakeholder de segurança exigem storage segregado, URLs não adivinháveis, validação MIME/extensão Must, anti-malware Could, limites RFN-010 (default 50 MB). Materiais podem ser sensíveis (G-09/V-02). Downloads não podem ser links MinIO públicos.

## Decisão

- Validar extensão e MIME no BFF (allowlist: `application/pdf`, OOXML Word; configurável).
- Rejeitar conteúdo acima de `MAX_UPLOAD_MB` (413).
- Objeto identificado por UUID; path inclui `cursoId` ou `processoId`.
- Autorização RBAC **no GET de download**, não só no upload.
- Não gerar URLs pré-assinadas de longa duração na v1 (stream pelo BFF).
- Anti-malware: **não** na v1 (Could); registrar lacuna para COMGAP.
- Originais de processo imutáveis; overwrite proibido.

## Consequências

### Positivas

- Superfície de IDOR reduzida (UUID + auth + prefixo).
- Alinhado a HITL: versão final é novo objeto, não mutação silenciosa.

### Negativas

- Streaming pelo BFF aumenta I/O do ApiBff em downloads grandes (timeout proxy 120 s).
- Sem antivírus, risco residual de arquivo malicioso — aceite Could.

## Alternativas Consideradas

- URL pré-assinada MinIO curta: possível evolução se o proxy virar gargalo; v1 prefere controle RBAC central.
- Avscan obrigatório: sem ferramenta padronizada nas fontes — não inventar produto.
- Guardar na pasta compartilhada Windows: rejeitado (G-02 to-be).
