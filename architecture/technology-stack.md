# Stack tecnológico — SAD-ILA

**Versão:** 1.0  
**Data:** 2026-10-01  
**Arquitetura:** Alternativa A (monólito modular + BFF)  
**Referência de stacks da casa:** `.cursor/skills/architecture-design/references/stacks-atuais.md`  
**Decisão consolidada:** `architecture/architecture-document.md`, ADRs 002–009  

Convenção: **Opção A** = escolhida (alinhada às stacks atuais). **Opção B** = alternativa documentada, **não** adotada na v1.

---

## 1. Resumo da stack escolhida

| Camada | Tecnologia | Papel |
|--------|------------|--------|
| Linguagem | **TypeScript** sobre **Node.js** | Front e back |
| Frontend | **Next.js** (App Router) + **React** | UI institucional |
| Backend / BFF | **NestJS** | API REST, módulos de domínio, consumidor AMQP |
| API | REST JSON, OpenAPI 3.x, `/api/v1` | Contrato com o frontend |
| Auth | JWT Bearer (segredo/algoritmo via env) | RFN-002 |
| Banco | **PostgreSQL** | Transacional + auditoria |
| Object storage | **MinIO** (API S3) | Word/PDF |
| Mensageria | **RabbitMQ** | Jobs IA e export |
| IA (dev/piloto) | **Ollama** via Facade | RF-090; produção gated G-09 |
| Containers | **Docker** + Compose | RFN-020; Windows/Docker Desktop |
| Testes | **Jest** (unit/integração) + **Playwright** (E2E) | RFN-043 |
| Formato | JSON (API); OOXML `.docx` / PDF (arquivos) | — |

Não há plataforma de nuvem padronizada na stack da casa (`Cloud Platforms: None.`). Hospedagem alvo: infraestrutura COMGAP (a detalhar na etapa DevOps). Kubernetes está na stack mas **não** é requisito do piloto.

---

## 2. Componentes — opções e trade-offs

### 2.1 Frontend

**Descrição:** interface responsiva; consome apenas o BFF; não persiste documentos.

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **Next.js** + React + TypeScript | React SPA (Vite) sem Next |
| Justificativa | Stack atual; SSG do `/login` (RFN-050); App Router; mesmo ecossistema do Nest | Bundle menor, menos opinião de servidor |
| Trade-offs | Runtime Node extra no contêiner WebApp | Perde SSG/ISR nativo; ainda precisaria de servidor estático |

**Rejeitada:** Angular (stack atual, curva diferente do restante Node/TS do projeto e do TODO “javascript através do node.js”). **React Native** fora de escopo (não há app nativo).

Renderização por rota: ADR-002 e SAD §8.

### 2.2 Backend / BFF

**Descrição:** única API de negócio; Facade sobre Postgres, MinIO, RabbitMQ e IA.

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **NestJS** (TypeScript) | **Spring Boot** (Java) |
| Justificativa | Stack atual; OpenAPI (Swagger) nativo; módulos = bounded contexts; alinhado a Node.js (`TODOs.md`) | Maduro em institucional Java/JHipster |
| Trade-offs | Event loop: jobs longos exigem fila (ADR-009) | Dois ecossistemas (TS front + Java back); maior ops para o time do piloto |

**Rejeitada v1:** Flask/Python (TODO pediu Node.js); PHP.

Padrão interno: módulos Nest + injeção de dependência; OpenAPI em `/api/docs` (protegido em produção conforme RFN-006).

### 2.3 Persistência relacional

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **PostgreSQL** | ElasticSearch (busca) + PG, ou só arquivos |
| Justificativa | Stack atual; ACID para HITL e auditoria; JSONB se necessário para payload resumido | ES ajuda busca full-text de materiais |
| Trade-offs | Busca textual avançada fica para evolução | ES adiciona cluster sem requisito Must |

ORM: **Prisma** ou **TypeORM** (decisão de implementação no Technical Analyst; ambos compatíveis com NestJS). Não é ADR de estilo.

Tabela lógica `auth_users` **separada** de perfis de negócio (RFN-003).

### 2.4 Object storage

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **MinIO** | Volume Docker bind-only / filesystem local |
| Justificativa | Stack atual; S3 API; isolamento por prefixo; evolução para S3 institucional | Simples no Compose |
| Trade-offs | Mais um serviço no Compose | Backup e isolamento piores; troca de storage depois é cara |

