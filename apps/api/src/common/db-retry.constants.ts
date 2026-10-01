/** Alinhado a `scripts/db-connect.mjs` (CON-011). */
export const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES ?? 30);
export const DB_RETRY_DELAY_MS = 2_000;

export function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
