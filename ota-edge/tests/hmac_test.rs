use ota_edge::utils::hmac::{
    decode_asset_key, encode_asset_key, sign_asset_key, verify_asset_authorization,
};

#[test]
fn test_encode_decode_asset_key() {
    let key = "bundles/android-1.0.0-hash123.js";
    let encoded = encode_asset_key(key);
    let decoded = decode_asset_key(&encoded).expect("Decode should succeed");
    assert_eq!(key, decoded);
}

#[test]
fn test_valid_hmac_authorization() {
    let secret = "my_super_secret_ota_key";
    let key = "assets/image.png";
    let expires = 2_000_000_000; // Far in the future
    let header = sign_asset_key(key, expires, secret);

    let res = verify_asset_authorization(key, Some(&header), Some(secret));
    assert!(res.is_ok());
}

#[test]
fn test_expired_hmac_authorization() {
    let secret = "my_super_secret_ota_key";
    let key = "assets/image.png";
    let expires = 1_000_000; // Past
    let header = sign_asset_key(key, expires, secret);

    let res = verify_asset_authorization(key, Some(&header), Some(secret));
    assert_eq!(res, Err("Authorization token expired"));
}

#[test]
fn test_tampered_hmac_signature() {
    let secret = "my_super_secret_ota_key";
    let key = "assets/image.png";
    let expires = 2_000_000_000;
    let header = sign_asset_key(key, expires, secret);
    let tampered_header = format!("{}tampered", header);

    let res = verify_asset_authorization(key, Some(&tampered_header), Some(secret));
    assert_eq!(res, Err("Invalid authorization signature"));
}

#[test]
fn test_different_asset_key() {
    let secret = "my_super_secret_ota_key";
    let key1 = "assets/image1.png";
    let key2 = "assets/image2.png";
    let expires = 2_000_000_000;
    let header = sign_asset_key(key1, expires, secret);

    let res = verify_asset_authorization(key2, Some(&header), Some(secret));
    assert_eq!(res, Err("Invalid authorization signature"));
}

