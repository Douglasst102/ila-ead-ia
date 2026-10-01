/**
 * US-002 AC 02 — variáveis de ambiente documentadas e .env ignorado pelo Git.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');

describe('US-002 AC 02: Variáveis de ambiente', () => {
  it('.gitignore contém .env', () => {
    const gitignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
    expect(gitignore).toMatch(/^\.env$/m);
  });

  it('.env.example na raiz documenta NEXT_PUBLIC_API_URL com /api/v1', () => {
    const example = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8');
    expect(example).toMatch(/NEXT_PUBLIC_API_URL=/);
    expect(example).toMatch(/\/api\/v1/);
  });

  it('apps/web/.env.example documenta NEXT_PUBLIC_API_URL', () => {
    const webExample = fs.readFileSync(
      path.join(ROOT, 'apps/web/.env.example'),
      'utf8',
    );
    expect(webExample).toMatch(/NEXT_PUBLIC_API_URL=/);
  });
});
