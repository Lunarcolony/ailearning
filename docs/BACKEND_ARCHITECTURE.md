# Backend Architecture

## Module layout
- Routers: auth, feeds, search, papers, library, ai, events
- Services: recommendations, search, OA resolver
- Workers: ingestion and recommendation jobs
- Models: SQLAlchemy entity definitions

## API prefix
- Versioned under `/v1`
