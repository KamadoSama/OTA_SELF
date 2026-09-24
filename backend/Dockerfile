# Phase 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/

ENV PUPPETEER_SKIP_DOWNLOAD=true

# Installation des dépendances
RUN npm install

# Cache bust to ensure fresh code copy
ARG CACHEBUST=1

# Copie du reste du code et build
COPY . .
RUN npx prisma generate
RUN npm run build

# Phase 2: Runtime
FROM node:20-alpine

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
# Copy templates for invoices
COPY --from=builder /app/src/invoice/templates ./src/invoice/templates



EXPOSE 4001

CMD ["npm", "run", "start:prod"]