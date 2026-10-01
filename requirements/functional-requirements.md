# Requisitos Funcionais — SAD-ILA

**Produto:** SAD-ILA — Sistema de Apoio ao Desenvolvimento de Material Didático  
**Versão:** 1.0  
**Data:** 2026-10-01  
**Fontes:** `business/business-requirements.md`, `processes/process-map.md`, `TODOs.md`

---

## 1. Convenções

| Campo | Descrição |
|-------|-----------|
| **ID** | `RF-xxx` — requisito funcional implementável |
| **Prioridade** | Must / Should / Could (MoSCoW) |
| **Fase** | MVP, F2 (Fase 2), F3 (Fase 3), F4 (evolução) |
| **Rastreio** | RN-xxx, P-xxx (processo) |

**Premissa v1 (lacuna RN-005/006):** autenticação por **cadastro local** (e-mail + senha) com JWT; SSO COMAER permanece **F4 / Won't v1** até decisão V-04.

**Papéis mínimos v1 (proposta para RBAC):**

| Papel | Capacidades |
|-------|-------------|
| `revisor` | Cursos (leitura), materiais, revisão completa |
| `admin_cursos` | CRUD cursos + materiais |
| `admin_sistema` | Provisionamento de usuários (TI) |

---

## 2. Acesso, sessão e autorização

### RF-001 — Tela de login como entrada da aplicação

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-005, P-ACC-01 |

O sistema deve exibir tela de autenticação como rota inicial para usuários não autenticados, com campos de identificador (e-mail) e senha, ação de envio e feedback de erro genérico (sem revelar se o e-mail existe).

**Critérios de aceitação (resumo):** login válido redireciona ao painel de cursos; credenciais inválidas mantêm na tela com mensagem institucional; campos obrigatórios validados no cliente e servidor.

---

### RF-002 — Emissão e uso de JWT pós-login

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-008, P-ACC-01 |

Após autenticação bem-sucedida, o backend deve emitir **JWT** contendo identificador do usuário, papel(is) e expiração. O frontend deve enviar o token em `Authorization: Bearer` em todas as chamadas à API de negócio.

**Critérios de aceitação (resumo):** token ausente ou expirado → HTTP 401; token válido → acesso aos recursos conforme papel.

---

### RF-003 — Controle de acesso a recursos protegidos

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-006, P-ACC-01 |

Cursos, materiais, processos de revisão, histórico e exportações só são acessíveis a usuários autenticados. Operações de escrita (cadastro curso, upload, decisões de revisão) devem respeitar RBAC mínimo (§1).

---

### RF-004 — Encerramento de sessão (logout)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | MVP |
| **Rastreio** | RN-005, P-ACC-01 |

O usuário autenticado deve poder encerrar a sessão, invalidando o token no cliente e, quando aplicável, registrando revogação server-side (lista de denylist ou TTL curto — ver RFN de segurança).

---

### RF-005 — Provisionamento de usuários (administração)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-006, P-TI-01 |

Usuários com papel `admin_sistema` devem poder cadastrar usuários (e-mail, nome, papel, senha inicial ou convite), desativar contas e listar usuários. Senha persistida **somente como hash** (ver RFN-003).

---

## 3. Gestão de cursos

### RF-010 — Listagem de cursos

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-001, P-CUR-02 |

Usuário autenticado visualiza lista de cursos com título, descrição resumida e indicadores básicos (ex.: quantidade de materiais, revisões em andamento — **Could** MVP). Suporte a paginação ou scroll virtual quando volume crescer.

---

### RF-011 — Cadastro de curso

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-002, P-CUR-01 |

Usuário com permissão (`admin_cursos` ou superior) cadastra curso informando **título** (obrigatório, único por organização lógica) e **descrição** (obrigatória). Validações de tamanho máximo configuráveis via ambiente.

---

### RF-012 — Consulta de detalhe do curso

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-001, RN-003, P-CUR-02 |

A partir da lista, o usuário acessa página de detalhe do curso como **hub** para materiais de apoio e ações de revisão (RN-004).

---

## 4. Materiais de apoio

### RF-020 — Upload de material de apoio por curso

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-003, P-MAT-01 |

No contexto do curso, usuário autorizado envia um ou mais arquivos (tipos MIME configuráveis; MVP aceita pelo menos PDF e Word). Sistema armazena metadados: nome original, tamanho, tipo, data, autor do upload, curso vinculado.

---

### RF-021 — Listagem e download de materiais de apoio

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP |
| **Rastreio** | RN-003, P-MAT-01 |

Listagem ordenada por data; ação de download via URL autenticada ou stream protegido por JWT.

---

### RF-022 — Ação “Iniciar Revisão” no contexto do curso/material

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP (entrada) / F2 (fluxo completo) |
| **Rastreio** | RN-004, P-REV-01 |

