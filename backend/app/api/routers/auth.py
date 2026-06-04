from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])


class OAuthCallback(BaseModel):
    code: str


@router.post("/oauth/{provider}/callback")
def oauth_callback(provider: str, body: OAuthCallback) -> dict:
    return {"provider": provider, "status": "stubbed", "code_received": bool(body.code)}


@router.post("/refresh")
def refresh_token() -> dict:
    return {"access_token": "stub-token", "token_type": "bearer"}
