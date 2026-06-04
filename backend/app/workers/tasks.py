from app.workers.celery_app import app


@app.task
def ingest_openalex() -> dict[str, str]:
    return {"status": "queued", "source": "openalex"}


@app.task
def refresh_recommendations() -> dict[str, str]:
    return {"status": "queued", "job": "recommendations"}
