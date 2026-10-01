/**
 * Retry compartilhado para Postgres (CON-011) — migrate + política alinhada ao PrismaService.
 */
export const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES ?? 30);
export const DB_RETRY_DELAY_MS = 2_000;

/**
 * @param {string} connectionString
 * @returns {Promise<import('pg').Client>}
 */
export async function connectPgWithRetry(connectionString) {
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString });

  for (let attempt = 1; attempt <= DB_CONNECT_RETRIES; attempt++) {
    try {
      await client.connect();
      return client;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[db-connect] Postgres aguardando (${attempt}/${DB_CONNECT_RETRIES}): ${msg}`);
      if (attempt === DB_CONNECT_RETRIES) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, DB_RETRY_DELAY_MS));
    }
  }
  throw new Error('unreachable');
}
