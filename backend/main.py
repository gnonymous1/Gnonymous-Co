from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from config import get_settings
from database import init_db

import models.models  # noqa: F401

from routers import seo, settings as settings_router, youtube, tiktok, ai_content, general, pipeline, billing, auth
from routers import missions, autopilot, agency, developer_api

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    from services.task_engine import get_task_engine
    engine = get_task_engine()
    await engine.start()
    yield
    await engine.stop()


app = FastAPI(
    title=settings.APP_NAME,
    version="7.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])
app.include_router(youtube.router, prefix="/api/yt", tags=["YouTube"])
app.include_router(tiktok.router, prefix="/api/tt", tags=["TikTok"])
app.include_router(ai_content.router, prefix="/api/ai", tags=["AI Content"])
app.include_router(general.router, prefix="/api/general", tags=["General"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["Settings"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Pipeline"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])
app.include_router(missions.router, prefix="/api/missions", tags=["Missions"])
app.include_router(autopilot.router, prefix="/api/autopilot", tags=["Autopilot"])
app.include_router(agency.router, prefix="/api/agency", tags=["Agency"])
app.include_router(developer_api.router, prefix="/api/developer", tags=["Developer API"])


@app.websocket("/ws/state")
async def state_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # For now, we just heartbeat. In V5, this will push job updates.
            await websocket.send_json({"type": "heartbeat", "timestamp": datetime.utcnow().isoformat()})
            await asyncio.sleep(10)
    except Exception:
        pass
    finally:
        await websocket.close()


@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "app": settings.APP_NAME,
        "version": "7.0.0",
        "modules": {
            "seo": 10,
            "youtube": 8,
            "tiktok": 7,
            "ai_content": 12,
        },
        "total_endpoints": 37,
    }


@app.get("/api/stats")
async def platform_stats():
    return {
        "total_tools": 47,
        "seo_tools": 10,
        "youtube_tools": 8,
        "tiktok_tools": 7,
        "ai_content_tools": 12,
        "new_pages": ["monetize", "factory", "accounts", "analytics"],
        "version": "7.0.0",
    }
