# API Specification (v1)

## Auth
- `POST /v1/auth/oauth/{provider}/callback`
- `POST /v1/auth/refresh`

## Discovery
- `GET /v1/feeds/personalized`
- `GET /v1/feeds/{feed_type}` where `feed_type` includes trending/recent/classic/hidden-gems/emerging

## Search
- `GET /v1/search?q=...`
- `POST /v1/search/semantic`

## Papers
- `GET /v1/papers/{id}`
- `GET /v1/papers/{id}/related`
- `GET /v1/papers/{id}/journey`
- `GET /v1/papers/{id}/rabbit-hole`

## Library
- `POST /v1/bookmarks`
- `GET /v1/collections`
- `GET /v1/notes`
- `GET /v1/saved-searches`

## Events
- `POST /v1/events`

## AI
- `POST /v1/ai/papers/{id}/summary`
- `POST /v1/ai/papers/{id}/explain`
- `POST /v1/ai/topics/{topic}/learn-path`
