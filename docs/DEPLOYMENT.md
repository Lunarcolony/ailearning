# Deployment Guide

## Local or VPS
```bash
docker compose up -d --build
```

## First run checklist
1. Start stack
2. Run database migrations (Alembic wiring next)
3. Seed topic taxonomy
4. Trigger initial OpenAlex ingestion job

## Recommended VPS baseline
- 4 vCPU
- 8-16 GB RAM
- SSD storage

## Production hardening
- Replace all default local credentials (database, Grafana admin, OAuth secrets) before deployment.
- Store secrets in environment variables or a secrets manager; do not commit them.
