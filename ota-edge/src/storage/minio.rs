use reqwest::Client;

#[derive(Clone)]
pub struct MinioClient {
    client: Client,
    base_url: String,
    bucket: String,
}

impl MinioClient {
    pub fn new(endpoint: &str, port: u16, bucket: &str) -> Self {
        let base_url = format!("http://{}:{}", endpoint, port);
        Self {
            client: Client::builder()
                .pool_max_idle_per_host(50)
                .build()
                .expect("Failed to build HTTP client for MinIO"),
            base_url,
            bucket: bucket.to_string(),
        }
    }

    pub fn get_object_url(&self, object_key: &str) -> String {
        format!("{}/{}/{}", self.base_url, self.bucket, object_key)
    }

    pub async fn fetch_object_stream(&self, object_key: &str) -> Result<reqwest::Response, reqwest::Error> {
        let url = self.get_object_url(object_key);
        self.client.get(&url).send().await
    }
}

