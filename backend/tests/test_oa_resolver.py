import unittest

from app.services.oa_resolver import choose_best_access_link


class OAResolverTests(unittest.TestCase):
    def test_choose_best_access_link_prefers_oa_pdf(self) -> None:
        link = choose_best_access_link(
            [
                {"link_type": "publisher", "url": "https://publisher"},
                {"link_type": "oa_pdf", "url": "https://oa"},
            ]
        )
        self.assertIsNotNone(link)
        self.assertEqual(link["link_type"], "oa_pdf")


if __name__ == "__main__":
    unittest.main()
