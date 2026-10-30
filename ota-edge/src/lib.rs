pub mod cache;
pub mod config;
pub mod db;
pub mod routes;
pub mod storage;
pub mod utils;

use cache::AppCache;
use config::AppConfig;
use sqlx::PgPool;
use storage::MinioClient;

pub struct AppState {
    pub config: AppConfig,
    pub pool: PgPool,
    pub storage: MinioClient,
    pub cache: AppCache,
}
