from celery import Celery

from app.core.config import settings

celery_app = Celery("research_discovery", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.task_routes = {
    "app.workers.tasks.ingest_openalex": {"queue": "ingestion"},
    "app.workers.tasks.refresh_recommendations": {"queue": "recommendations"},
}
