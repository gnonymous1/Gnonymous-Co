import httpx
from typing import Optional

class YouTubeClient:
    BASE_URL = "https://www.googleapis.com/youtube/v3"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def search(self, query: str, max_results: int = 10) -> dict:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(
                f"{self.BASE_URL}/search",
                params={
                    "part": "snippet",
                    "q": query,
                    "maxResults": min(max_results, 50),
                    "type": "video,channel,playlist",
                    "key": self.api_key,
                },
            )
            resp.raise_for_status()
            return resp.json()

    async def get_video_details(self, video_id: str) -> dict:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(
                f"{self.BASE_URL}/videos",
                params={
                    "part": "snippet,statistics,contentDetails,topicDetails",
                    "id": video_id,
                    "key": self.api_key,
                },
            )
            resp.raise_for_status()
            return resp.json()

    async def get_channel_stats(self, channel_id: str) -> dict:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(
                f"{self.BASE_URL}/channels",
                params={
                    "part": "statistics,snippet,contentDetails",
                    "id": channel_id,
                    "key": self.api_key,
                },
            )
            resp.raise_for_status()
            return resp.json()
