# syntax=docker/dockerfile:1
# ============================================================================
# Workshop Linux — imagem de produção (Next.js 16 · output: standalone)
# Multi-stage: deps → build → runner. A imagem final NÃO contém o
# node_modules completo nem o código-fonte — só o servidor standalone
# rastreado pelo Next, os assets estáticos e a pasta public.
# ============================================================================

# ── 1. Dependências (cache de camada para o npm ci) ─────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# libc6-compat: alguns pacotes nativos esperam glibc no Alpine (musl)
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ── 2. Build (gera .next/standalone + .next/static) ─────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── 3. Runner (imagem final, mínima) ────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário não-root (defesa em profundidade)
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# server.js standalone + assets (a ordem segue o padrão oficial do Next)
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public           ./public

USER nextjs
EXPOSE 3000

# Healthcheck simples — o orquestrador derruba o container se a home não responder
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# O server.js standalone embute o proxy.ts (CSP nonce) e sobe na PORT/HOSTNAME
CMD ["node", "server.js"]
