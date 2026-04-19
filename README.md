# ZenOTA Platform

> The professional self-hosted Over-The-Air (OTA) update service for React Native Expo.

ZenOTA is a multi-tenant SaaS platform designed to give developers total control over their app deployments with predictable pricing and a first-class developer experience.

## 🚀 Architecture overview

This repository is organized as a monorepo containing three core components:

1.  **Backend (`/backend`)**: A robust NestJS API powered by Prisma (PostgreSQL) and MinIO (S3 storage) for bundle management and multi-tenant authentication.
2.  **Frontend (`/frontend`)**: A premium Next.js 15 dashboard for application management, API key generation, and real-time deployment monitoring.
3.  **CLI (`/zenota-cli`)**: A developer utility to export and ship updates directly from the terminal.

## 🛠️ ZenOTA CLI

The CLI is the main interface for developers using ZenOTA.

### Installation

```bash
npm install -g zenota-cli
```

### Usage

1. **Authentication**: Link your local environment to your ZenOTA account.
   ```bash
   zenota login
   ```
   *You will be prompted for your API Key, which can be generated in the ZenOTA Dashboard.*

2. **Publishing Updates**: Ship your current code to a specific channel.
   ```bash
   zenota publish --channel production
   ```
   *This command runs `npx expo export`, packages the bundle, and pushes it to the ZenOTA servers.*

## 📖 Platform Documentation

Detailed documentation, including CLI reference and API specifications, is available directly within the platform:

👉 **Visit [localhost:3000/docs](http://localhost:3000/docs)** (if running locally)

## 🏗️ Local Development

### Prerequisites
- Node.js (v18+)
- Docker (for DB and Storage)

### Setup
1. **Backend**:
   ```bash
   cd backend
   npm install
   docker-compose up -d
   npx prisma db push
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ⚖️ Pricing Model
ZenOTA follows a tier-based subscription model:
- **Hobby**: $0/mo (1 App, 10 deploys/day)
- **Pro**: $19/mo (Unlimited apps, unlimited deploys, priority CDN)

---

Built for developers who value speed and predictability. 
© 2024 ZenOTA Team.
