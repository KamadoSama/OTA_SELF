use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use subtle::ConstantTimeEq;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

pub fn encode_asset_key(asset_key: &str) -> String {
    URL_SAFE_NO_PAD.encode(asset_key.as_bytes())
}

pub fn decode_asset_key(encoded_key: &str) -> Result<String, String> {
    let bytes = URL_SAFE_NO_PAD
        .decode(encoded_key.as_bytes())
        .map_err(|e| format!("Base64url decode error: {}", e))?;
    String::from_utf8(bytes).map_err(|e| format!("UTF-8 decode error: {}", e))
}

pub fn sign_asset_key(asset_key: &str, expires_at_seconds: u64, secret: &str) -> String {
    let payload = format!("{}:{}", asset_key, expires_at_seconds);
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes())
        .expect("HMAC can take key of any size");
    mac.update(payload.as_bytes());
    let signature = URL_SAFE_NO_PAD.encode(mac.finalize().into_bytes());
    format!("OTA-HMAC-SHA256 {}-{}", expires_at_seconds, signature)
}

pub fn verify_asset_authorization(
    asset_key: &str,
    authorization_header: Option<&str>,
    secret_opt: Option<&str>,
) -> Result<(), &'static str> {
    let secret = match secret_opt {
        Some(s) if !s.is_empty() => s,
        _ => return Ok(()), // If no secret configured, signing is not required
    };

    let auth_header = match authorization_header {
        Some(h) => h.trim(),
        None => return Err("Missing authorization header"),
    };

    let mut parts = auth_header.splitn(2, ' ');
    let scheme = parts.next().unwrap_or("");
    let token = match parts.next() {
        Some(t) => t,
        None => return Err("Invalid authorization header format"),
    };

    if scheme != "OTA-HMAC-SHA256" {
        return Err("Invalid authorization scheme");
    }

    let dash_index = match token.find('-') {
        Some(idx) => idx,
        None => return Err("Invalid authorization token format"),
    };

    let (expires_raw, signature) = token.split_at(dash_index);
    let signature = &signature[1..]; // skip the '-'

    let expires_at_seconds: u64 = match expires_raw.parse() {
        Ok(v) => v,
        Err(_) => return Err("Invalid expiration timestamp"),
    };

    let now_seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    // 30 seconds clock skew tolerance
    if expires_at_seconds < now_seconds.saturating_sub(30) {
        return Err("Authorization token expired");
    }

    let payload = format!("{}:{}", asset_key, expires_at_seconds);
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes())
        .expect("HMAC can take key of any size");
    mac.update(payload.as_bytes());
    let expected_sig = URL_SAFE_NO_PAD.encode(mac.finalize().into_bytes());

    if signature.as_bytes().ct_eq(expected_sig.as_bytes()).into() {
        Ok(())
    } else {
        Err("Invalid authorization signature")
    }
}

