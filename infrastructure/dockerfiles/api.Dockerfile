# syntax=docker/dockerfile:1
# Build context: raiz do repositório (CON-001 — inclui data/migrations)

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

FROM node:${NODE_VERSION} AS dev
WORKDIR /app
RUN apk add --no-cache wget
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api/package.json ./
COPY apps/api/nest-cli.json apps/api/tsconfig.json ./
COPY apps/api/prisma ./prisma
COPY apps/api/scripts ./scripts
COPY apps/api/src ./src
COPY data/migrations ./data/migrations
RUN chmod +x scripts/docker-entrypoint.sh scripts/npm-sync.sh
ENV NODE_ENV=development
ENV DATA_MIGRATIONS_DIR=/app/data/migrations
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=5s --start-period=90s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3001/ready || exit 1
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY apps/api/package.json apps/api/package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY apps/api/ ./
COPY data/migrations ./data/migrations
RUN npm run build && npm prune --omit=dev

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATA_MIGRATIONS_DIR=/app/data/migrations
RUN apk add --no-cache wget
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nestjs:nodejs /app/data/migrations ./data/migrations
COPY --chown=nestjs:nodejs apps/api/package.json ./package.json
RUN chmod +x scripts/docker-entrypoint.sh scripts/npm-sync.sh
USER nestjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/ready || exit 1
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
