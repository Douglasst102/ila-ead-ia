# MinIO server — build local quando pull de minio/minio no Docker Hub falhar (rede/proxy).
FROM alpine:3.20
ARG MINIO_RELEASE=RELEASE.2024-12-18T13-15-44Z
RUN apk add --no-cache ca-certificates curl \
  && curl -fsSL "https://github.com/minio/minio/releases/download/${MINIO_RELEASE}/minio-linux-amd64" -o /usr/bin/minio \
  && chmod +x /usr/bin/minio \
  && apk del curl
VOLUME ["/data"]
EXPOSE 9000 9001
ENTRYPOINT ["/usr/bin/minio"]
