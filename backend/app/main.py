from fastapi import FastAPI
from prometheus_client import make_asgi_app

from app.api.routers import ai, auth, events, feeds, health, library, papers, search
from app.core.config import settings

app = FastAPI(title=settings.app_name)
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

app.include_router(health.router)
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(feeds.router, prefix=settings.api_prefix)
app.include_router(search.router, prefix=settings.api_prefix)
app.include_router(papers.router, prefix=settings.api_prefix)
app.include_router(library.router, prefix=settings.api_prefix)
app.include_router(ai.router, prefix=settings.api_prefix)
app.include_router(events.router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Research Discovery API", "docs": "/docs"}
