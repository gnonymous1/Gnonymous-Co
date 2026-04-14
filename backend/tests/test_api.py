import pytest
from httpx import AsyncClient, ASGITransport

from main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.get("/api/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "operational"
    assert "app" in payload
    assert "version" in payload


@pytest.mark.asyncio
async def test_get_model_preferences_default():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.get("/api/settings/model-prefs")

    assert response.status_code == 200
    payload = response.json()
    assert payload == {
        "seo": "gemini",
        "youtube": "gemini",
        "tiktok": "gemini",
        "ai_content": "gemini",
    }


@pytest.mark.asyncio
async def test_update_model_preferences_invalid_model():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.put(
            "/api/settings/model-prefs",
            json={"seo": "invalid"},
        )

    assert response.status_code == 400
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_update_model_preferences_valid_model():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.put(
            "/api/settings/model-prefs",
            json={
                "seo": "openrouter",
                "youtube": "openrouter",
                "tiktok": "openrouter",
                "ai_content": "openrouter",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload == {
        "seo": "openrouter",
        "youtube": "openrouter",
        "tiktok": "openrouter",
        "ai_content": "openrouter",
    }
