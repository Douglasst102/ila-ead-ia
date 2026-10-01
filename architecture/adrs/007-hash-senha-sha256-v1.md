# Título: Hash de senha SHA256 na v1 com dívida para algoritmo adaptativo

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

`TODOs.md` exige armazenar **apenas hash SHA256** da senha em tabela exclusiva. RFN-003 confirma Must v1 alinhado ao TODO e **recomenda ADR** para migrar a bcrypt/Argon2 antes de produção institucional. SHA256 (mesmo com salt) não é adaptativo contra força bruta GPU.

## Decisão

- v1: hash **SHA256** com **salt por usuário** e **pepper** em variável de ambiente (`PASSWORD_PEPPER`).
- Nunca logar senha ou hash em claro além do necessário para comparação constante-time.
- **Dívida deliberada:** substituir por **Argon2id** (preferencial) ou bcrypt **antes** de produção institucional com usuários reais além do piloto controlado.
- Não expor o algoritmo no frontend.

Pagamento da dívida: novo ADR “Substituída” quando o hash adaptativo for implementado (rehash no próximo login).

## Consequências

### Positivas

- Cumpre a restrição escrita do repositório para o piloto.
- Salt+pepper reduz rainbow tables triviais.

### Negativas

- Resistência a brute-force inferior a Argon2/bcrypt — risco de segurança consciente (orientações §4.3).
- Migração exigirá dual-verify no login.

## Alternativas Consideradas

- Argon2id já na v1: tecnicamente superior; rejeitada **apenas** porque o TODO do repositório fixa SHA256 para esta versão — não por mérito de segurança.
- SHA256 sem salt: rejeitada mesmo no piloto.
- Texto puro: proibido (RFN-003).
