from pydantic import BaseModel


class SearchResult(BaseModel):
    paper_id: int
    title: str
    snippet: str
    score: float


class SearchResponse(BaseModel):
    query: str
    mode: str
    results: list[SearchResult]


def keyword_search(query: str) -> SearchResponse:
    return SearchResponse(
        query=query,
        mode="keyword",
        results=[
            SearchResult(
                paper_id=1,
                title=f"Keyword match for: {query}",
                snippet="Hybrid keyword search placeholder.",
                score=0.82,
            )
        ],
    )


def semantic_search(query: str) -> SearchResponse:
    return SearchResponse(
        query=query,
        mode="semantic",
        results=[
            SearchResult(
                paper_id=2,
                title=f"Semantic match for: {query}",
                snippet="Embedding retrieval placeholder.",
                score=0.89,
            )
        ],
    )
