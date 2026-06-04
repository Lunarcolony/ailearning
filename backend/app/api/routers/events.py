from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["events"])


class EventPayload(BaseModel):
    event_type: str
    paper_id: int | None = None
    topic_id: int | None = None
    payload: dict | None = None


@router.post("/events")
def log_event(body: EventPayload) -> dict:
    return {"status": "accepted", "event_type": body.event_type, "ts": datetime.utcnow().isoformat()}
