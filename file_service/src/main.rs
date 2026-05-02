use std::{
    net::SocketAddr,
    path::{Component, Path, PathBuf},
    sync::Arc,
};

use axum::{
    Json, Router,
    body::Body,
    extract::{DefaultBodyLimit, FromRef, FromRequestParts, Multipart, Path as AxumPath, State},
    http::{StatusCode, header, request::Parts},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tokio::{
    fs::{self, File},
    io::{AsyncReadExt, AsyncSeekExt, AsyncWriteExt, SeekFrom},
};
use tokio_util::io::ReaderStream;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Clone)]
struct AppState {
    config: Arc<Config>,
}

#[derive(Clone, Deserialize)]
struct Config {
    server: ServerConfig,
    storage: StorageConfig,
    auth: AuthConfig,
}

#[derive(Clone, Deserialize)]
struct ServerConfig {
    host: String,
    port: u16,
    max_upload_bytes: usize,
}

#[derive(Clone, Deserialize)]
struct StorageConfig {
    root_dir: PathBuf,
}

#[derive(Clone, Deserialize)]
struct AuthConfig {
    api_key: String,
}

#[derive(Serialize)]
struct UploadResponse {
    filename: String,
    size: u64,
    download_url: String,
    stream_url: String,
}

#[derive(Serialize)]
struct MediaItem {
    filename: String,
    size: u64,
    content_type: String,
    download_url: String,
    stream_url: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

struct ApiKey;

impl FromRef<AppState> for Arc<Config> {
    fn from_ref(state: &AppState) -> Self {
        state.config.clone()
    }
}

impl FromRequestParts<AppState> for ApiKey {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let expected = &state.config.auth.api_key;
        let provided = parts
            .headers
            .get("x-api-key")
            .and_then(|value| value.to_str().ok())
            .or_else(|| {
                parts
                    .headers
                    .get(header::AUTHORIZATION)
                    .and_then(|value| value.to_str().ok())
                    .and_then(|value| value.strip_prefix("Bearer "))
            });

        match provided {
            Some(value) if value == expected => Ok(ApiKey),
            _ => Err(AppError::unauthorized("missing or invalid API key")),
        }
    }
}

#[derive(Debug)]
struct AppError {
    status: StatusCode,
    message: String,
}

impl AppError {
    fn bad_request(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            message: message.into(),
        }
    }

    fn unauthorized(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::UNAUTHORIZED,
            message: message.into(),
        }
    }

    fn not_found(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: message.into(),
        }
    }

    fn internal(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: message.into(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            self.status,
            Json(ErrorResponse {
                error: self.message,
            }),
        )
            .into_response()
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "file_service=info,tower_http=info".into()),
        )
        .init();

    let config = match load_config().await{
        Ok(config) => config,
        Err(err) => {
            eprintln!("failed to load config: {}", err);
            std::process::exit(1);
        }
    };
    fs::create_dir_all(&config.storage.root_dir).await?;

    let addr: SocketAddr = format!("{}:{}", config.server.host, config.server.port).parse()?;
    let state = AppState {
        config: Arc::new(config),
    };

    let app = Router::new()
        .route("/health", get(health))
        .route("/media", get(list_media))
        .route("/upload", post(upload_file))
        .route("/files/{filename}", get(download_file))
        .route("/stream/{filename}", get(stream_file))
        .layer(DefaultBodyLimit::max(state.config.server.max_upload_bytes))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    println!("file_service listening on http://{addr}");
    axum::serve(listener, app).await?;

    Ok(())
}

