import httpx
from typing import Optional


class SerperClient:
    """Serper.dev API client for Google SERP data."""

    BASE_URL = "https://google.serper.dev"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "X-API-KEY": api_key,
            "Content-Type": "application/json",
        }

    async def search(
        self,
        query: str,
        country: str = "us",
        language: str = "en",
        num: int = 100,
        search_type: str = "search",
    ) -> dict:
        """Execute a Google SERP search via Serper.dev."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "q": query,
                "gl": country,
                "hl": language,
                "num": min(num, 100),
            }

            endpoint = f"{self.BASE_URL}/{search_type}"
            response = await client.post(
                endpoint, json=payload, headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def autocomplete(self, query: str, country: str = "us") -> dict:
        """Get Google autocomplete suggestions."""
        async with httpx.AsyncClient(timeout=15.0) as client:
            payload = {"q": query, "gl": country}
            response = await client.post(
                f"{self.BASE_URL}/autocomplete",
                json=payload,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.json()

    async def search_youtube(
        self, query: str, num: int = 20
    ) -> dict:
        """Search YouTube results via Serper."""
        return await self.search(query, num=num, search_type="videos")

    async def search_local(
        self, query: str, location: str, country: str = "us"
    ) -> dict:
        """Search Google Maps / Local results."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "q": query,
                "gl": country,
                "location": location,
                "type": "places",
            }
            response = await client.post(
                f"{self.BASE_URL}/places",
                json=payload,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.json()

    async def search_news(self, query: str, country: str = "us") -> dict:
        """Search Google News."""
        return await self.search(query, country=country, search_type="news")
