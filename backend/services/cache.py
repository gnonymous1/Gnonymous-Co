import asyncio
from datetime import datetime, timedelta
from typing import Any

class ResponseCache:
    def __init__(self, ttl_seconds: int = 300):
        self.ttl_seconds = ttl_seconds
        self._cache: dict[str, tuple[Any, datetime]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any:
        async with self._lock:
            entry = self._cache.get(key)
            if not entry:
                return None
            value, expires = entry
            if datetime.utcnow() >= expires:
                del self._cache[key]
                return None
            return value

    async def set(self, key: str, value: Any) -> None:
        async with self._lock:
            self._cache[key] = (value, datetime.utcnow() + timedelta(seconds=self.ttl_seconds))

    async def clear(self) -> None:
        async with self._lock:
            self._cache.clear()
