# syntax=docker/dockerfile:1
# SAD-ILA WebApp — Next.js App Router (US-002)
# dev: npm run dev :3000 | prod: next build + next start (standalone runner)

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

FROM node:${NODE_VERSION} AS dev
WORKDIR /app
RUN apk add --no-cache wget
COPY --from=deps /app/node_modules ./node_modules
COPY package.json next.config.mjs tsconfig.json next-env.d.ts ./
COPY app ./app
COPY lib ./lib
COPY scripts ./scripts
RUN chmod +x scripts/docker-entrypoint.sh scripts/npm-sync.sh
ENV NODE_ENV=development
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache wget
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]

# Perfil alternativo US-002: `next start` (sem standalone) — use target `runner-npm` se necessário
FROM node:${NODE_VERSION} AS runner-npm
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache wget
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
CMD ["npm", "run", "start"]
