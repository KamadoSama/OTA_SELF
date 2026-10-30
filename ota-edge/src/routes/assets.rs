use axum::{
    body::Body,
    extract::{Path, State},
    http::{HeaderMap, HeaderValue, StatusCode},
    response::Response,
};
use std::sync::Arc;
use tracing::{error, warn};

use crate::utils::hmac::{decode_asset_key, verify_asset_authorization};
use crate::AppState;

pub async fn get_asset(
    Path(encoded_key): Path<String>,
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response, (StatusCode, String)> {
    let asset_key = decode_asset_key(&encoded_key).map_err(|e| {
        (
            StatusCode::BAD_REQUEST,
            format!("Invalid asset key encoding: {}", e),
        )
    })?;

    let auth_header = headers.get("authorization").and_then(|h| h.to_str().ok());

    if let Err(err_msg) = verify_asset_authorization(
        &asset_key,
        auth_header,
        state.config.ota_asset_hmac_secret.as_deref(),
    ) {
        warn!("Unauthorized asset request for {}: {}", asset_key, err_msg);
        return Err((StatusCode::UNAUTHORIZED, err_msg.to_string()));
    }

    let minio_res = state
        .storage
        .fetch_object_stream(&asset_key)
        .await
        .map_err(|e| {
            error!("MinIO fetch error for asset {}: {}", asset_key, e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Storage communication failure".to_string(),
            )
        })?;

    if !minio_res.status().is_success() {
        return Err((StatusCode::NOT_FOUND, "Asset not found".to_string()));
    }

    let content_type = minio_res
        .headers()
        .get("content-type")
        .cloned()
        .unwrap_or_else(|| HeaderValue::from_static("application/octet-stream"));

    let content_length = minio_res.headers().get("content-length").cloned();
    let etag = minio_res.headers().get("etag").cloned();

    let stream = minio_res.bytes_stream();
    let body = Body::from_stream(stream);

    let mut response = Response::new(body);
    let resp_headers = response.headers_mut();

    resp_headers.insert("content-type", content_type);
    if let Some(cl) = content_length {
        resp_headers.insert("content-length", cl);
    }
    if let Some(et) = etag {
        resp_headers.insert("etag", et);
    }
    resp_headers.insert(
        "cache-control",
        HeaderValue::from_static("private, max-age=0, no-cache, no-store"),
    );

    Ok(response)
}
