from typing import Any


def choose_best_access_link(candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    priority = {"oa_pdf": 0, "repository": 1, "arxiv": 2, "publisher": 3}
    ranked = sorted(candidates, key=lambda c: priority.get(c.get("link_type", "publisher"), 99))
    return ranked[0] if ranked else None
