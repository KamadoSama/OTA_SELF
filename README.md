<div align="center">

# ⚡ ZenOTA

**High-Performance, Self-Hosted Over-The-Air (OTA) Updates for React Native Expo.**

Bypass slow App Store and Google Play review queues. Ship JS/TS bundle updates directly to your users' devices in seconds with a high-performance Rust edge engine, automated rollbacks, and complete data ownership.

[![GitHub Release](https://img.shields.io/github/v/release/KamadoSama/OTA_SELF?style=flat-square&color=white&labelColor=18181b)](https://github.com/KamadoSama/OTA_SELF/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=white&labelColor=18181b)](LICENSE)
[![Rust](https://img.shields.io/badge/Rust-1.85+-orange?style=flat-square&logo=rust&logoColor=white&labelColor=18181b)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16_Turbopack-black?style=flat-square&logo=next.js&logoColor=white&labelColor=18181b)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo_SDK-50+-000020?style=flat-square&logo=expo&logoColor=white&labelColor=18181b)](https://expo.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white&labelColor=18181b)](https://www.docker.com/)

[**Quickstart**](#-quickstart--vps-one-liner) • [**Architecture**](#-architecture) • [**Expo Setup**](#-expo-integration) • [**CLI Reference**](#-zenota-cli) • [**Self-Hosting**](#-self-hosting-with-docker-compose)

</div>

---

## ✨ Features

- 🦀 **Ultra-Fast Rust Edge Engine (`ota-edge`)**
  Sub-5ms manifest delivery, async multipart streaming, in-memory Moka cache, capable of handling 10,000+ requests/second with minimal memory footprint.
- 🔄 **Instant Rollback & Safe Releases**
  Revert a broken release with one click or via CLI. Zero downtime, zero rebuilds.
- 🏷️ **Multi-Channel Deployments**
  Segregate code across `production`, `staging`, `preview`, or custom channels with runtime version matching.
- 🛡️ **100% Self-Hosted & Private**
  Your source code, assets, and metadata remain strictly on your own infrastructure (PostgreSQL + MinIO/S3).
- 🚀 **1-Command VPS Deployment**
  Self-contained installer with automated Docker provisioning and automated SSL certificates via Caddy.
- 💻 **Intuitive CLI & Modern Dashboard**
  Ship updates straight from your terminal (`zenota publish`) or manage versions and API keys via a sleek Next.js dashboard.

---

## 🏛️ Architecture

```
                                  ┌────────────────────────┐
                                  │   Expo Mobile Client   │
                                  └───────────┬────────────┘
                                              │ GET /api/update/manifest
                                              │ GET /api/assets/:key
                                              ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                                   ZenOTA Platform                                      │
 │                                                                                        │
 │   ┌─────────────────────────┐                        ┌─────────────────────────────┐   │
 │   │  ota-edge (Rust / Axum) │ ── In-Memory Cache ──▶ │     MinIO (S3 Storage)      │   │
 │   │  Port: 4002 (High Load) │ ── Connection Pool ──▶ │         PostgreSQL          │   │
 │   └─────────────────────────┘                        └──────────────┬──────────────┘   │
 │                                                                     ▲                  │
 │   ┌─────────────────────────┐                                       │                  │
 │   │  backend (NestJS API)   │ ──────────────────────────────────────┘                  │
 │   │  Port: 4001 (Admin/Auth)│                                                          │
 │   └────────────▲────────────┘                                                          │
 │                │                                                                       │
 │   ┌────────────┴────────────┐                        ┌─────────────────────────────┐   │
 │   │  frontend (Next.js 16)  │                        │         zenota-cli          │   │
 │   │  Port: 3000 (Dashboard) │                        │ (Publish bundles & manages) │   │
 │   └─────────────────────────┘                        └─────────────────────────────┘   │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart — VPS One-Liner

Deploy a production-ready ZenOTA instance (Database, Storage, Rust Edge, Backend, Frontend, and Caddy with automatic HTTPS) in under 2 minutes:

```bash
curl -fsSL https://get-zenota.diesestudio.com | sh
sudo zenota init
```

The interactive installer will:
1. Detect your environment (OS, architecture, Dokploy/Docker presence).
2. Ask for your domain name (e.g. `ota.yourdomain.com`).
3. Generate secure random passwords and secrets.
4. Spin up all containers and apply database migrations automatically.

---

## 📱 Expo Integration

Configure your Expo React Native application in 2 simple steps:

### 1. Install `expo-updates`

```bash
npx expo install expo-updates
```

### 2. Configure `app.json`

Add the update configuration pointing to your ZenOTA instance:

```json
{
  "expo": {
    "name": "MyMobileApp",
    "slug": "my-mobile-app",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0,
      "url": "https://ota.yourdomain.com/api/update/manifest/my-mobile-app"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## 🛠️ ZenOTA CLI

The CLI is the developer tool used to authenticate and ship updates.

### Installation

```bash
npm install -g zenota-cli
```

### Authenticate

```bash
zenota login
```
*Enter your ZenOTA Dashboard URL and your API Key (generated in **Dashboard > API Keys**).*

### Publish an Update

In your Expo project root:

```bash
# Publish to production channel
zenota publish --channel production

# Publish to staging channel
zenota publish --channel staging
```

The CLI runs `npx expo export`, packages the bundle and assets, and securely streams the update to your ZenOTA server.

---

## 🐳 Self-Hosting with Docker Compose

If you prefer deploying with raw Docker Compose instead of the management CLI:

```bash
# 1. Clone the repository
git clone https://github.com/KamadoSama/OTA_SELF.git /opt/zenota
cd /opt/zenota

# 2. Configure environment variables
cp .env.example .env
nano .env

# 3. Start all services
docker compose up -d --build
```

### Services & Ports:
- **`frontend`** : Dashboard UI (`http://localhost:3000`)
- **`backend`** : Admin API (`http://localhost:4001`)
- **`edge`** : Rust High-Performance Manifest & Asset Edge (`http://localhost:4002`)
- **`db`** : PostgreSQL 15
- **`minio`** : S3-compatible Object Storage

---

## 📁 Repository Structure

```
OTA_SELF/
├── backend/          # NestJS API (Auth, Admin, Multi-tenancy, Prisma ORM)
├── frontend/         # Next.js 16 Dashboard (Turbopack, Tailwind CSS, NextAuth v5)
├── ota-edge/         # Ultra-fast Rust microservice (Axum, SQLx, Moka cache)
├── zenota-cli/       # Developer CLI (Node.js, Commander) for publishing updates
├── zenota-server/    # Standalone VPS installer & server management binary
├── docker-compose.yml# Production & Staging multi-container orchestration
└── .env.example      # Master configuration template
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these conventions:
1. Use standard branch prefixes: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `test/*`.
2. Follow [Conventional Commits](https://www.conventionalcommits.org/).
3. Ensure all tests and builds pass before submitting a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Built with ❤️ for the React Native & Expo developer community.
