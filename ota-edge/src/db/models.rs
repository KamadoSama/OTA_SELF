use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct AppRow {
    pub id: String,
    pub name: String,
    pub scheme: Option<String>,
}

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct EligibleUpdateRow {
    pub id: String,
    #[sqlx(rename = "channelId")]
    pub channel_id: String,
    #[sqlx(rename = "runtimeVersion")]
    pub runtime_version: String,
    pub platform: String,
    #[sqlx(rename = "downloadCount")]
    pub download_count: i32,
    #[sqlx(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    pub metadata: Option<serde_json::Value>,
    #[sqlx(rename = "rolloutPercentage")]
    pub rollout_percentage: i32,
    #[sqlx(rename = "isRollback")]
    pub is_rollback: bool,
    pub channel_name: String,
    pub app_name: String,
    pub app_scheme: Option<String>,
}

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct AssetRow {
    pub id: String,
    #[sqlx(rename = "updateId")]
    pub update_id: String,
    pub hash: String,
    pub key: String,
    #[sqlx(rename = "contentType")]
    pub content_type: String,
    #[sqlx(rename = "fileExtension")]
    pub file_extension: Option<String>,
    #[sqlx(rename = "isLaunchAsset")]
    pub is_launch_asset: bool,
}

