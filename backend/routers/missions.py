from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import asyncio

router = APIRouter()


class MissionRunRequest(BaseModel):
    mission_id: str
    params: dict = {}


MISSION_STEPS = {
    "viral-youtube": [
        {"id": 1, "name": "Niche & Competitor Audit", "tool": "niche_finder"},
        {"id": 2, "name": "Channel SEO Setup", "tool": "seo_analyzer"},
        {"id": 3, "name": "First 10 Video Scripts", "tool": "script_writer"},
        {"id": 4, "name": "Thumbnail Concepts", "tool": "thumbnail_gen"},
        {"id": 5, "name": "Upload Schedule", "tool": "content_planner"},
        {"id": 6, "name": "Analytics Baseline", "tool": "analytics"},
    ],
    "seo-domination": [
        {"id": 1, "name": "Keyword Gap Analysis", "tool": "keyword_lab"},
        {"id": 2, "name": "Competitor SERP Audit", "tool": "competitor_spy"},
        {"id": 3, "name": "Content Cluster Map", "tool": "content_planner"},
        {"id": 4, "name": "10 Article Briefs", "tool": "script_writer"},
        {"id": 5, "name": "Internal Link Strategy", "tool": "seo_analyzer"},
        {"id": 6, "name": "Rank Tracking Setup", "tool": "rank_tracker"},
    ],
    "content-repurpose": [
        {"id": 1, "name": "Trend Analysis", "tool": "trend_analyzer"},
        {"id": 2, "name": "TikTok Shorts (x5)", "tool": "script_writer"},
        {"id": 3, "name": "Twitter/X Thread", "tool": "script_writer"},
        {"id": 4, "name": "LinkedIn Article", "tool": "script_writer"},
        {"id": 5, "name": "Blog Post + SEO", "tool": "seo_optimizer"},
        {"id": 6, "name": "Distribution Plan", "tool": "content_planner"},
    ],
    "monetize-niche": [
        {"id": 1, "name": "Niche Profitability Score", "tool": "niche_finder"},
        {"id": 2, "name": "Audience Pain Analysis", "tool": "ai_researcher"},
        {"id": 3, "name": "Affiliate Program Map", "tool": "affiliate_scanner"},
        {"id": 4, "name": "Lead Magnet Creation", "tool": "script_writer"},
        {"id": 5, "name": "Email Sequence Draft", "tool": "script_writer"},
        {"id": 6, "name": "Revenue Projection", "tool": "analytics"},
    ],
}

AVAILABLE_MISSIONS = [
    {
        "id": "viral-youtube",
        "title": "Viral YouTube Channel Launch",
        "description": "Go from zero to 1K subs in 30 days with AI-powered strategy.",
        "steps_count": 6,
        "estimated_minutes": 25,
        "category": "YouTube",
    },
    {
        "id": "seo-domination",
        "title": "SEO Domination Sprint",
        "description": "Rank page-1 for 10 money keywords in 60 days.",
        "steps_count": 6,
        "estimated_minutes": 30,
        "category": "SEO",
    },
    {
        "id": "content-repurpose",
        "title": "Omnichannel Content Repurpose",
        "description": "Turn one piece of content into 20 platform-ready assets.",
        "steps_count": 6,
        "estimated_minutes": 15,
        "category": "Content",
    },
    {
        "id": "monetize-niche",
        "title": "Niche Monetization Blueprint",
        "description": "Find a profitable niche and map affiliate + product revenue.",
        "steps_count": 6,
        "estimated_minutes": 20,
        "category": "Monetize",
    },
]


@router.get("/list")
async def list_missions():
    """Return all available guided missions."""
    return {"missions": AVAILABLE_MISSIONS}


@router.get("/{mission_id}/steps")
async def get_mission_steps(mission_id: str):
    """Return the steps for a specific mission."""
    steps = MISSION_STEPS.get(mission_id)
    if not steps:
        return {"error": "Mission not found", "steps": []}
    return {"mission_id": mission_id, "steps": steps}


@router.post("/start")
async def start_mission(request: dict):
    all_keys = await get_keys()
    model_pref = request.get("model_pref", "gemini")
    ai_key = all_keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"API Key for {model_pref} not configured.")


@router.post("/run")
async def run_mission(req: MissionRunRequest):
    """
    Orchestrate a guided mission — chains module calls sequentially.
    Returns a job ID; poll /status/{job_id} for progress.
    """
    steps = MISSION_STEPS.get(req.mission_id, [])
    if not steps:
        return {"error": f"Unknown mission: {req.mission_id}"}

    # Simulate sequential execution (replace with actual module calls)
    results = []
    for step in steps:
        await asyncio.sleep(0.1)  # placeholder for real async work
        results.append({
            "step_id": step["id"],
            "name": step["name"],
            "tool": step["tool"],
            "status": "queued",
            "output": None,
        })

    return {
        "mission_id": req.mission_id,
        "status": "started",
        "total_steps": len(steps),
        "steps": results,
        "message": f"Mission '{req.mission_id}' queued with {len(steps)} steps.",
    }