### 2.5 Mensageria / jobs

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **RabbitMQ** + consumer no NestJS | **Redis** + BullMQ |
| Justificativa | Stack atual de messaging; filas duráveis; ADR-009 | Redis também é stack atual; Bull é idiomático em Node |
| Trade-offs | Dois serviços (PG + Rabbit) no piloto | Redis extra **ou** misturar cache+fila; Bull não é AMQP da casa |

**v1:** consumidor **no mesmo deploy** do BFF (não usar Redis só para fila). Prefetch limitado.

### 2.6 Inteligência artificial

| | Opção A (piloto/dev) | Opção B |
|--|---------------------|---------|
| Tecnologia | **Ollama** on-prem/dev, atrás da Facade | Provedor cloud comercial (REST) |
| Justificativa | Stack atual; dados podem permanecer na rede local (alinha G-09 se on-prem for a decisão) | Qualidade de modelo possivelmente superior |
| Trade-offs | GPU/capacidade COMGAP; qualidade PT-BR a calibrar (M-02) | DPA, TLS, classificação de sigilo — **bloqueado** até G-09 |

Whisper está na stack (áudio) — **fora de escopo** (não há RF de transcrição).

Interface `IaProvider`: `analisarMaterial(input) → SugestaoDraft[]`. Feature flag `AI_ENABLED`.

### 2.7 Cache (não Must)

| | Opção A (v1) | Opção B |
|--|-------------|--------|
| Tecnologia | **Sem cache distribuído** | **Redis** |
| Justificativa | 500 cursos / 2 s p95 cabem em PG indexado | Se piloto estourar p95 |
| Trade-offs | Queries sempre no banco | Serviço a mais |

### 2.8 Containerização

| | Opção A (escolhida) | Opção B |
|--|---------------------|---------|
| Tecnologia | **Docker Compose** (Desktop Windows) | Kubernetes no piloto |
| Justificativa | RFN-020, regra de ambiente, stack atual | K8s está na lista da casa |
| Trade-offs | Sem orquestração avançada | Sobrecarga para um time e um produto piloto |

Serviços Compose previstos (DevOps implementa): `web`, `api`, `postgres`, `minio`, `rabbitmq`, `ollama` (opcional/profile).

### 2.9 Testes e qualidade

| Tipo | Ferramenta | Onde corre |
|------|------------|------------|
| Unitário / integração | **Jest** | Container da app / QA |
| E2E | **Playwright** | Container de QA (skill `qa-testing`) |
| Contrato | OpenAPI + testes de contrato no Nest | ApiBff |

### 2.10 Observabilidade (Should)

Logs JSON com `correlation_id` (RFN-042). Métricas Prometheus-compatible = **Could**. Sem APM inventado.

---

## 3. Variáveis de ambiente (catálogo lógico)

Implementação e `.env.example` são da etapa DevOps. Nomes lógicos obrigatórios:

| Variável | Uso |
|----------|-----|
| `JWT_SECRET` / `JWT_ALGORITHM` / `JWT_EXPIRES_IN` | Auth |
| `PASSWORD_PEPPER` | Hash (ADR-007) |
| `DATABASE_URL` | PostgreSQL |
| `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET` | Storage |
| `RABBITMQ_URL` | Jobs |
| `AI_ENABLED`, `AI_PROVIDER_BASE_URL`, `AI_API_KEY`, `AI_REQUEST_TIMEOUT_MS` | Facade IA |
| `CORS_ORIGINS` | RFN-006 |
| `MAX_UPLOAD_MB` | RFN-010 (default 50) |
| `RETENTION_DAYS` | RFN-012 |

Nenhum desses valores no código-fonte.

---

## 4. Versões

Versões **exatas** de imagem/npm ficam para DevOps/Technical Analyst (não inventar pinos aqui). Diretriz: LTS Node.js alinhada ao NestJS/Next estáveis na data de implementação.

---

## 5. O que a stack **não** inclui na v1

- Kubernetes, service mesh, API gateway comercial
- Kafka (não está nas stacks atuais; RabbitMQ cobre o caso)
- ChromaDB / RAG vetorial (não há RF de retrieval além de referências anexas ao processo)
- SSO / LDAP / IdP COMAER
