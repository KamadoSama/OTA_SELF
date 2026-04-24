# ─── Stage 1: Deps ──────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
RUN npm install -g npm@latest
RUN npm ci || npm install

# ─── Stage 2: Builder ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Backend URL for Next.js rewrites (evaluated at build time)
ARG INTERNAL_API_URL=http://ota_backend:3001
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
ARG NEXT_PUBLIC_POSTHOG_HOST

ENV INTERNAL_API_URL=${INTERNAL_API_URL}
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

RUN npm run build

# ─── Stage 3: Production ────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Force le port au niveau du processus Node.js
ENV PORT=3002
# Optionnel mais recommandé pour Docker : permet de lier à 0.0.0.0 au lieu de localhost
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Informe que le conteneur écoute sur 3002
EXPOSE 3002

CMD ["node", "server.js"]
