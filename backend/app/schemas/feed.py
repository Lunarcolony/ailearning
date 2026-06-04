from pydantic import BaseModel


class FeedItem(BaseModel):
    paper_id: int
    title: str
    reason_code: str
    reason_text: str
    score: float


class FeedResponse(BaseModel):
    feed_type: str
    items: list[FeedItem]
