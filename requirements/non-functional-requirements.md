# Requisitos Não Funcionais — SAD-ILA

**Produto:** SAD-ILA  
**Versão:** 1.0  
**Data:** 2026-10-01  
**Fontes:** RN-007/008, `TODOs.md`, `business/gap-analysis.md` (G-09), `processes/critical-processes-matrix.md`

---

## 1. Convenções

| Campo | Descrição |
|-------|-----------|
| **ID** | `RFN-xxx` |
| **Prioridade** | Must / Should / Could |
| **Categoria** | Segurança, Performance, Disponibilidade, Usabilidade, Manutenibilidade, Compliance, Operacional |

**Nota de segurança (TODOs vs. boas práticas):** `TODOs.md` exige hash **SHA256** de senha. Para RFN-003, a implementação v1 deve seguir o TODO do repositório; **recomenda-se ADR** para migrar a algoritmo adaptativo (bcrypt/Argon2) antes de produção institucional — registrado como dívida em RFN-003.

---

## 2. Segurança

### RFN-001 — Gestão de segredos e configuração

| Prioridade | Must |
|------------|------|
| **Rastreio** | RN-007 |

- Proibido credenciais, URLs sensíveis, chaves de IA ou endpoints privados **hardcoded** no código.
- Configuração via `.env` (local) e variáveis de ambiente nos containers em runtime.
- `.env` e equivalentes listados no `.gitignore`; documentar variáveis obrigatórias em README técnico (DevOps).
- Segredos de IA acessíveis **somente** ao processo backend.

---

### RFN-002 — Autenticação HTTP/JWT

| Prioridade | Must |
|------------|------|
| **Rastreio** | RN-008 |

- Comunicação frontend ↔ backend: **HTTPS** em produção; HTTP permitido apenas em dev local documentado.
- JWT assinado (algoritmo e segredo via env); claims mínimos: `sub`, `email`, `roles`, `iat`, `exp`.
- Expiração configurável (default sugerido: **8h** expediente); refresh token **Could** v1.1.
- Revogação: TTL + logout client-side Must; denylist server-side Should para `admin_sistema`.

---

### RFN-003 — Persistência de credenciais de usuário

| Prioridade | Must |
|------------|------|
| **Rastreio** | RN-007, TODOs.md |

- Tabela dedicada `auth_users` (nome lógico) separada de perfis de negócio.
- Armazenar **apenas hash** da senha — v1 conforme TODO: **SHA256** (+ salt/pepper via env recomendado na implementação).
- Nunca logar senha, token completo ou conteúdo de documentos em logs de aplicação.

---

### RFN-004 — Autorização e RBAC

| Prioridade | Must |
|------------|------|
| **Rastreio** | RN-006 |

- Checagem de papel em **todas** as rotas mutáveis e downloads de arquivo.
- Princípio do menor privilégio; falha → HTTP 403.
- Matriz papel × recurso documentada em OpenAPI (security schemes).

---

### RFN-005 — Proteção de uploads e isolamento

| Prioridade | Must |
|------------|------|
| **Rastreio** | stakeholder-matrix §4.4, G-09 |

- Storage segregado por `curso_id` / `processo_id`; URLs não adivinháveis (UUID + auth).
- Validação anti-malware **Could** v1; validação MIME/extensão **Must**.
- Limite de tamanho por arquivo e por processo (RFN-010).

---

### RFN-006 — CORS e superfície de API

| Prioridade | Must |
|------------|------|
| **Rastreio** | TODOs.md |

- CORS restrito a origens configuradas (`CORS_ORIGINS`).
- OpenAPI publicada em `/api/docs` (ou path padrão do stack) **sem** expor rotas internas de admin sem auth.

---

### RFN-007 — Auditoria e integridade (RN-025)

| Prioridade | Should |
|------------|------|
| **Rastreio** | RN-025, P-GOV-01 |

- Log de eventos de negócio: login, criação processo, decisão sugestão, exportação, falha IA.
- Campos: timestamp UTC, `user_id`, `processo_id`, tipo evento, payload resumido (sem conteúdo integral do Word).
- Trilha append-only; alteração de eventos históricos proibida (correções via novo evento compensatório).

---

### RFN-008 — Dados sensíveis e uso de IA externa

| Prioridade | Must (decisão) |
|------------|----------------|
| **Rastreio** | G-09, V-02, V-03 |

- **Gate de produção:** RF-040 só habilitado após registro de decisão institucional (on-prem / nuvem / anonimização).
- Tráfego para IA externa: TLS, sem persistência do provedor além do contrato (DPA).
- Documentar dados enviados (trechos de texto, metadados) em ADR de privacidade.

---

## 3. Performance e capacidade

### RFN-010 — Limites de upload e tempo de resposta

| Prioridade | Must |
|------------|------|
| **Rastreio** | V-05 (lacuna) |

- Tamanho máximo por arquivo configurável (`MAX_UPLOAD_MB`, default **50** até validação ILA).
- APIs de listagem: resposta < **2s** p95 com até **500** cursos e **20** materiais/curso (meta de projeto piloto).
- Upload: suportar pelo menos **1** arquivo de **20 MB** em rede institucional típica sem timeout < **120s** (configurável no reverse proxy).

---

