# Kubernetes (stub)

Manifests mínimos para evolução pós-piloto. **Compose permanece o caminho oficial em dev** (RFN-020).

1. `kubectl apply -f namespace.yaml`
2. Criar `Secret`/`ConfigMap` a partir de `.env.example` (nunca aplicar secrets reais versionados)
3. Aplicar `api-deployment.yaml`, `web-deployment.yaml`
4. StatefulSets ou operadores para Postgres/MinIO/RabbitMQ conforme política COMGAP
