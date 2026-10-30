use axum::{
    extract::{Path, State},
    http::{HeaderMap, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
};
use chrono::Utc;
use serde_json::json;
use std::sync::Arc;
use tracing::{info, warn};

use crate::cache::CachedManifest;
use crate::db::queries;
use crate::utils::hmac::{encode_asset_key, sign_asset_key};
use crate::utils::multipart::{build_manifest_multipart, build_rollback_multipart};
use crate::AppState;

fn compute_rollout_bucket(client_id: &str, update_id: &str) -> u32 {
    let seed = format!("{}:{}", client_id, update_id);
    let mut hash_val: u32 = 0;
    for b in seed.bytes() {
        hash_val = hash_val.wrapping_mul(31).wrapping_add(b as u32);
    }
    hash_val % 100
}

fn get_header_str<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    headers.get(name).and_then(|h| h.to_str().ok())
}

pub async fn get_manifest(
    Path(app_id): Path<String>,
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response, (StatusCode, String)> {
    let runtime_version = match get_header_str(&headers, "expo-runtime-version") {
        Some(v) => v,
        None => {
            return Err((
                StatusCode::BAD_REQUEST,
                "Missing required header: expo-runtime-version".to_string(),
            ));
        }
    };

    let platform = match get_header_str(&headers, "expo-platform") {
        Some(p) => p,
        None => {
            return Err((
                StatusCode::BAD_REQUEST,
                "Missing required header: expo-platform".to_string(),
            ));
        }
    };

    let expo_project_id = get_header_str(&headers, "expo-project-id");
    let target_app_id = if app_id == "app" && expo_project_id.is_some() {
        expo_project_id.unwrap()
    } else {
        &app_id
    };

    let channel_name = match get_header_str(&headers, "expo-channel-name") {
        Some(c) if !c.is_empty() && c != "default" => c,
        _ => "production",
    };

    let current_update_id = get_header_str(&headers, "expo-current-update-id");
    let embedded_update_id = get_header_str(&headers, "expo-embedded-update-id");
    let eas_client_id = get_header_str(&headers, "eas-client-id");
    let expo_client_id = get_header_str(&headers, "expo-client-id");
    let expo_device_id = get_header_str(&headers, "expo-device-id");

    let client_identifier = eas_client_id
        .or(expo_client_id)
        .or(expo_device_id)
        .unwrap_or("anon-client");

    info!(
        "Received update request — appId: {}, runtime: {}, platform: {}, channel: {}",
        target_app_id, runtime_version, platform, channel_name
    );

    // Reconstruct baseUrl from Host and X-Forwarded-Proto
    let proto = get_header_str(&headers, "x-forwarded-proto")
        .and_then(|p| p.split(',').next())
        .map(|s| s.trim())
        .unwrap_or("http");
    let host = get_header_str(&headers, "host");
    let base_url = host.map(|h| format!("{}://{}", proto, h));

    // 1. Check cache for manifest
    let cache_key = format!(
        "manifest:{}:{}:{}:{}",
        target_app_id, runtime_version, platform, channel_name
    );

    // Fetch eligible updates from DB
    let eligible_updates = queries::find_eligible_updates(
        &state.pool,
        target_app_id,
        runtime_version,
        platform,
        channel_name,
        5,
    )
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {}", e),
        )
    })?;

    if eligible_updates.is_empty() {
        if let Some(curr_id) = current_update_id {
            if queries::is_update_rolled_back(&state.pool, curr_id)
                .await
                .unwrap_or(false)
            {
                info!("Client running rolled back update {}, sending rollback directive", curr_id);
                let (boundary, body) = build_rollback_multipart();
                return Ok(build_multipart_response(boundary, body));
            }
        }

        warn!(
            "No update found for app: {}, runtime: {}, platform: {}, channel: {}",
            target_app_id, runtime_version, platform, channel_name
        );
        return Err((
            StatusCode::NOT_FOUND,
            "No update found for this runtime version and platform".to_string(),
        ));
    }

    // 2. Progressive rollout logic
    let mut latest_update = &eligible_updates[0];
    let rollout = latest_update.rollout_percentage;

    if rollout < 100 {
        let bucket = compute_rollout_bucket(client_identifier, &latest_update.id);
        if bucket as i32 >= rollout {
            if let Some(fallback) = eligible_updates.iter().skip(1).find(|u| u.rollout_percentage >= 100) {
                latest_update = fallback;
            }
        }
    }

    let latest_id_lower = latest_update.id.to_lowercase();

    // 3. Check if client is already up-to-date (204 No Content)
    if current_update_id.map(|s| s.to_lowercase()) == Some(latest_id_lower.clone())
        || embedded_update_id.map(|s| s.to_lowercase()) == Some(latest_id_lower.clone())
    {
        info!("Client already up-to-date: {}", latest_update.id);
        let pool = state.pool.clone();
        let uid = latest_update.id.clone();
        let cid = client_identifier.to_string();
        let plt = platform.to_string();
        tokio::spawn(async move {
            let _ = queries::record_device_installation(&pool, &cid, &uid, &plt).await;
        });
        return Ok(StatusCode::NO_CONTENT.into_response());
    }

    // 4. Duplicate request suppression within dedup window
    if let Some(client_id) = eas_client_id {
        if !state.cache.claim_delivery(client_id, &latest_update.id).await {
            info!("Duplicate manifest request suppressed for client {}", client_id);
            return Ok(StatusCode::NO_CONTENT.into_response());
        }
    }

    // 5. Build or retrieve manifest from in-memory cache
    if let Some(cached) = state.cache.get_manifest(&cache_key).await {
        if cached.manifest_id == latest_update.id {
            // Spawn background metrics
            record_metrics(&state, &latest_update.id, client_identifier, platform);
            return Ok(build_multipart_response(cached.boundary, cached.body_bytes));
        }
    }

    // Retrieve assets for this update
    let assets = queries::find_assets_for_update(&state.pool, &latest_update.id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to load assets: {}", e)))?;

    let launch_asset = match assets.iter().find(|a| a.is_launch_asset) {
        Some(a) => a,
        None => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Update {} has no launch asset", latest_update.id),
            ));
        }
    };
    let other_assets: Vec<_> = assets.iter().filter(|a| !a.is_launch_asset).collect();

    let should_sign_assets = state.config.ota_asset_hmac_secret.is_some() && base_url.is_some();
    let expires_at_seconds = Utc::now().timestamp() as u64 + 15 * 60; // 15 mins
    let mut asset_request_headers = serde_json::Map::new();

    let get_effective_key = |key: &str| -> String {
        if platform == "ios" {
            key.split('/').last().unwrap_or(key).to_string()
        } else {
            key.to_string()
        }
    };

    let get_asset_url = |key: &str| -> String {
        if should_sign_assets {
            let encoded = encode_asset_key(key);
            format!("{}/api/assets/{}", base_url.as_ref().unwrap().trim_end_matches('/'), encoded)
        } else {
            format!("{}/{}/{}", state.config.minio_base_url(), state.config.minio_bucket, key)
        }
    };

    if let Some(ref secret) = state.config.ota_asset_hmac_secret {
        if should_sign_assets {
            let auth = sign_asset_key(&launch_asset.key, expires_at_seconds, secret);
            asset_request_headers.insert(
                get_effective_key(&launch_asset.key),
                json!({ "authorization": auth }),
            );
            for asset in &other_assets {
                let auth = sign_asset_key(&asset.key, expires_at_seconds, secret);
                asset_request_headers.insert(
                    get_effective_key(&asset.key),
                    json!({ "authorization": auth }),
                );
            }
        }
    }

    let manifest_json = json!({
        "id": latest_update.id,
        "createdAt": latest_update.created_at.and_utc().to_rfc3339(),
        "runtimeVersion": latest_update.runtime_version,
        "launchAsset": {
            "hash": launch_asset.hash,
            "key": get_effective_key(&launch_asset.key),
            "contentType": launch_asset.content_type,
            "url": get_asset_url(&launch_asset.key),
            "fileExtension": launch_asset.file_extension.as_deref().unwrap_or(".js"),
        },
        "assets": other_assets.iter().map(|a| {
            let mut obj = json!({
                "hash": a.hash,
                "key": get_effective_key(&a.key),
                "contentType": a.content_type,
                "url": get_asset_url(&a.key),
            });
            if let Some(ref ext) = a.file_extension {
                obj["fileExtension"] = json!(ext);
            }
            obj
        }).collect::<Vec<_>>(),
        "metadata": {},
        "extra": {
            "expoClient": {
                "name": target_app_id,
                "slug": target_app_id,
                "scheme": latest_update.app_scheme.as_deref().unwrap_or(&target_app_id.to_lowercase()),
                "version": latest_update.metadata.as_ref().and_then(|m| m.get("version").or_else(|| m.get("expoClient")?.get("version"))),
                "runtimeVersion": latest_update.runtime_version,
                "platform": platform,
            }
        }
    });

    let extensions_json = json!({
        "assetRequestHeaders": asset_request_headers
    });

    let (boundary, body_bytes) = build_manifest_multipart(&manifest_json, Some(&extensions_json));

    // Cache the response
    state.cache.set_manifest(
        cache_key,
        CachedManifest {
            manifest_id: latest_update.id.clone(),
            boundary: boundary.clone(),
            body_bytes: body_bytes.clone(),
        },
    ).await;

    // Record metrics
    record_metrics(&state, &latest_update.id, client_identifier, platform);

    Ok(build_multipart_response(boundary, body_bytes))
}

fn record_metrics(state: &Arc<AppState>, update_id: &str, client_id: &str, platform: &str) {
    let pool = state.pool.clone();
    let uid = update_id.to_string();
    let cid = client_id.to_string();
    let plt = platform.to_string();
    tokio::spawn(async move {
        let _ = queries::increment_download_count(&pool, &uid).await;
        let _ = queries::record_device_installation(&pool, &cid, &uid, &plt).await;
    });
}

fn build_multipart_response(boundary: String, body_bytes: Vec<u8>) -> Response {
    let mut res = Response::new(body_bytes.into());
    let headers = res.headers_mut();
    headers.insert("expo-protocol-version", HeaderValue::from_static("1"));
    headers.insert("expo-sfv-version", HeaderValue::from_static("0"));
    headers.insert("expo-manifest-filters", HeaderValue::from_static("[]"));
    headers.insert(
        "cache-control",
        HeaderValue::from_static("private, no-cache, no-store"),
    );

    let content_type = format!("multipart/mixed; boundary={}", boundary);
    if let Ok(val) = HeaderValue::from_str(&content_type) {
        headers.insert("content-type", val);
    }

    res
}
