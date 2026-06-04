from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["library"])


class BookmarkPayload(BaseModel):
    paper_id: int


@router.post("/bookmarks")
def create_bookmark(payload: BookmarkPayload) -> dict:
    return {"status": "saved", "paper_id": payload.paper_id}


@router.get("/collections")
def list_collections() -> dict:
    return {"items": []}


@router.get("/notes")
def list_notes() -> dict:
    return {"items": []}


@router.get("/saved-searches")
def list_saved_searches() -> dict:
    return {"items": []}
