#!/bin/sh
set -e

if [ "$NODE_ENV" != "production" ]; then
  . ./scripts/npm-sync.sh
fi

echo "[entrypoint] Aplicando migrações SQL..."
node scripts/apply-data-migrations.mjs

echo "[entrypoint] Gerando Prisma Client..."
npx prisma generate

exec "$@"
