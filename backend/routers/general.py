import json
from fastapi import APIRouter, HTTPException
from services.ai_orchestrator import AIOrchestrator
from services.key_registry import get_keys

router = APIRouter()

@router.post("/query")
async def general_query(request: dict):
    model_pref = request.get("model_pref", "gemini")
    prompt = request.get("prompt", "")
    system_prompt = request.get("system_prompt", "You are a helpful AI assistant. Respond in valid JSON.")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="general", prompt=prompt, model_pref=model_pref, system_prompt=system_prompt)
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}
