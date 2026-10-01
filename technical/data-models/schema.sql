-- SAD-ILA — DDL PostgreSQL v1.0 (espelho lógico)
-- Deploy / initdb: data/migrations/001_initial_schema.sql (manter sincronizado)
-- Migrações ORM futuras devem reproduzir este esquema.
-- ADR-007: password_hash SHA256 v1 + salt + pepper (aplicação)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Auth (RFN-003, ADR-006, ADR-007)
-- ---------------------------------------------------------------------------

CREATE TABLE auth_users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(320) NOT NULL,
  nome              VARCHAR(200) NOT NULL,
  password_hash     VARCHAR(128) NOT NULL,
  password_salt     VARCHAR(64)  NOT NULL,
  hash_algorithm    VARCHAR(32)  NOT NULL DEFAULT 'sha256_v1',
  roles             VARCHAR(32)[] NOT NULL DEFAULT '{revisor}',
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT auth_users_email_uk UNIQUE (email),
  CONSTRAINT auth_users_roles_check CHECK (
    roles <@ ARRAY['revisor','admin_cursos','admin_sistema']::varchar[]
    AND cardinality(roles) >= 1
  )
);

CREATE INDEX idx_auth_users_email ON auth_users (email);

-- Denylist logout (Should — ADR-006)
CREATE TABLE token_denylist (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_fingerprint   VARCHAR(128) NOT NULL,
  user_id             UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  expira_em           TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT token_denylist_fingerprint_uk UNIQUE (token_fingerprint)
);

CREATE INDEX idx_token_denylist_expira ON token_denylist (expira_em);

-- ---------------------------------------------------------------------------
-- Catálogo (RF-010–012, RF-020–021)
-- ---------------------------------------------------------------------------

CREATE TABLE cursos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      VARCHAR(300) NOT NULL,
  descricao   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cursos_titulo_uk UNIQUE (titulo)
);

CREATE TABLE materiais_apoio (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id        UUID NOT NULL REFERENCES cursos(id) ON DELETE RESTRICT,
  autor_id        UUID NOT NULL REFERENCES auth_users(id) ON DELETE RESTRICT,
  nome_original   VARCHAR(500) NOT NULL,
  tamanho_bytes   BIGINT NOT NULL CHECK (tamanho_bytes > 0),
  mime_type       VARCHAR(127) NOT NULL,
  storage_key     VARCHAR(1024) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT materiais_storage_key_uk UNIQUE (storage_key)
);

