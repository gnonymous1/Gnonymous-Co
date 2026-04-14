from fastapi import APIRouter, HTTPException, Depends
from schemas.seo import ApiKeyUpdate, ApiKeyStatus
from schemas.settings import (
    ModelPreferencesUpdate,
    ModelPreferencesResponse,
    WorkspaceUserCreate,
    WorkspaceUserUpdate,
    WorkspaceUserResponse,
    UsageStats,
    ArchiveEntry,
    ArchiveCreate,
)
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from models.models import APIKey, WorkspaceUser, UsageLog, PipelineJob
from services.crypto_service import get_crypto_service
from services.task_engine import get_task_engine
import httpx
import uuid
from datetime import datetime

router = APIRouter()
crypto = get_crypto_service()

# In-memory stores (seed defaults for model prefs and workspace)
_model_prefs: dict[str, str] = {
    "seo": "gemini",
    "youtube": "gemini",
    "tiktok": "gemini",
    "ai_content": "gemini",
}

_workspace_users: list[dict] = [
    {
        "id": str(uuid.uuid4()),
        "name": "You (Owner)",
        "email": "owner@apex.local",
        "role": "admin",
        "created_at": datetime.utcnow().isoformat(),
    }
]

_usage_logs: list[dict] = []
_archives: list[dict] = []


# ─── API Keys ────────────────────────────────────────────────────────────────


@router.get("/api-keys")
async def get_api_keys(db: AsyncSession = Depends(get_db)):
    """Get API key status from database (never returns raw keys)."""
    result = await db.execute(select(APIKey))
    keys = result.scalars().all()
    configured = {k.provider: True for k in keys}
    
    providers = ["gemini", "openrouter", "nvidia", "serper", "youtube"]
    return [
        ApiKeyStatus(
            provider=p,
            is_configured=configured.get(p, False),
            is_valid=None,
        )
        for p in providers
    ]


@router.put("/api-keys")
async def update_api_keys(keys: ApiKeyUpdate, db: AsyncSession = Depends(get_db)):
    """Update and encrypt API keys in the database."""
    updated = []
    for provider, raw_key in keys.model_dump().items():
        if not raw_key:
            continue
            
        encrypted = crypto.encrypt(raw_key)
        
        # Upsert logic
        result = await db.execute(select(APIKey).where(APIKey.provider == provider))
        existing = result.scalar_one_or_none()
        
        if existing:
            existing.key_encrypted = encrypted
        else:
            new_key = APIKey(provider=provider, key_encrypted=encrypted)
            db.add(new_key)
        
        updated.append(provider)

    await db.commit()
    return {
        "message": f"Updated keys for: {', '.join(updated)}" if updated else "No keys updated",
        "updated": updated
    }


@router.post("/api-keys/test/{provider}")
async def test_api_key(provider: str, db: AsyncSession = Depends(get_db)):
    """Test if an API key is valid by making a lightweight API call."""
    from sqlalchemy import select
    from models.models import APIKey
    
    result = await db.execute(select(APIKey).where(APIKey.provider == provider))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=400, detail=f"No key configured for {provider}")
    
    key = crypto.decrypt(record.key_encrypted)
    if not key:
        raise HTTPException(status_code=400, detail=f"No key configured for {provider}")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            if provider == "serper":
                resp = await client.post(
                    "https://google.serper.dev/search",
                    json={"q": "test", "num": 1},
                    headers={"X-API-KEY": key, "Content-Type": "application/json"},
                )
                return {"provider": provider, "is_valid": resp.status_code == 200}

            elif provider == "gemini":
                resp = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
                )
                return {"provider": provider, "is_valid": resp.status_code == 200}

            elif provider == "openrouter":
                resp = await client.get(
                    "https://openrouter.ai/api/v1/models",
                    headers={"Authorization": f"Bearer {key}"},
                )
                return {"provider": provider, "is_valid": resp.status_code == 200}

            elif provider == "nvidia":
                resp = await client.get(
                    "https://integrate.api.nvidia.com/v1/models",
                    headers={"Authorization": f"Bearer {key}"},
                )
                return {"provider": provider, "is_valid": resp.status_code == 200}

            elif provider == "youtube":
                resp = await client.get(
                    f"https://www.googleapis.com/youtube/v3/search?part=id&q=test&maxResults=1&key={key}"
                )
                return {"provider": provider, "is_valid": resp.status_code == 200}

        return {"provider": provider, "is_valid": False, "error": "Unknown provider"}

    except Exception as e:
        return {"provider": provider, "is_valid": False, "error": str(e)}


# ─── Model Preferences ───────────────────────────────────────────────────────


@router.get("/model-prefs", response_model=ModelPreferencesResponse)
async def get_model_preferences():
    """Get current AI model preferences per category."""
    return ModelPreferencesResponse(**_model_prefs)


@router.put("/model-prefs", response_model=ModelPreferencesResponse)
async def update_model_preferences(prefs: ModelPreferencesUpdate):
    """Update AI model preferences per category."""
    valid_models = {"gemini", "openrouter", "nvidia"}
    for cat, model in prefs.model_dump().items():
        if model not in valid_models:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid model '{model}' for category '{cat}'. Must be one of: {valid_models}",
            )
        _model_prefs[cat] = model
    return ModelPreferencesResponse(**_model_prefs)


# ─── Workspace ────────────────────────────────────────────────────────────────


@router.get("/workspace", response_model=list[WorkspaceUserResponse])
async def list_workspace_users():
    """List all workspace team members."""
    return [WorkspaceUserResponse(**u) for u in _workspace_users]


