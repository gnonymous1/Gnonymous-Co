import time
from typing import Dict, Any, Optional


class SimpleCache:
    """Ultra-fast In-Memory Caching for AI and Serper responses."""

    def __init__(self, ttl: int = 3600):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl  # Default 1 hour

    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value from the cache if not expired."""
        if key in self.cache:
            item = self.cache[key]
            if time.time() < item["expiry"]:
                return item["value"]
            else:
                del self.cache[key]  # Clean up expired item
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Store a value in the cache with a specific TTL."""
        expiry = time.time() + (ttl if ttl is not None else self.ttl)
        self.cache[key] = {"value": value, "expiry": expiry}

    def clear(self):
        """Wipe the entire cache."""
        self.cache.clear()


# Global Singleton for ease of use across routers
global_cache = SimpleCache()
