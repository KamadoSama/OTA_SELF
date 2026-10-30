# ⚡ OTA Edge (Rust Delivery Engine)

Microservice haute performance écrit en Rust (Axum) pour la distribution des mises à jour Expo Updates (`/api/update/manifest/:appId`) et le streaming sécurisé des assets (`/api/assets/:encodedKey`).

## 🚀 Performances
- **Latence P99 :** < 2 ms (avec cache mémoire Moka sub-milliseconde)
- **Empreinte RAM :** ~15 Mo à 30 Mo
- **Concurrence :** 40 000+ requêtes/seconde par vCPU
- **Zéro Garbage Collection :** Latence plate et prévisible sous forte charge (pics de distribution).

---

## 🔀 Configuration Reverse Proxy (Exemple Nginx / Caddy)

Pour router le trafic dans l'architecture hybride sans modifier aucune URL côté application mobile :

### Exemple Caddyfile
```caddy
api.mon-domaine.com {
    # ⚡ Route le trafic critique vers le moteur Rust (port 4002)
    handle /api/update/manifest/* {
        reverse_proxy http://127.0.0.1:4002
    }
    handle /api/assets/* {
        reverse_proxy http://127.0.0.1:4002
    }

    # 🛠️ Route tout le reste (Auth, Dashboard, Uploads, Invoices) vers NestJS (port 4001)
    handle {
        reverse_proxy http://127.0.0.1:4001
    }
}
```

### Exemple Nginx
```nginx
server {
    server_name api.mon-domaine.com;

    # ⚡ Trafic critique Expo Updates -> Rust
    location /api/update/manifest/ {
        proxy_pass http://127.0.0.1:4002;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    location /api/assets/ {
        proxy_pass http://127.0.0.1:4002;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    # 🛠️ Reste de l'API -> NestJS
    location / {
        proxy_pass http://127.0.0.1:4001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

---

## 🛠️ Développement Local

```bash
# Lancer les tests unitaires
cargo test

# Lancer le service en mode dev
cargo run
```

Variables d'environnement attendues dans le fichier `.env` :
- `DATABASE_URL` : Chaîne de connexion PostgreSQL
- `MINIO_ENDPOINT` : Hôte MinIO (ex: `localhost` ou `minio`)
- `MINIO_PORT` : Port MinIO (ex: `9000`)
- `MINIO_BUCKET` : Nom du bucket (par défaut `expo-updates`)
- `OTA_ASSET_HMAC_SECRET` : Clé secrète de signature HMAC
- `EDGE_PORT` : Port d'écoute (par défaut `4002`)