### RFN-011 — Processamento de IA

| Prioridade | Should |
|------------|------|
| **Rastreio** | G-04, lacuna SLA |

- Processamento assíncrono para documentos > N páginas (job + polling ou SSE); UX com indicador de progresso.
- Timeout configurável `AI_REQUEST_TIMEOUT_MS` (default **180000**).
- Sem SLA numérico inventado — calibrar no piloto (M-01).

---

### RFN-012 — Retenção e exclusão de dados

| Prioridade | Should |
|------------|------|
| **Rastreio** | business-requirements §3.9, V-10 |

- Política de retenção de uploads e logs parametrizável (`RETENTION_DAYS`).
- Procedimento documentado de exclusão segura (soft-delete + purge job) após validação Jurídico/Segurança.

---

## 4. Disponibilidade e operação

### RFN-020 — Containerização e deploy

| Prioridade | Must |
|------------|------|
| **Rastreio** | ambiente.mdc, G-13 |

- Aplicação empacotada em **Docker**; `docker-compose` para dev alinhado ao Docker Desktop (Windows).
- Serviços: frontend, backend/BFF, banco de dados, storage de arquivos (volume nomeado).

---

### RFN-021 — Disponibilidade em expediente

| Prioridade | Should |
|------------|------|
| **Rastreio** | M-05 |

- Meta indicativa **≥ 99%** uptime em horário de expediente COMGAP (janela a calibrar com TI).
- Health checks (`/health`, `/ready`) para orquestração.

---

### RFN-022 — Backup e recuperação

| Prioridade | Should |
|------------|------|
| **Rastreio** | P-TI-02 |

- Backup diário de banco e volume de arquivos; RPO/RTO definidos com COMGAP (não inventados aqui).

---

## 5. Usabilidade e acessibilidade

### RFN-030 — Responsividade e ergonomia

| Prioridade | Must |
|------------|------|
| **Rastreio** | RN-026 |

- Breakpoints: desktop ≥ 1280px (primário), tablet ≥ 768px utilizável.
- Feedback de loading/erro em todas as ações > 300ms.

---

### RFN-031 — Acessibilidade

| Prioridade | Could |
|------------|------|
| **Rastreio** | lacuna business-requirements §9 |

- v1: HTML semântico, contraste mínimo WCAG AA nos componentes principais.
- Roadmap: conformidade WCAG 2.1 AA completa (F4).

---

## 6. Manutenibilidade e qualidade

### RFN-040 — OpenAPI e contratos

| Prioridade | Must |
|------------|------|
| **Rastreio** | TODOs.md, G-14 |

- Especificação OpenAPI 3.x gerada/mantida junto ao backend; versionamento semver da API (`/api/v1`).
- Breaking changes exigem bump de versão e changelog.

---

### RFN-041 — Padrão BFF/Facade

| Prioridade | Must |
|------------|------|
| **Rastreio** | TODOs.md |

- Frontend consome **apenas** API do backend; composição multi-fonte (DB + IA + storage) encapsulada em facades.
- Idempotência em operações críticas (`POST` criação processo com `Idempotency-Key` **Should**).

---

### RFN-042 — Observabilidade

| Prioridade | Should |
|------------|------|
| **Rastreio** | P-TI-02 |

- Logs estruturados (JSON) com `correlation_id` por requisição.
- Métricas básicas: latência API, taxa erro IA, fila jobs (Prometheus-compatible **Could**).

---

### RFN-043 — Testabilidade

| Prioridade | Must |
|------------|------|
| **Rastreio** | TODOs.md (QA) |

- Testes unitários e integração (Jest) no container; E2E (Playwright) para fluxos críticos: login, curso, iniciar revisão, aceitar sugestão (F2+).
- Cobertura mínima acordada na etapa QA (não fixada aqui).

---

## 7. Arquitetura frontend (NFR de implementação)

### RFN-050 — Estratégia de renderização por página

| Prioridade | Must |
|------------|------|
| **Rastreio** | TODOs.md § Frontend |

| Rota / página | Estratégia | Justificativa |
|---------------|------------|---------------|
| `/login` | SSG + client hydration | Estática, SEO irrelevante |
| `/cursos` | SSR ou client + SWR | Dados autenticados, frescos |
| `/cursos/[id]` | SSR ou client + SWR | Hub dinâmico |
| `/revisao/[processoId]/*` | Client (SPA shell) | Wizard interativo, estado rico |
| `/historico` | Client + SWR | Listagens paginadas |

- Frontend **não persiste** dados de negócio fora do token/sessão (sem IndexedDB de documentos).

---

## 8. Compliance institucional

### RFN-060 — Valores e human-in-the-loop

| Prioridade | Must |
|------------|------|
| **Rastreio** | RB-01, product-vision §4 |

- Nenhum pipeline automatizado aplica alteração ao `.docx` sem decisão registrada.
- Relatórios devem refletir honestamente critérios não executados (RB-03).

---

## 9. Matriz resumo MoSCoW (RFN)

| Must | Should | Could |
|------|--------|-------|
| RFN-001–006, 010, 020, 030, 040–041, 043, 050, 060 | RFN-007, 011–012, 021–022, 031, 042 | RFN-031 pleno WCAG, métricas Prometheus |
