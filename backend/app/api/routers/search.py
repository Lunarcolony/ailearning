from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.services.search import SearchResponse, keyword_search, semantic_search

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def search(q: str = Query(min_length=2)) -> SearchResponse:
    return keyword_search(q)


class SemanticQuery(BaseModel):
    query: str


@router.post("/semantic", response_model=SearchResponse)
def semantic(payload: SemanticQuery) -> SearchResponse:
    return semantic_search(payload.query)
