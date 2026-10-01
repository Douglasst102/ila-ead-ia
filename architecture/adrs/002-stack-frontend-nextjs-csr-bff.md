# Título: Frontend Next.js com BFF e renderização por rota

**Status:** Aceita

**Data:** 2026-10-01

## Contexto

`TODOs.md` exige páginas explícitas e estratégia **SSG/SSR/ISR/SWR** por rota. RFN-050 lista rotas autenticadas. O frontend não persiste documentos e só consome o BFF. A aplicação é intranet institucional (SEO público irrelevante). Stacks atuais incluem Next.js e React.

## Decisão

Usar **Next.js (App Router) + React + TypeScript** como WebApp. Comunicação exclusiva via REST JWT com o NestJS. Persistência no cliente: token efêmero e estado de UI — sem IndexedDB de arquivos.

Estratégia por rota:

| Rota | Estratégia | Justificativa |
|------|------------|---------------|
| `/login` | SSG + hidratação | Estática; sem dados autenticados |
| `/cursos` | Client + SWR | Lista autenticada, fresca |
| `/cursos/[id]` | Client + SWR | Hub dinâmico |
| `/revisao/novo` | Client | Formulário de entrada |
| `/revisao/[processoId]/preparacao` | Client (SPA shell) | Wizard com estado rico |
| `/revisao/[processoId]/sugestoes` | Client | HITL + polling de job |
| `/revisao/[processoId]/qe` | Client | Matriz interativa |
| `/revisao/[processoId]/relatorio` | Client + SWR | Agregados |
| `/historico` | Client + SWR | Listagem paginada |
| `/admin/usuarios` | Client + SWR | CRUD TI |

SSR das rotas autenticadas não é obrigatório na v1 (não há SEO nem personalização HTML na borda). ISR não se aplica a dados de sessão.

## Consequências

### Positivas

- Cumpre RFN-050 e o TODO de frontend.
- Next.js permanece na stack da casa; SSG cobre o login.
- UI de revisão permanece reativa sem hidratar documentos no servidor.

### Negativas

- Contêiner Node extra para o frontend (vs. estáticos puros).
- Token no cliente exige HTTPS em produção e cuidados XSS (CSP na etapa segurança).

## Alternativas Consideradas

- React SPA (Vite) sem Next: rejeitada porque perde SSG nativo do `/login` e o App Router já previsto na stack.
- SSR em todas as rotas autenticadas: rejeitada — custo sem ganho de SEO; JWT em cookie/httpOnly poderia ser evolução, não requisito v1.
- Angular: stack atual, mas desalinhado ao TODO Node.js unificado com NestJS.
