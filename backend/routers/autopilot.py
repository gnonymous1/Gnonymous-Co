from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
import time

router = APIRouter()


class AutopilotRequest(BaseModel):
    goal: str
    max_steps: int = 6


def select_tools_for_goal(goal: str) -> list[dict]:
    """Simple heuristic chain selection — replace with LLM tool-selector."""
    g = goal.lower()
    if "youtube" in g:
        return [
            {"tool": "niche_finder", "description": "Analyzing channel niche opportunities"},
            {"tool": "competitor_spy", "description": "Auditing top 10 competitor channels"},
            {"tool": "keyword_lab", "description": "Finding high-traffic video keywords"},
            {"tool": "script_writer", "description": "Generating first 5 video scripts"},
            {"tool": "content_planner", "description": "Building 30-day upload schedule"},
        ]
    if "seo" in g or "rank" in g or "keyword" in g:
        return [
            {"tool": "keyword_lab", "description": "Extracting top money keywords from SERP"},
            {"tool": "seo_auditor", "description": "Competitor backlink & content gap audit"},
            {"tool": "content_planner", "description": "Building topical authority content cluster"},
            {"tool": "script_writer", "description": "Generating 5 optimized article outlines"},
        ]
    if "repurpose" in g or "podcast" in g or "tiktok" in g:
        return [
            {"tool": "trend_analyzer", "description": "Identifying high-engagement content angles"},
            {"tool": "script_writer", "description": "Creating TikTok short scripts (x5)"},
            {"tool": "script_writer", "description": "Writing Twitter/X thread"},
            {"tool": "script_writer", "description": "Drafting LinkedIn article"},
            {"tool": "seo_auditor", "description": "Optimizing blog post SEO metadata"},
        ]
    # Default — niche + monetization
    return [
        {"tool": "niche_finder", "description": "Scanning profitability across 50 niches"},
        {"tool": "keyword_lab", "description": "Extracting low-competition keywords"},
        {"tool": "affiliate_scanner", "description": "Mapping affiliate programs + commissions"},
        {"tool": "content_planner", "description": "Building 30-day content calendar"},
        {"tool": "script_writer", "description": "Writing 3 authority pillar articles"},
    ]


@router.post("/run")
async def run_autopilot(req: AutopilotRequest):
    """
    Run the autopilot agent for a given goal.
    Returns a synchronous plan (for SSE use /stream).
    """
    tools = select_tools_for_goal(req.goal)[:req.max_steps]
    plan = [
        {
            "step": i + 1,
            "tool": t["tool"],
            "description": t["description"],
            "status": "queued",
            "output": None,
        }
        for i, t in enumerate(tools)
    ]
    return {
        "goal": req.goal,
        "total_steps": len(plan),
        "plan": plan,
        "message": f"Autopilot plan generated for: {req.goal}",
    }


@router.get("/stream")
async def stream_autopilot(goal: str):
    """
    Server-Sent Events stream for real-time autopilot progress.
    Each event is a JSON step update.
    """
    tools = select_tools_for_goal(goal)

    async def event_generator():
        for i, tool in enumerate(tools):
            # Emit "running" status
            data = json.dumps({
                "step": i + 1,
                "tool": tool["tool"],
                "description": tool["description"],
                "status": "running",
                "progress_pct": int((i / len(tools)) * 100),
            })
            yield f"data: {data}\n\n"
            await asyncio.sleep(1.5)  # simulate work

            # Emit "done" status
            data = json.dumps({
                "step": i + 1,
                "tool": tool["tool"],
                "description": tool["description"],
                "status": "done",
                "progress_pct": int(((i + 1) / len(tools)) * 100),
                "output": f"Completed: {tool['description']}",
            })
            yield f"data: {data}\n\n"

        # Emit final summary
        summary = json.dumps({
            "status": "complete",
            "total_steps": len(tools),
            "message": f"Autopilot finished all {len(tools)} steps for goal: {goal}",
        })
        yield f"data: {summary}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