CREATE INDEX idx_materiais_curso_created ON materiais_apoio (curso_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Processo de revisão (RF-030–035, RF-044)
-- ---------------------------------------------------------------------------

CREATE TYPE processo_estado AS ENUM (
  'rascunho',
  'preparacao_concluida',
  'revisao_ia',
  'qe',
  'relatorio',
  'concluido'
);

CREATE TABLE processos_revisao (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id                  UUID NOT NULL REFERENCES cursos(id) ON DELETE RESTRICT,
  responsavel_id            UUID NOT NULL REFERENCES auth_users(id) ON DELETE RESTRICT,
  material_apoio_id         UUID REFERENCES materiais_apoio(id) ON DELETE SET NULL,
  estado                    processo_estado NOT NULL DEFAULT 'rascunho',
  ciente_limitacao_rb02     BOOLEAN NOT NULL DEFAULT FALSE,
  preparacao_confirmada_em  TIMESTAMPTZ,
  encerrado_em              TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_processos_curso_estado ON processos_revisao (curso_id, estado, created_at DESC);
CREATE INDEX idx_processos_responsavel ON processos_revisao (responsavel_id, created_at DESC);

CREATE TYPE arquivo_processo_tipo AS ENUM ('qe', 'material', 'referencia');

CREATE TABLE arquivos_processo (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id     UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE CASCADE,
  tipo            arquivo_processo_tipo NOT NULL,
  nome_original   VARCHAR(500) NOT NULL,
  mime_type       VARCHAR(127) NOT NULL,
  tamanho_bytes   BIGINT NOT NULL CHECK (tamanho_bytes > 0),
  storage_key     VARCHAR(1024) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT arquivos_storage_key_uk UNIQUE (storage_key)
);

-- UK parcial: apenas um qe e um material por processo
CREATE UNIQUE INDEX idx_arquivos_um_qe ON arquivos_processo (processo_id) WHERE tipo = 'qe';
CREATE UNIQUE INDEX idx_arquivos_um_material ON arquivos_processo (processo_id) WHERE tipo = 'material';

CREATE INDEX idx_arquivos_processo ON arquivos_processo (processo_id);

CREATE TABLE processo_criterios (
  processo_id       UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE CASCADE,
  criterio_codigo   VARCHAR(64) NOT NULL,
  PRIMARY KEY (processo_id, criterio_codigo)
);

-- Idempotency POST /processos (RFN-041 Should)
CREATE TABLE idempotency_keys (
  key           VARCHAR(128) NOT NULL,
  user_id       UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  processo_id   UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (key, user_id)
);

CREATE INDEX idx_idempotency_created ON idempotency_keys (created_at);

-- ---------------------------------------------------------------------------
-- IA / HITL (RF-040–043)
-- ---------------------------------------------------------------------------

CREATE TYPE sugestao_estado AS ENUM ('pendente', 'aceita', 'rejeitada');
CREATE TYPE sugestao_categoria AS ENUM (
  'melhoria',
  'correcao_necessaria',
  'ajuste_hierarquia',
  'validar_especialista'
);

CREATE TABLE sugestoes_ia (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id           UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE CASCADE,
  categoria             sugestao_categoria NOT NULL,
  estado                sugestao_estado NOT NULL DEFAULT 'pendente',
  trecho_referencia     TEXT,
  trecho_offset         INTEGER,
  trecho_length         INTEGER,
  texto_sugerido        TEXT,
  justificativa         TEXT NOT NULL,
  validar_especialista  BOOLEAN NOT NULL DEFAULT FALSE,
  nota_encaminhamento   TEXT,
  decidido_por_id       UUID REFERENCES auth_users(id) ON DELETE SET NULL,
  decidido_em           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sugestoes_processo_estado ON sugestoes_ia (processo_id, estado);

-- ---------------------------------------------------------------------------
-- Jobs assíncronos (ADR-009)
-- ---------------------------------------------------------------------------

CREATE TYPE job_tipo AS ENUM ('revisao_ia', 'export_docx', 'export_pdf');
CREATE TYPE job_estado AS ENUM ('queued', 'running', 'succeeded', 'failed');

CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id     UUID REFERENCES processos_revisao(id) ON DELETE SET NULL,
  tipo            job_tipo NOT NULL,
  estado          job_estado NOT NULL DEFAULT 'queued',
  fila            VARCHAR(64) NOT NULL,
  error_code      VARCHAR(64),
  error_message   TEXT,
  result_meta     JSONB,
  started_at      TIMESTAMPTZ,
  finished_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jobs_processo_created ON jobs (processo_id, created_at DESC);
CREATE INDEX idx_jobs_estado ON jobs (estado) WHERE estado IN ('queued', 'running');

-- ---------------------------------------------------------------------------
-- QE (RF-050–053)
-- ---------------------------------------------------------------------------

CREATE TYPE qe_status_cobertura AS ENUM (
  'contemplado',
  'cobertura_parcial',
  'nao_localizado'
);

CREATE TABLE qe_itens (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id           UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE CASCADE,
  codigo_hierarquia     VARCHAR(64),
  titulo_item           TEXT NOT NULL,
  status_cobertura      qe_status_cobertura NOT NULL DEFAULT 'nao_localizado',
  localizacao_material  TEXT,
  divergencias          TEXT,
  observacoes           TEXT,
  ordem                 INTEGER NOT NULL DEFAULT 0,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qe_itens_processo_ordem ON qe_itens (processo_id, ordem);

-- ---------------------------------------------------------------------------
-- Exportações (RF-061–062)
-- ---------------------------------------------------------------------------

CREATE TABLE exportacoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id     UUID NOT NULL REFERENCES processos_revisao(id) ON DELETE RESTRICT,
  job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
  formato         VARCHAR(16) NOT NULL CHECK (formato IN ('docx', 'pdf')),
  storage_key     VARCHAR(1024) NOT NULL,
  tamanho_bytes   BIGINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT exportacoes_storage_key_uk UNIQUE (storage_key)
);

CREATE INDEX idx_exportacoes_processo ON exportacoes (processo_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Auditoria append-only (RF-070, ADR-010)
-- ---------------------------------------------------------------------------

CREATE TABLE eventos_auditoria (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id   UUID REFERENCES processos_revisao(id) ON DELETE SET NULL,
  user_id       UUID REFERENCES auth_users(id) ON DELETE SET NULL,
  tipo          VARCHAR(64) NOT NULL,
  payload       JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eventos_processo_created ON eventos_auditoria (processo_id, created_at);
CREATE INDEX idx_eventos_tipo ON eventos_auditoria (tipo, created_at DESC);

-- Opcional: impedir UPDATE/DELETE (append-only forte)
CREATE OR REPLACE FUNCTION deny_auditoria_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'eventos_auditoria is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_eventos_auditoria_no_update
  BEFORE UPDATE OR DELETE ON eventos_auditoria
  FOR EACH ROW EXECUTE FUNCTION deny_auditoria_mutation();
