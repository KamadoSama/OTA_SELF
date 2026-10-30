use super::models::{AssetRow, EligibleUpdateRow};
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn find_eligible_updates(
    pool: &PgPool,
    app_id: &str,
    runtime_version: &str,
    platform: &str,
    channel_name: &str,
    limit: i64,
) -> Result<Vec<EligibleUpdateRow>, sqlx::Error> {
    let sql = r#"
        SELECT 
            u."id",
            u."channelId",
            u."runtimeVersion",
            u."platform",
            u."downloadCount",
            u."createdAt",
            u."metadata",
            u."rolloutPercentage",
            u."isRollback",
            c."name" as "channel_name",
            a."name" as "app_name",
            a."scheme" as "app_scheme"
        FROM "Update" u
        JOIN "Channel" c ON u."channelId" = c."id"
        JOIN "App" a ON c."appId" = a."id"
        WHERE u."runtimeVersion" = $1
          AND u."platform" = $2
          AND u."isRollback" = false
          AND c."name" = $3
          AND (a."name" = $4 OR a."id" = $4)
        ORDER BY u."createdAt" DESC
        LIMIT $5
    "#;

    sqlx::query_as::<_, EligibleUpdateRow>(sql)
        .bind(runtime_version)
        .bind(platform)
        .bind(channel_name)
        .bind(app_id)
        .bind(limit)
        .fetch_all(pool)
        .await
}

pub async fn find_assets_for_update(
    pool: &PgPool,
    update_id: &str,
) -> Result<Vec<AssetRow>, sqlx::Error> {
    let sql = r#"
        SELECT 
            "id",
            "updateId",
            "hash",
            "key",
            "contentType",
            "fileExtension",
            "isLaunchAsset"
        FROM "Asset"
        WHERE "updateId" = $1
    "#;

    sqlx::query_as::<_, AssetRow>(sql)
        .bind(update_id)
        .fetch_all(pool)
        .await
}

pub async fn is_update_rolled_back(pool: &PgPool, update_id: &str) -> Result<bool, sqlx::Error> {
    let sql = r#"
        SELECT "isRollback" 
        FROM "Update" 
        WHERE "id" = $1
    "#;

    let res: Option<(bool,)> = sqlx::query_as(sql)
        .bind(update_id)
        .fetch_optional(pool)
        .await?;

    Ok(res.map(|r| r.0).unwrap_or(false))
}

pub async fn increment_download_count(pool: &PgPool, update_id: &str) -> Result<(), sqlx::Error> {
    let sql = r#"
        UPDATE "Update"
        SET "downloadCount" = "downloadCount" + 1
        WHERE "id" = $1
    "#;

    sqlx::query(sql).bind(update_id).execute(pool).await?;
    Ok(())
}

pub async fn record_device_installation(
    pool: &PgPool,
    client_identifier: &str,
    update_id: &str,
    platform: &str,
) -> Result<(), sqlx::Error> {
    let mut hasher = Sha256::new();
    hasher.update(client_identifier.as_bytes());
    let device_id_hash = hex::encode(hasher.finalize());
    let new_id = Uuid::new_v4().to_string();
    let norm_platform = platform.to_lowercase();

    let sql = r#"
        INSERT INTO "DeviceInstallation" 
            ("id", "deviceId", "updateId", "platform", "installedAt", "lastSeenAt")
        VALUES 
            ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT ("deviceId", "updateId") 
        DO UPDATE SET "lastSeenAt" = NOW()
    "#;

    sqlx::query(sql)
        .bind(new_id)
        .bind(device_id_hash)
        .bind(update_id)
        .bind(norm_platform)
        .execute(pool)
        .await?;

    Ok(())
}

