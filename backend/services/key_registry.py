"""
Central API key registry for Apex Content OS.
V5 Update: Keys are now pulled from SQLite and decrypted via CryptoService.
"""
from functools import lru_cache
from sqlalchemy import select
from database import AsyncSessionLocal
from models.models import APIKey
from services.crypto_service import get_crypto_service
import asyncio

@lru_cache()
def _get_crypto():
    return get_crypto_service()

async def get_keys() -> dict:
    """
    Fetch all encrypted keys from the database and decrypt them.
    Merges with .env defaults via get_settings().
    """
    from config import get_settings
    s = get_settings()
    crypto = _get_crypto()
    
    # Defaults
    keys = {
        "openrouter": s.OPENROUTER_API_KEY,
        "gemini":     s.GEMINI_API_KEY,
        "serper":     s.SERPER_API_KEY,
        "youtube":    s.YOUTUBE_API_KEY,
        "nvidia":     s.NVIDIA_API_KEY,
    }
    
    # DB Overrides
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(APIKey))
            db_keys = result.scalars().all()
            for k in db_keys:
                decrypted = crypto.decrypt(k.key_encrypted)
                if decrypted:
                    keys[k.provider] = decrypted
    except Exception:
        # DB might not be initialized yet in early boot
        pass
        
    return keys

async def get_ai_key(model_pref: str) -> str:
    """Get the decrypted API key for a specific provider."""
    keys = await get_keys()
    return keys.get(model_pref, "")

def get_keys_sync() -> dict:
    """Synchronous wrapper for contexts where async is not possible."""
    # Note: Use sparingly, better to use get_keys() in async routes
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # This is risky in some envs, but for local SaaS it works
            return asyncio.run_coroutine_threadsafe(get_keys(), loop).result()
        return asyncio.run(get_keys())
    except Exception:
        return {}