A partir do curso ou de um material, ação explícita **Iniciar Revisão** cria instância de **processo de revisão** vinculada ao curso (RB-04) e navega para wizard de preparação (RF-030+).

---

## 5. Processo de revisão — preparação

### RF-030 — Seleção de curso no wizard de revisão

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-009, P-REV-01 |

Se revisão iniciada sem curso pré-selecionado, revisor escolhe curso da lista antes de prosseguir. Se iniciada do hub do curso, curso vem pré-preenchido e bloqueado para edição (salvo cancelamento).

---

### RF-031 — Upload de Quadro Estrutural (QE) e material didático Word

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-010, P-REV-01 |

Processo aceita dois arquivos Word (`.docx`): QE e material didático. Validar extensão/MIME, tamanho máximo (RFN-010) e persistir como versão **original** imutável do processo (RN-024).

---

### RF-032 — Upload de referências técnicas (múltiplas)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F2 |
| **Rastreio** | RN-011, P-REV-01 |

Permitir zero ou mais referências (Word/PDF). Referências associadas ao processo para uso na revisão técnica normativa.

---

### RF-033 — Seleção de critérios de revisão

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-012, RB-03, P-REV-01 |

Revisor marca um ou mais critérios entre: coerência/coesão textual, linguagem dialógica, ortografia/gramática, consistência terminológica, subordinação hierárquica conforme QE, conferência com QE, revisão técnica normativa. Pelo menos um critério obrigatório. Critérios não selecionados **não** aparecem como concluídos no relatório final (RB-03).

---

### RF-034 — Aviso de limitação quando referências técnicas ausentes

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RB-02, P-REV-01 |

Se critério “revisão técnica normativa” estiver selecionado e não houver referências, o sistema exibe aviso explícito de limitação antes de confirmar início. Se critério não selecionado, revisão técnica normativa não é executada.

---

### RF-035 — Confirmação e instanciação do processo de revisão

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-023, RN-024, RB-04, P-REV-01 |

Ao confirmar preparação, sistema registra estado `preparacao_concluida`, responsável, timestamp, arquivos e critérios; inicia transição para etapa de revisão IA (se critérios textuais/IA aplicáveis) ou QE (se apenas conferência QE — ordem RN-023).

---

## 6. Revisão assistida por IA e human-in-the-loop

### RF-040 — Geração de sugestões via backend (sem auto-aplicação)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-013, RB-01, P-REV-02, P-TI-03 |

Backend envia conteúdo extraído do material + critérios + referências (quando houver) ao **serviço de IA via proxy** (chaves apenas no servidor). IA retorna lista de sugestões; **nenhuma** alteração é aplicada automaticamente ao documento armazenado.

---

### RF-041 — Categorização e justificativa de sugestões

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F2 |
| **Rastreio** | RN-015, P-REV-02 |

Cada sugestão possui: categoria (`melhoria`, `correcao_necessaria`, `ajuste_hierarquia`, `validar_especialista`), trecho referenciado (offset/parágrafo), texto sugerido (quando aplicável), justificativa textual obrigatória.

---

### RF-042 — Interface de revisão de sugestões (aceitar/rejeitar)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-014, RB-01, P-REV-03 |

Revisor visualiza sugestões em lista ou fluxo sequencial; para cada uma escolhe **Aceitar** ou **Rejeitar**. Decisão persistida com usuário e timestamp (RN-024). Versão final do material só incorpora trechos **aceitos** (RB-01).

---

### RF-043 — Recomendação de validação por especialista

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F2 |
| **Rastreio** | RN-016, RB-05, P-REV-04 |

Sugestões ou itens com categoria/incerteza técnica exibem flag **Validar com especialista**. Sistema não substitui parecer humano; revisor pode registrar nota de encaminhamento e resultado (texto livre + data).

---

### RF-044 — Progressão para conferência QE após revisão textual

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2/F3 |
| **Rastreio** | RN-023, P-REV-03 |

Botão de avanço para conferência QE só habilitado quando todas as sugestões dos critérios IA/textuais selecionados tiverem decisão registrada (ou critério marcado como “sem sugestões” pelo sistema após processamento).

---

## 7. Conferência do Quadro Estrutural (QE)

### RF-050 — Matriz QE ↔ material com status de cobertura

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-017, P-QE-01 |

Sistema apresenta tabela de itens do QE parseado com status: `contemplado`, `cobertura_parcial`, `nao_localizado`, com referência de localização no material (quando identificada).

---

### RF-051 — Comparação de nível hierárquico QE vs material

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-018, P-QE-01 |

