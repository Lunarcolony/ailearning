# Ingestion Pipelines

## Sources
- OpenAlex (primary)
- Unpaywall, arXiv, PubMed, Crossref, Semantic Scholar free endpoints

## Stages
- fetch -> normalize -> deduplicate -> upsert -> enrich -> embed -> quality checks

## Dedup policy
1. DOI exact
2. OpenAlex ID
3. Fuzzy title-year fallback

## OA resolver policy
Priority: `oa_pdf` > `repository` > `arxiv` > `publisher`.
