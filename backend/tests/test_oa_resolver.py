from app.services.oa_resolver import choose_best_access_link


def test_choose_best_access_link_prefers_oa_pdf():
    link = choose_best_access_link(
        [
            {"link_type": "publisher", "url": "https://publisher"},
            {"link_type": "oa_pdf", "url": "https://oa"},
        ]
    )
    assert link
    assert link["link_type"] == "oa_pdf"
