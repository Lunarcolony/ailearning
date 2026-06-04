from fastapi import APIRouter

from app.schemas.feed import FeedResponse
from app.services.recommendations import build_feed

router = APIRouter(prefix="/feeds", tags=["feeds"])


@router.get("/personalized", response_model=FeedResponse)
def personalized_feed() -> FeedResponse:
    return build_feed("personalized")


@router.get("/{feed_type}", response_model=FeedResponse)
def named_feed(feed_type: str) -> FeedResponse:
    return build_feed(feed_type)
