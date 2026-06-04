# Technical Architecture

## Runtime
- Docker Compose deployment
- Single-node VPS compatible
- Monolith-first backend + worker

## Components
- Frontend: Next.js app router
- API: FastAPI with `/v1` endpoints
- DB: PostgreSQL + pgvector
- Queue: Redis + Celery
- AI: Ollama local inference
- Monitoring: Prometheus + Grafana

## Data flow
1. Ingestion jobs pull OpenAlex and free source metadata.
2. Metadata normalized and stored in Postgres.
3. Embeddings generated locally and stored in pgvector.
4. Recommendation jobs produce per-user feed candidates.
5. API serves feeds/search/library with reason explanations.
