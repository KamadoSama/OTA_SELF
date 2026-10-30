pub mod models;
pub mod queries;

use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::time::Duration;
use tracing::{error, info, warn};

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    let mut attempts = 0;
    const MAX_ATTEMPTS: u32 = 10;

    loop {
        attempts += 1;
        info!(
            "Attempting to connect to PostgreSQL (attempt {}/{})...",
            attempts, MAX_ATTEMPTS
        );

        match PgPoolOptions::new()
            .max_connections(25)
            .min_connections(0) // Lazy connections (do not block container start)
            .acquire_timeout(Duration::from_secs(10))
            .idle_timeout(Duration::from_secs(60))
            .connect(database_url)
            .await
        {
            Ok(pool) => {
                info!("Successfully connected to PostgreSQL!");
                return Ok(pool);
            }
            Err(e) if attempts < MAX_ATTEMPTS => {
                warn!(
                    "PostgreSQL connection attempt {} failed: {}. Retrying in 2 seconds...",
                    attempts, e
                );
                tokio::time::sleep(Duration::from_secs(2)).await;
            }
            Err(e) => {
                error!(
                    "FATAL: All {} attempts to connect to PostgreSQL failed: {}",
                    MAX_ATTEMPTS, e
                );
                return Err(e);
            }
        }
    }
}
