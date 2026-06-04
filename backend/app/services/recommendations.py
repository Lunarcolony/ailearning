from app.schemas.feed import FeedItem, FeedResponse


DEFAULT_REASON = {
    "personalized": "Recommended from your recent reading and saves.",
    "trending": "Trending due to rapid recent citations and engagement.",
    "recent": "Recently published in topics you follow.",
    "classic": "Foundational highly cited work in this area.",
    "hidden-gems": "Strong quality signals with lower visibility.",
    "emerging": "Growing topic momentum with fresh activity.",
}


def build_feed(feed_type: str) -> FeedResponse:
    reason = DEFAULT_REASON.get(feed_type, "Recommended for discovery.")
    demo_items = [
        FeedItem(
            paper_id=i,
            title=f"Demo Paper {i} for {feed_type}",
            reason_code="DISCOVERY",
            reason_text=reason,
            score=1.0 - (i * 0.1),
        )
        for i in range(1, 6)
    ]
    return FeedResponse(feed_type=feed_type, items=demo_items)
