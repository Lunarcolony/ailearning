# Vector Search Implementation

## Models
- Default: local BGE/Nomic class embedding model through Ollama or local runner.

## Storage
- `embeddings` table with pgvector `Vector(768)`.
- Index strategy:
  - HNSW/IVFFlat by `entity_type`, `model_name`.

## Retrieval
- Hybrid retrieval pipeline:
  1. PostgreSQL FTS keyword retrieval
  2. Vector ANN retrieval
  3. Reciprocal Rank Fusion
  4. Reranking + explanation generation