Para cada item, exibir nível previsto no QE (primário/secundário/terciário ou equivalente parseado) versus nível identificado no material; destacar divergências.

---

### RF-052 — Detalhamento editável por item da matriz

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F3 |
| **Rastreio** | RN-019, P-QE-01 |

Revisor abre detalhe da linha e edita campos: localização, divergências, texto explicativo; alterações persistidas no processo.

---

### RF-053 — Conclusão da conferência QE

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-023, P-QE-01 |

Ação explícita confirma conferência; estado `qe_concluida`; habilita relatório final (RF-060).

---

## 8. Relatórios, exportações e encerramento

### RF-060 — Relatório final consolidado na UI

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-020, P-ENC-01 |

Tela final exibe resumo textual (contagens sugestões aceitas/rejeitadas por categoria e critério) e resumo QE (contagens por status). Critérios não selecionados aparecem como “não executado” (RB-03).

---

### RF-061 — Exportação material revisado (.docx)

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-021, P-ENC-01 |

Download de Word com alterações **aceitas** aplicadas; metadados opcionais (versão, data, revisor) no rodapé ou propriedades do documento.

---

### RF-062 — Exportação relatórios em PDF

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F3 |
| **Rastreio** | RN-022, P-ENC-01 |

Gerar PDF “Relatório de Revisão” e PDF “Relatório de Conferência QE” com layout institucional base (RN-027 evolução visual).

---

### RF-063 — Encerramento formal do processo

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F3 |
| **Rastreio** | RN-024, M-04, P-ENC-01, P-GOV-01 |

Marcar processo como `concluido`; bloquear edição de decisões salvo política de reabertura ( **Won't v1** ). Disponibilizar histórico completo (RF-070).

---

## 9. Histórico, rastreabilidade e consulta

### RF-070 — Registro de trilha do processo de revisão

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | RN-024, P-GOV-01 |

Para cada processo: arquivos originais (hash), lista de sugestões, decisões, versão final, datas, responsável. Eventos append-only (sem exclusão silenciosa — retenção RFN-012).

---

### RF-071 — Consulta de histórico por curso/processo

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F2/F3 |
| **Rastreio** | RN-025, P-GOV-01 |

Usuário autorizado lista processos concluídos e em andamento por curso; visualiza trilha somente leitura para auditoria interna.

---

## 10. Experiência do usuário (funcional transversal)

### RF-080 — Interface responsiva e navegação por fluxo de revisão

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | MVP→F3 |
| **Rastreio** | RN-026, RN-023 |

Layout responsivo (desktop prioritário, tablet utilizável). Indicador de etapa: preparação → revisão IA → QE → relatório, sem atalhos que pulem etapas obrigatórias (RN-023).

---

### RF-081 — Identidade visual institucional

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Should |
| **Fase** | F2/F3 |
| **Rastreio** | RN-027 |

Aplicar paleta, tipografia e componentes alinhados ao protótipo `others_artifacts/sad-ila-prototype 1.3.html` (detalhamento na etapa UI/UX).

---

## 11. Integração IA (comportamento funcional)

### RF-090 — Abstração de provedor de IA no backend

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | business-requirements §3.9, P-TI-03 |

Endpoints internos do BFF orquestram chamadas ao provedor configurável via `.env`. Frontend **nunca** invoca API de IA diretamente.

---

### RF-091 — Tratamento de falha/indisponibilidade da IA

| Atributo | Valor |
|----------|-------|
| **Prioridade** | Must |
| **Fase** | F2 |
| **Rastreio** | P-REV-02 |

Se IA falhar (timeout, 5xx), processo permanece em estado recuperável; usuário recebe mensagem clara e opção de retry; falha registrada em log de auditoria.

---

## 12. Requisitos explicitamente fora do escopo v1

| ID | Descrição | Rastreio |
|----|-----------|----------|
| **RF-W01** | SSO COMAER | product-vision §3.2, V-04 |
| **RF-W02** | LMS (matrículas, notas, certificados) | product-vision §3.2 |
| **RF-W03** | Edição colaborativa tempo real | product-vision §3.2 |
| **RF-W04** | Publicação automática sem validação humana | RB-01, product-vision §4 |

---

## 13. Lacunas abertas (impacto funcional)

| ID | Lacuna | Decisão provisória na spec |
|----|--------|----------------------------|
| L-01 | Classificação de sigilo (V-02) | Feature flag desabilita RF-040 em produção até aprovação |
| L-02 | Tamanho máximo de arquivo (V-05) | Default configurável via env (ex.: 50 MB) — validar com TI |
| L-03 | Homologação superior ao revisor (V-06) | Fora do fluxo v1; nota em RF-063 |
| L-04 | Versionamento múltiplo de material por curso | v1: um processo ativo por par curso+material; histórico via processos |
