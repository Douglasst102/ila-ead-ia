# Título: Autenticação local com JWT e RBAC (SSO fora da v1)

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

RN-008 e RFN-002 exigem HTTP/REST + JWT entre frontend e backend. RF-001–005 definem login e-mail/senha, papéis `revisor`, `admin_cursos`, `admin_sistema`. SSO COMAER é RF-W01 / V-04 / F4. Lacuna de IdP institucional não pode ser inventada.

## Decisão

- Cadastro **local** em `auth_users`; senha só como hash (ADR-007).
- Emissão de **JWT** com claims `sub`, `email`, `roles`, `iat`, `exp`; TTL configurável (default 8h).
- Frontend envia `Authorization: Bearer`.
- Logout: descarte no cliente; denylist server-side **Should** para `admin_sistema`.
- Refresh token **Could** v1.1.
- HTTPS em produção; HTTP só em dev documentado.
- SSO COMAER **não** na v1; o módulo Auth deve manter interface de “emissão de sessão” para um futuro adapter IdP.

## Consequências

### Positivas

- Desbloqueia MVP (G-03) sem dependência de IdP.
- RBAC no BFF é fonte de verdade (RFN-004).

### Negativas

- Usuários duplicados vs. diretório COMAER até F4.
- JWT no storage do browser: mitigar XSS na etapa de segurança.

## Alternativas Consideradas

- SSO COMAER na v1: rejeitado — decisão V-04 ausente; bloquearia o piloto.
- Sessão opaca só em cookie sem JWT: válido, mas viola a diretriz explícita JWT de `TODOs.md`/RN-008 salvo ADR divergente — não há motivo para divergir.
- Auth.js/NextAuth no frontend falando com IdP: rejeitado — BFF deve emitir o contrato de sessão.
