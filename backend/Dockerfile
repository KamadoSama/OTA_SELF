# ─── Stage 1: Builder ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && ls dist/ && test -f dist/main.js

# ─── Stage 2: Production ────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copie le code compilé et le schema Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Génère le client Prisma en production
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/main"]
