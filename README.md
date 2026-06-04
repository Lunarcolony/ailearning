# Research Discovery Platform

Open-source research discovery platform focused on personalized discovery, learning, and organization of academic papers.

## Stack
- Frontend: Next.js + TypeScript + Tailwind + shadcn/ui-ready structure
- Backend: FastAPI + SQLAlchemy + PostgreSQL + pgvector
- Background jobs: Celery + Redis
- Local AI: Ollama
- Monitoring: Prometheus + Grafana

## Quick start
```bash
docker compose up -d --build
```

## Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

## Project structure
- `/frontend` Next.js application
- `/backend` FastAPI application + workers
- `/docs` PRD, architecture, schema, roadmap, and implementation docs
- `/deploy` monitoring configs
