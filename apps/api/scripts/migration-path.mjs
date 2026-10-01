/**
 * Valida nomes de migração e impede path traversal (AppSec US-002).
 */
import path from 'node:path';

const FILENAME_PATTERN = /^[0-9]{3}_[\w.-]+\.sql$/;

/**
 * @param {string} migrationsDir
 * @param {string} file
 */
export function resolveSafeMigrationPath(migrationsDir, file) {
  if (!FILENAME_PATTERN.test(file)) {
    throw new Error(`Nome de migração inválido: ${file}`);
  }
  const base = path.resolve(migrationsDir);
  const fullPath = path.resolve(base, file);
  if (fullPath !== base && !fullPath.startsWith(`${base}${path.sep}`)) {
    throw new Error(`Path de migração rejeitado: ${file}`);
  }
  return fullPath;
}
