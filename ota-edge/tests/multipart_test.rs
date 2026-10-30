use ota_edge::utils::multipart::{build_manifest_multipart, build_rollback_multipart};
use serde_json::json;

#[test]
fn test_build_manifest_multipart() {
    let manifest = json!({
        "id": "c138f679-b1d4-4bb8-932d-22fa973fb06f",
        "createdAt": "2026-10-30T10:00:00.000Z",
        "runtimeVersion": "1.0.0"
    });
    let extensions = json!({
        "expo": "test"
    });

    let (boundary, body) = build_manifest_multipart(&manifest, Some(&extensions));
    let body_str = String::from_utf8(body).expect("Should be valid utf-8");

    assert!(body_str.starts_with(&format!("--{}", boundary)));
    assert!(body_str.contains("Content-Disposition: form-data; name=\"manifest\""));
    assert!(body_str.contains("Content-Disposition: form-data; name=\"extensions\""));
    assert!(body_str.contains("c138f679-b1d4-4bb8-932d-22fa973fb06f"));
    assert!(body_str.ends_with(&format!("--{}--\r\n", boundary)));
}

#[test]
fn test_build_rollback_multipart() {
    let (boundary, body) = build_rollback_multipart();
    let body_str = String::from_utf8(body).expect("Should be valid utf-8");

    assert!(body_str.starts_with(&format!("--{}", boundary)));
    assert!(body_str.contains("Content-Disposition: form-data; name=\"directive\""));
    assert!(body_str.contains("\"rollBackToEmbedded\""));
    assert!(body_str.ends_with(&format!("--{}--\r\n", boundary)));
}

