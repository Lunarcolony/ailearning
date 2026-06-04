from fastapi import APIRouter

router = APIRouter(prefix="/papers", tags=["papers"])


@router.get("/{paper_id}")
def get_paper(paper_id: int) -> dict:
    return {
        "id": paper_id,
        "title": f"Paper {paper_id}",
        "legal_access": {
            "status": "open_access",
            "best_link": "https://example.org/paper.pdf",
        },
    }


@router.get("/{paper_id}/related")
def related_papers(paper_id: int) -> dict:
    return {"paper_id": paper_id, "related": [paper_id + 1, paper_id + 2]}


@router.get("/{paper_id}/journey")
def citation_journey(paper_id: int) -> dict:
    return {
        "paper_id": paper_id,
        "timeline": {
            "foundational": [1, 2],
            "intermediate": [3, 4],
            "follow_up": [5, 6],
            "latest": [7, 8],
        },
    }


@router.get("/{paper_id}/rabbit-hole")
def rabbit_hole(paper_id: int) -> dict:
    return {
        "paper_id": paper_id,
        "neighbors": {
            "cites": [9, 10],
            "cited_by": [11, 12],
            "similar": [13, 14],
            "adjacent_fields": [15],
        },
    }
