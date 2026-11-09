export const dokployCompose = (domain: string) => `
services:
  db:
    image: postgres:15-alpine
    container_name: ota_postgres
    restart: always
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - dokploy-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER} -d \${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: elestio/minio:latest
    container_name: ota_minio
    restart: always
    environment:
      MINIO_ROOT_USER: \${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    networks:
      - dokploy-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  backend:
    image: kamadosama2808/zenota-backend:latest
    container_name: ota_backend
    restart: always
    environment:
      DATABASE_URL: \${DATABASE_URL}
      MINIO_ENDPOINT: ota_minio
      MINIO_PORT: 9000
      MINIO_ROOT_USER: \${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD}
      JWT_SECRET: \${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      PORT: 3001
      SELF_HOSTED: "true"
    networks:
      - dokploy-network
    depends_on:
      db:
        condition: service_healthy
      minio:
        condition: service_healthy

  frontend:
    image: kamadosama2808/zenota-frontend:latest
    container_name: ota_frontend
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: https://${domain}/api
      INTERNAL_API_URL: http://ota_backend:3001
      AUTH_SECRET: \${AUTH_SECRET}
      AUTH_URL: https://${domain}
      AUTH_TRUST_HOST: "true"
      NODE_ENV: production
      SELF_HOSTED: "true"
      NEXT_PUBLIC_SELF_HOSTED: "true"
    networks:
      - dokploy-network
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=dokploy-network"
      - "traefik.http.routers.zenota.rule=Host(\`${domain}\`)"
      - "traefik.http.routers.zenota.entrypoints=websecure"
      - "traefik.http.routers.zenota.tls=true"
      - "traefik.http.routers.zenota.tls.certresolver=letsencrypt"
      - "traefik.http.routers.zenota.service=zenota"
      - "traefik.http.routers.zenota-web.rule=Host(\`${domain}\`)"
      - "traefik.http.routers.zenota-web.entrypoints=web"
      - "traefik.http.routers.zenota-web.service=zenota"
      - "traefik.http.services.zenota.loadbalancer.server.port=3002"
    depends_on:
      - backend

volumes:
  postgres_data:
  minio_data:

networks:
  dokploy-network:
    external: true
`;
