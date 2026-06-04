# Recommendation System Design

## Candidate generation
- Content similarity from embedding ANN
- Citation-neighbor expansion (co-citation + bibliographic coupling)
- Collaborative filtering from implicit events
- Popularity and citation-velocity candidates
- Recency candidates

## Ranking
Weighted blend of relevance, novelty, quality, recency, and diversity.

## Exploration policy
- 70% core-interest papers
- 20% adjacent-field papers
- 10% serendipitous papers

## Explainability
Each recommendation includes `reason_code` + `reason_text`.
