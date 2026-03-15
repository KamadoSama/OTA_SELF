# Phase 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm install

# Copie du reste du code et build
COPY . .
RUN npx prisma generate
RUN npm run build

# Phase 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["npm", "run", "start:prod"]