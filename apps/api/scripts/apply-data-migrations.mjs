/**
 * US-002 — migrações SQL incrementais (CON-003) com schema_migrations.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectPgWithRetry } from './db-connect.mjs';
import { resolveSafeMigrationPath } from './migration-path.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR =
  process.env.DATA_MIGRATIONS_DIR ?? path.resolve(__dirname, '../data/migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedFilenames(client) {
  const { rows } = await client.query(`SELECT filename FROM schema_migrations`);
  return new Set(rows.map((r) => r.filename));
}

/** Banco criado via initdb (001) antes do tracking existir. */
async function backfillLegacyInitdb(client, files) {
  const applied = await getAppliedFilenames(client);
  if (applied.size > 0) {
    return;
  }
  const probe = await client.query(`SELECT to_regclass('public.auth_users') AS rel`);
  if (!probe.rows[0]?.rel) {
    return;
  }
  for (const file of files) {
    if (file.startsWith('001_')) {
      await client.query(
        `INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING`,
        [file],
      );
      console.log('[migrate] Backfill registro (initdb):', file);
    }
  }
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.warn('[migrate] Diretório inexistente:', MIGRATIONS_DIR);
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não definida');
  }

  const client = await connectPgWithRetry(connectionString);
  try {
    await ensureMigrationsTable(client);
    const files = listMigrationFiles();
    await backfillLegacyInitdb(client, files);

    const applied = await getAppliedFilenames(client);

    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }
      const fullPath = resolveSafeMigrationPath(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(fullPath, 'utf8');
      console.log('[migrate] Aplicando', file);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(`INSERT INTO schema_migrations (filename) VALUES ($1)`, [file]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
    console.log('[migrate] Concluído.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : 'erro desconhecido';
  console.error('[migrate] Falha:', msg);
  process.exit(1);
});
