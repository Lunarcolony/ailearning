from app.workers.celery_app import celery_app


@celery_app.task
def ingest_openalex() -> dict[str, str]:
    return {"status": "queued", "source": "openalex"}


@celery_app.task
def refresh_recommendations() -> dict[str, str]:
    return {"status": "queued", "job": "recommendations"}
