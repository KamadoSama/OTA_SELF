export const envFile = (secrets: {
  dbPassword: string;
  minioPassword: string;
  jwtSecret: string;
  authSecret: string;
}) => `
# Mode
SELF_HOSTED=true
NEXT_PUBLIC_SELF_HOSTED=true

# Database
DB_USER=postgres
DB_PASSWORD=${secrets.dbPassword}
DB_NAME=ota_db

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=${secrets.minioPassword}

# Backend
DATABASE_URL=postgresql://postgres:${secrets.dbPassword}@ota_postgres:5432/ota_db?schema=public
JWT_SECRET=${secrets.jwtSecret}

# Frontend
AUTH_SECRET=${secrets.authSecret}
`;
