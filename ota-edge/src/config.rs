use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub minio_endpoint: String,
    pub minio_port: u16,
    pub minio_root_user: String,
    pub minio_root_password: String,
    pub minio_bucket: String,
    pub minio_public_url: Option<String>,
    pub ota_asset_hmac_secret: Option<String>,
    pub port: u16,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();
        Self {
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgresql://postgres:postgres@localhost:5432/ota_db".to_string()
            }),
            minio_endpoint: env::var("MINIO_ENDPOINT").unwrap_or_else(|_| "localhost".into()),
            minio_port: env::var("MINIO_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(9000),
            minio_root_user: env::var("MINIO_ROOT_USER").unwrap_or_else(|_| "admin".into()),
            minio_root_password: env::var("MINIO_ROOT_PASSWORD").unwrap_or_else(|_| "password123".into()),
            minio_bucket: env::var("MINIO_BUCKET").unwrap_or_else(|_| "ota-assets".into()),
            minio_public_url: env::var("MINIO_PUBLIC_URL").ok(),
            ota_asset_hmac_secret: env::var("OTA_ASSET_HMAC_SECRET").ok(),
            port: env::var("EDGE_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(4002),
        }
    }

    pub fn minio_base_url(&self) -> String {
        if let Some(ref pub_url) = self.minio_public_url {
            if !pub_url.is_empty() {
                return pub_url.trim_end_matches('/').to_string();
            }
        }
        format!("http://{}:{}", self.minio_endpoint, self.minio_port)
    }
}

