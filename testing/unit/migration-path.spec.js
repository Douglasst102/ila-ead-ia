const path = require('node:path');

describe('migration-path (US-002)', () => {
  let resolveSafeMigrationPath;

  beforeAll(async () => {
    ({ resolveSafeMigrationPath } = await import(
      '../../apps/api/scripts/migration-path.mjs'
    ));
  });

  const dir = path.resolve(__dirname, '../../data/migrations');

  it('aceita arquivo de migração válido', () => {
    const resolved = resolveSafeMigrationPath(dir, '001_initial_schema.sql');
    expect(resolved).toContain('001_initial_schema.sql');
  });

  it('rejeita path traversal', () => {
    expect(() => resolveSafeMigrationPath(dir, '../001_initial_schema.sql')).toThrow(
      /inválido|rejeitado/i,
    );
  });

  it('rejeita nome fora do padrão', () => {
    expect(() => resolveSafeMigrationPath(dir, 'evil.sql')).toThrow(/inválido/i);
  });
});
