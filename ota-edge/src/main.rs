use axum::{routing::{get, post}, Router};
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::{error, info};

use ota_edge::cache::AppCache;
use ota_edge::config::AppConfig;
use ota_edge::db;
use ota_edge::routes;
use ota_edge::storage::MinioClient;
use ota_edge::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,ota_edge=debug,tower_http=debug".into()),
        )
        .init();

    if let Err(err) = start_server().await {
        eprintln!("=======================================================");
        eprintln!("FATAL ERROR on ota-edge startup: {:#?}", err);
        eprintln!("=======================================================");
        error!("FATAL ERROR on ota-edge startup: {:#?}", err);
        std::process::exit(1);
    }
}

async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
    let config = AppConfig::from_env();
    info!("Starting ota-edge service on port {}", config.port);

    info!("Database URL target: {}", mask_db_url(&config.database_url));
    let pool = db::create_pool(&config.database_url).await?;

    let storage = MinioClient::new(
        &config.minio_endpoint,
        config.minio_port,
        &config.minio_bucket,
    );
    info!(
        "MinIO client configured: endpoint={}:{}, bucket={}",
        config.minio_endpoint, config.minio_port, config.minio_bucket
    );

    let cache = AppCache::new();

    let state = Arc::new(AppState {
        config: config.clone(),
        pool,
        storage,
        cache,
    });

    let app = Router::new()
        .route("/health", get(routes::health_check))
        .route("/internal/invalidate-cache", post(routes::invalidate_cache))
        .route("/api/update/manifest/{app_id}", get(routes::manifest::get_manifest))
        .route("/api/assets/{encoded_key}", get(routes::assets::get_asset))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    info!("ota-edge server ready and listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

fn mask_db_url(url: &str) -> String {
    if let Some(at_idx) = url.find('@') {
        if let Some(colon_slash) = url.find("://") {
            return format!("{}://*****@{}", &url[..colon_slash], &url[at_idx + 1..]);
        }
    }
    "postgresql://*****".to_string()
}
