"""
Google PageSpeed Insights API Client for Technical SEO Audits.
"""
import httpx
from typing import Optional


class PageSpeedClient:
    """Wrapper for Google PageSpeed Insights API v5."""

    BASE_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    async def analyze(
        self,
        url: str,
        strategy: str = "desktop",
        categories: Optional[list[str]] = None,
    ) -> dict:
        """
        Run a PageSpeed analysis on the given URL.

        Args:
            url: Target page URL.
            strategy: "desktop" or "mobile".
            categories: List of categories to fetch.
                Options: performance, accessibility, best-practices, seo, pwa.
                Defaults to all five.
        """
        if categories is None:
            categories = ["performance", "accessibility", "best-practices", "seo"]

        params = {
            "url": url,
            "strategy": strategy,
        }

        for cat in categories:
            params[f"category_{cat}"] = True

        if self.api_key:
            params["key"] = self.api_key

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.get(self.BASE_URL, params=params)
                resp.raise_for_status()
                return resp.json()
        except httpx.HTTPStatusError as e:
            return {"error": f"PageSpeed API error: {e.response.status_code}"}
        except Exception as e:
            return {"error": str(e)}

    def parse_lighthouse_result(self, data: dict) -> dict:
        """
        Extract structured scores from a PageSpeed v5 Lighthouse response.
        Returns a dict like: {"performance": 87, "accessibility": 92, ...}
        """
        if "error" in data:
            return {"error": data["error"]}

        categories = data.get("loadingExperience", {}).get("metrics", {})
        lighthouse_result = data.get("lighthouseResult", {})

        parsed = {}
        for cat_key, cat_data in lighthouse_result.get("categories", {}).items():
            parsed[cat_key] = int(cat_data.get("score", 0) * 100)

        # Extract field data if available
        field_data = {}
        for metric_name, metric_data in lighthouse_result.get("audits", {}).items():
            if "details" in metric_data and "items" in metric_data["details"]:
                items = metric_data["details"]["items"]
                if items:
                    field_data[metric_name] = items[0] if isinstance(items[0], dict) else items

        return {
            "scores": parsed,
            "field_data": field_data,
            "fetch_time": lighthouse_result.get("fetchTime", ""),
        }