async fn load_config() -> anyhow::Result<Config> {
    let config_path = std::env::var("SHEEP_CONFIG").unwrap_or_else(|_| "sheep.toml".to_string());
    let raw = fs::read_to_string(&config_path).await?;
    let mut config: Config = toml::from_str(&raw)?;

    if config.auth.api_key.trim().is_empty() {
        anyhow::bail!("auth.api_key in {config_path} must not be empty");
    }

    if config.storage.root_dir.is_relative() {
        config.storage.root_dir = std::env::current_dir()?.join(&config.storage.root_dir);
    }

    Ok(config)
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

async fn upload_file(
    _api_key: ApiKey,
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, AppError> {
    let mut uploaded = None;

    while let Some(mut field) = multipart
        .next_field()
        .await
        .map_err(|err| AppError::bad_request(format!("invalid multipart body: {err}")))?
    {
        if field.name() != Some("file") {
            continue;
        }

        let filename = field
            .file_name()
            .map(sanitize_filename)
            .transpose()?
            .ok_or_else(|| AppError::bad_request("file part must include a filename"))?;
        let path = storage_path(&state.config.storage.root_dir, &filename)?;
        let mut file = File::create(&path)
            .await
            .map_err(|err| AppError::internal(format!("failed to create file: {err}")))?;
        let mut size = 0_u64;

        while let Some(chunk) = field
            .chunk()
            .await
            .map_err(|err| AppError::bad_request(format!("failed to read upload chunk: {err}")))?
        {
            size += chunk.len() as u64;
            file.write_all(&chunk)
                .await
                .map_err(|err| AppError::internal(format!("failed to write file: {err}")))?;
        }

        uploaded = Some(UploadResponse {
            filename: filename.clone(),
            size,
            download_url: format!("/files/{filename}"),
            stream_url: format!("/stream/{filename}"),
        });
        break;
    }

    uploaded.map(Json).ok_or_else(|| {
        AppError::bad_request("multipart body must contain a file field named `file`")
    })
}

async fn list_media(
    _api_key: ApiKey,
    State(state): State<AppState>,
) -> Result<Json<Vec<MediaItem>>, AppError> {
    let mut entries = fs::read_dir(&state.config.storage.root_dir)
        .await
        .map_err(|err| AppError::internal(format!("failed to read media directory: {err}")))?;
    let mut media = Vec::new();

    while let Some(entry) = entries
        .next_entry()
        .await
        .map_err(|err| AppError::internal(format!("failed to read media entry: {err}")))?
    {
        let metadata = entry
            .metadata()
            .await
            .map_err(|err| AppError::internal(format!("failed to read media metadata: {err}")))?;

        if !metadata.is_file() {
            continue;
        }

        let filename = entry.file_name().to_string_lossy().to_string();
        media.push(MediaItem {
            content_type: mime_guess::from_path(&filename)
                .first_or_octet_stream()
                .to_string(),
            download_url: format!("/files/{filename}"),
            stream_url: format!("/stream/{filename}"),
            filename,
            size: metadata.len(),
        });
    }

    Ok(Json(media))
}

async fn download_file(
    _api_key: ApiKey,
    State(state): State<AppState>,
    AxumPath(filename): AxumPath<String>,
) -> Result<Response, AppError> {
    let path = storage_path(
        &state.config.storage.root_dir,
        &sanitize_filename(&filename)?,
    )?;
    let file = File::open(&path)
        .await
        .map_err(|_| AppError::not_found("file not found"))?;
    let content_type = mime_guess::from_path(&path)
        .first_or_octet_stream()
        .to_string();
    let stream = ReaderStream::new(file);
    let body = Body::from_stream(stream);

    Ok((
        [
            (header::CONTENT_TYPE, content_type),
            (
                header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"{}\"", filename.replace('"', "")),
            ),
        ],
        body,
    )
        .into_response())
}

async fn stream_file(
    _api_key: ApiKey,
    State(state): State<AppState>,
    AxumPath(filename): AxumPath<String>,
    headers: axum::http::HeaderMap,
) -> Result<Response, AppError> {
    let path = storage_path(
        &state.config.storage.root_dir,
        &sanitize_filename(&filename)?,
    )?;
    let mut file = File::open(&path)
        .await
        .map_err(|_| AppError::not_found("file not found"))?;
    let metadata = file
        .metadata()
        .await
        .map_err(|err| AppError::internal(format!("failed to read file metadata: {err}")))?;
    let file_size = metadata.len();
    let content_type = mime_guess::from_path(&path)
        .first_or_octet_stream()
        .to_string();

    if let Some(range_header) = headers
        .get(header::RANGE)
        .and_then(|value| value.to_str().ok())
    {
        let (start, end) = parse_range(range_header, file_size)?;
        file.seek(SeekFrom::Start(start))
            .await
            .map_err(|err| AppError::internal(format!("failed to seek file: {err}")))?;
        let length = end - start + 1;
        let stream = ReaderStream::new(file.take(length));
        let body = Body::from_stream(stream);

        return Ok((
            StatusCode::PARTIAL_CONTENT,
            [
                (header::CONTENT_TYPE, content_type),
                (header::ACCEPT_RANGES, "bytes".to_string()),
                (header::CONTENT_LENGTH, length.to_string()),
                (
                    header::CONTENT_RANGE,
                    format!("bytes {start}-{end}/{file_size}"),
                ),
            ],
            body,
        )
            .into_response());
    }

    let stream = ReaderStream::new(file);
    let body = Body::from_stream(stream);

    Ok((
        [
            (header::CONTENT_TYPE, content_type),
            (header::ACCEPT_RANGES, "bytes".to_string()),
            (header::CONTENT_LENGTH, file_size.to_string()),
        ],
        body,
    )
        .into_response())
}

fn sanitize_filename(filename: &str) -> Result<String, AppError> {
    let path = Path::new(filename);
    let mut parts = Vec::new();

    for component in path.components() {
        match component {
            Component::Normal(part) => parts.push(part.to_string_lossy().to_string()),
            _ => {
                return Err(AppError::bad_request(
                    "filename contains invalid path components",
                ));
            }
        }
    }

    let sanitized = parts.join("_");
    if sanitized.is_empty() || sanitized == "." || sanitized == ".." {
        return Err(AppError::bad_request("filename must not be empty"));
    }

    Ok(sanitized)
}

fn storage_path(root: &Path, filename: &str) -> Result<PathBuf, AppError> {
    let filename = sanitize_filename(filename)?;
    Ok(root.join(filename))
}

fn parse_range(range_header: &str, file_size: u64) -> Result<(u64, u64), AppError> {
    if file_size == 0 {
        return Err(AppError::bad_request(
            "cannot stream an empty file with range requests",
        ));
    }

    let range = range_header
        .strip_prefix("bytes=")
        .ok_or_else(|| AppError::bad_request("only byte ranges are supported"))?;
    let (start, end) = range
        .split_once('-')
        .ok_or_else(|| AppError::bad_request("invalid range header"))?;

    let start = if start.is_empty() {
        let suffix = end
            .parse::<u64>()
            .map_err(|_| AppError::bad_request("invalid range suffix"))?;
        file_size.saturating_sub(suffix)
    } else {
        start
            .parse::<u64>()
            .map_err(|_| AppError::bad_request("invalid range start"))?
    };

    let end = if end.is_empty() {
        file_size - 1
    } else {
        end.parse::<u64>()
            .map_err(|_| AppError::bad_request("invalid range end"))?
            .min(file_size - 1)
    };

    if start > end || start >= file_size {
        return Err(AppError::bad_request("range is outside of the file"));
    }

    Ok((start, end))
}
