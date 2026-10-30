pub mod assets;
pub mod manifest;

use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde_json::json;
use std::sync::Arc;
use crate::AppState;

pub async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, Json(json!({ "status": "ok", "service": "ota-edge" })))
}

pub async fn invalidate_cache(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    state.cache.clear_all().await;
    (StatusCode::OK, Json(json!({ "message": "Cache invalidated" })))
}

