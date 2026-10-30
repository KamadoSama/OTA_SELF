use moka::future::Cache;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CachedManifest {
    pub manifest_id: String,
    pub boundary: String,
    pub body_bytes: Vec<u8>,
}

#[derive(Clone)]
pub struct AppCache {
    pub manifest_cache: Cache<String, CachedManifest>,
    pub dedup_cache: Cache<String, bool>,
}

impl AppCache {
    pub fn new() -> Self {
        let manifest_cache = Cache::builder()
            .max_capacity(10_000)
            .time_to_live(Duration::from_secs(30))
            .build();

        let dedup_cache = Cache::builder()
            .max_capacity(50_000)
            .time_to_live(Duration::from_secs(60))
            .build();

        Self {
            manifest_cache,
            dedup_cache,
        }
    }

    pub async fn get_manifest(&self, key: &str) -> Option<CachedManifest> {
        self.manifest_cache.get(key).await
    }

    pub async fn set_manifest(&self, key: String, val: CachedManifest) {
        self.manifest_cache.insert(key, val).await;
    }

    pub async fn claim_delivery(&self, client_id: &str, update_id: &str) -> bool {
        let key = format!("{}:{}", client_id, update_id);
        if self.dedup_cache.get(&key).await.is_some() {
            return false;
        }
        self.dedup_cache.insert(key, true).await;
        true
    }

    pub async fn clear_all(&self) {
        self.manifest_cache.invalidate_all();
    }
}