@router.post("/workspace", response_model=WorkspaceUserResponse, status_code=201)
async def add_workspace_user(user: WorkspaceUserCreate):
    """Add a new workspace team member."""
    if any(u["email"] == user.email for u in _workspace_users):
        raise HTTPException(status_code=409, detail="A user with this email already exists.")
    new_user = {
        "id": str(uuid.uuid4()),
        **user.model_dump(),
        "created_at": datetime.utcnow().isoformat(),
    }
    _workspace_users.append(new_user)
    return WorkspaceUserResponse(**new_user)


@router.put("/workspace/{user_id}", response_model=WorkspaceUserResponse)
async def update_workspace_user(user_id: str, update: WorkspaceUserUpdate):
    """Update a workspace team member."""
    for user in _workspace_users:
        if user["id"] == user_id:
            update_data = {k: v for k, v in update.model_dump().items() if v is not None}
            user.update(update_data)
            return WorkspaceUserResponse(**user)
    raise HTTPException(status_code=404, detail="User not found.")


@router.delete("/workspace/{user_id}", status_code=204)
async def delete_workspace_user(user_id: str):
    """Remove a workspace team member."""
    if _workspace_users[0]["id"] == user_id:
        raise HTTPException(status_code=403, detail="Cannot remove the owner.")
    for i, user in enumerate(_workspace_users):
        if user["id"] == user_id:
            _workspace_users.pop(i)
            return
    raise HTTPException(status_code=404, detail="User not found.")


# ─── Usage Tracking ───────────────────────────────────────────────────────────


@router.get("/usage", response_model=UsageStats)
async def get_usage_stats():
    """Get aggregated usage statistics."""
    total_tokens = sum(log.get("tokens_input", 0) or 0 + log.get("tokens_output", 0) or 0 for log in _usage_logs)
    total_cost = sum(log.get("cost_usd", 0) or 0 for log in _usage_logs)
    calls_by_model: dict[str, int] = {}
    for log in _usage_logs:
        model = log.get("model_used", "unknown")
        calls_by_model[model] = calls_by_model.get(model, 0) + 1
    return UsageStats(
        total_tokens=total_tokens,
        total_cost=round(total_cost, 6),
        total_calls=len(_usage_logs),
        calls_by_model=calls_by_model,
    )


def log_usage(tool_id: str, model_used: str, tokens_input: int = 0, tokens_output: int = 0, cost_usd: float = 0.0):
    """Internal helper to log a tool run to usage history."""
    _usage_logs.append({
        "id": str(uuid.uuid4()),
        "tool_id": tool_id,
        "model_used": model_used,
        "tokens_input": tokens_input,
        "tokens_output": tokens_output,
        "cost_usd": cost_usd,
        "created_at": datetime.utcnow().isoformat(),
    })


# ─── Archive ─────────────────────────────────────────────────────────────────


@router.get("/archive", response_model=list[ArchiveEntry])
async def list_archives(
    tool_id: str | None = None,
    category: str | None = None,
    search: str | None = None,
    limit: int = 50,
):
    """List archived tool runs with optional filters."""
    results = _archives[::-1]  # newest first
    if tool_id:
        results = [r for r in results if r["tool_id"] == tool_id]
    if search:
        q = search.lower()
        results = [r for r in results if q in str(r.get("input_data", "")).lower() or q in r.get("tool_id", "").lower()]
    results = results[:limit]
    return [ArchiveEntry(**r) for r in results]


@router.post("/archive", response_model=ArchiveEntry, status_code=201)
async def create_archive_entry(entry: ArchiveCreate):
    """Archive a tool run result."""
    new_entry = {
        "id": str(uuid.uuid4()),
        **entry.model_dump(),
        "created_at": datetime.utcnow().isoformat(),
    }
    _archives.append(new_entry)
    # Keep archive bounded to last 500 entries
    if len(_archives) > 500:
        _archives[:] = _archives[-500:]
    return ArchiveEntry(**new_entry)


@router.delete("/archive/{archive_id}", status_code=204)
async def delete_archive_entry(archive_id: str):
    """Delete an archive entry."""
    for i, entry in enumerate(_archives):
        if entry["id"] == archive_id:
            _archives.pop(i)
            return
    # ─── Hydration ───────────────────────────────────────────────────────────────


@router.get("/hydrate")
async def hydrate_app(db: AsyncSession = Depends(get_db)):
    """Gather all initial state for the frontend stores."""
    # 1. API Key Statuses
    result = await db.execute(select(APIKey))
    keys = result.scalars().all()
    key_status = {k.provider: True for k in keys}
    
    providers = ["gemini", "openrouter", "nvidia", "serper", "youtube"]
    keys_data = [
        {"provider": p, "is_configured": key_status.get(p, False)}
        for p in providers
    ]
    
    # 2. Model Preferences
    # For now we use the memory-stub from V5, but multi-provider ready
    model_prefs = {
        "seo": "gemini",
        "youtube": "gemini",
        "tiktok": "gemini",
        "ai_content": "gemini"
    }
    
    # 3. Recent Usage
    result_usage = await db.execute(select(UsageLog).order_by(UsageLog.created_at.desc()).limit(10))
    usage = result_usage.scalars().all()
    
    # 4. Pending Jobs
    result_jobs = await db.execute(select(PipelineJob).where(PipelineJob.status.in_(["PENDING", "RUNNING"])))
    jobs = result_jobs.scalars().all()

    return {
        "keys": keys_data,
        "model_prefs": model_prefs,
        "usage": usage,
        "active_jobs": jobs,
        "timestamp": datetime.utcnow().isoformat()
    }
