import httpx
from typing import Optional

class TikTokClient:
    """Unofficial TikTok data client for trend and profile insights."""

    SEARCH_URL = "https://www.tiktok.com/api/search"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    async def search_trends(self, query: str, count: int = 10) -> dict:
        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                response = await client.get(self.SEARCH_URL, params={"q": query, "count": count})
                response.raise_for_status()
                return response.json()
            except Exception:
                return {"error": "TikTok search API unavailable or unsupported."}

    async def get_profile_insights(self, username: str) -> dict:
        return {
            "username": username,
            "followers": "Unknown",
            "avg_likes": "Unknown",
            "avg_comments": "Unknown",
            "top_themes": [],
        }
