from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import uuid
import time

router = APIRouter()

# In-memory API key store — replace with DB in production
_api_keys: dict = {
    "acx_demo_key_free": {"plan": "free", "rate_limit": 100, "requests_today": 47, "owner": "demo"},
}

TIER_LIMITS = {
    "free": {"requests_per_day": 100, "endpoints": 5},
    "pro": {"requests_per_day": 5000, "endpoints": 25},
    "agency": {"requests_per_day": -1, "endpoints": 47},  # -1 = unlimited
}


class KeyCreateRequest(BaseModel):
    plan: str = "free"
    description: Optional[str] = None


@router.post("/keys/create")
async def create_api_key(req: KeyCreateRequest):
    """Generate a new API key for developer access."""
    if req.plan not in TIER_LIMITS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {req.plan}")

    key = f"acx_{uuid.uuid4().hex}"
    _api_keys[key] = {
        "plan": req.plan,
        "rate_limit": TIER_LIMITS[req.plan]["requests_per_day"],
        "requests_today": 0,
        "owner": "user",
        "description": req.description,
        "created_at": int(time.time()),
    }
    return {
        "api_key": key,
        "plan": req.plan,
        "rate_limit": TIER_LIMITS[req.plan]["requests_per_day"],
        "endpoints_available": TIER_LIMITS[req.plan]["endpoints"],
        "message": "Store this key securely — it won't be shown again.",
    }


@router.get("/keys/status")
async def get_key_status(x_api_key: Optional[str] = Header(None)):
    """Return usage stats for the provided API key."""
    if not x_api_key or x_api_key not in _api_keys:
        return {
            "plan": "free",
            "requests_today": 0,
            "rate_limit": 100,
            "endpoints_available": 5,
            "status": "demo_mode",
        }
    info = _api_keys[x_api_key]
    return {
        "plan": info["plan"],
        "requests_today": info["requests_today"],
        "rate_limit": info["rate_limit"],
        "endpoints_available": TIER_LIMITS[info["plan"]]["endpoints"],
        "status": "active",
    }


@router.get("/endpoints")
async def list_endpoints():
    """Return all available API endpoints with tier requirements."""
    return {
        "endpoints": [
            {"method": "POST", "path": "/api/seo/keywords", "description": "Keyword research + SERP", "tier": "free"},
            {"method": "POST", "path": "/api/yt/analyze", "description": "YouTube analysis", "tier": "free"},
            {"method": "POST", "path": "/api/ai/script", "description": "AI script generation", "tier": "pro"},
            {"method": "POST", "path": "/api/tt/trend-scan", "description": "TikTok trend scanner", "tier": "pro"},
            {"method": "POST", "path": "/api/pipeline/create", "description": "Content pipeline", "tier": "pro"},
            {"method": "GET", "path": "/api/pipeline/jobs", "description": "List pipeline jobs", "tier": "pro"},
            {"method": "POST", "path": "/api/seo/competitor-audit", "description": "Full SERP audit", "tier": "agency"},
            {"method": "POST", "path": "/api/missions/run", "description": "Guided mission", "tier": "agency"},
            {"method": "GET", "path": "/api/autopilot/stream", "description": "Autopilot SSE stream", "tier": "agency"},
        ],
        "total": 9,
        "tiers": TIER_LIMITS,
    }
