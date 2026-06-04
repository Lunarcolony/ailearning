from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])


class SummaryPayload(BaseModel):
    level: str = "quick"


@router.post("/papers/{paper_id}/summary")
def summarize_paper(paper_id: int, payload: SummaryPayload) -> dict:
    return {
        "paper_id": paper_id,
        "level": payload.level,
        "summary": "Local-model summary placeholder generated via Ollama runtime.",
    }


@router.post("/papers/{paper_id}/explain")
def explain_paper(paper_id: int) -> dict:
    return {
        "paper_id": paper_id,
        "explanation": "Beginner-friendly explanation placeholder with glossary output.",
    }


class LearnPathPayload(BaseModel):
    objective: str


@router.post("/topics/{topic}/learn-path")
def topic_path(topic: str, payload: LearnPathPayload) -> dict:
    return {
        "topic": topic,
        "objective": payload.objective,
        "sequence": ["intro", "foundational", "advanced", "latest"],
    }
