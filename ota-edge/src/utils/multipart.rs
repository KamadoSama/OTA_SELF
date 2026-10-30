use chrono::Utc;
use rand::{distributions::Alphanumeric, Rng};
use serde_json::json;

pub fn generate_boundary() -> String {
    let random_suffix: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(16)
        .map(char::from)
        .collect();
    format!("ExpoManifestBoundary{}", random_suffix)
}

pub fn build_manifest_multipart(
    manifest: &serde_json::Value,
    extensions: Option<&serde_json::Value>,
) -> (String, Vec<u8>) {
    let boundary = generate_boundary();
    let empty_obj = json!({});
    let ext = extensions.unwrap_or(&empty_obj);

    let manifest_str = serde_json::to_string(manifest).unwrap_or_else(|_| "{}".to_string());
    let extensions_str = serde_json::to_string(ext).unwrap_or_else(|_| "{}".to_string());

    let multipart_body = format!(
        "--{boundary}\r\n\
         Content-Disposition: form-data; name=\"manifest\"\r\n\
         Content-Type: application/json; charset=utf-8\r\n\r\n\
         {manifest_str}\r\n\
         --{boundary}\r\n\
         Content-Disposition: form-data; name=\"extensions\"\r\n\
         Content-Type: application/json; charset=utf-8\r\n\r\n\
         {extensions_str}\r\n\
         --{boundary}--\r\n",
        boundary = boundary,
        manifest_str = manifest_str,
        extensions_str = extensions_str,
    );

    (boundary, multipart_body.into_bytes())
}

pub fn build_rollback_multipart() -> (String, Vec<u8>) {
    let boundary = generate_boundary();
    let directive = json!({
        "type": "rollBackToEmbedded",
        "parameters": {
            "commitTime": Utc::now().to_rfc3339()
        }
    });

    let directive_str = serde_json::to_string(&directive).unwrap_or_else(|_| "{}".to_string());

    let multipart_body = format!(
        "--{boundary}\r\n\
         Content-Disposition: form-data; name=\"directive\"\r\n\
         Content-Type: application/json; charset=utf-8\r\n\r\n\
         {directive_str}\r\n\
         --{boundary}--\r\n",
        boundary = boundary,
        directive_str = directive_str,
    );

    (boundary, multipart_body.into_bytes())
}

