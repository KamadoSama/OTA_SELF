# --- Stage 1: Build binary with Rust ---
FROM rust:slim AS builder
WORKDIR /app

# Pre-cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir -p src tests && \
    echo "fn main() {}" > src/main.rs && \
    echo "pub mod lib {}" > src/lib.rs && \
    echo "fn main() {}" > tests/dummy.rs && \
    cargo build --release || true && \
    rm -rf src tests

# Copy actual source code and build final binary
COPY . .
RUN cargo build --release --bin ota-edge

# --- Stage 2: Minimal runtime image (~30MB) ---
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/ota-edge /app/ota-edge

ENV EDGE_PORT=4002
EXPOSE 4002

CMD ["/app/ota-edge"]
