import json
from fastapi import APIRouter, HTTPException
from services.ai_orchestrator import AIOrchestrator
from services.key_registry import get_keys

router = APIRouter()

@router.post("/humanize")
async def humanize(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Rewrite to be undetectable.
Original: {request.get('content','')}
Respond JSON: {{"humanized_text":"...","ai_score":"<10%","readability":"...","uniqueness":"95+","changes_made":["..."],"platform_optimized_version":"..."}}"""
    orch = AIOrchestrator({model_pref: ai_key})
    res = await orch.process(tool_id="ai_hum", prompt=prompt, model_pref=model_pref, system_prompt="Expert rewriter. JSON only.", model=request.get("open_router_model"))
    if "error" in res: raise HTTPException(status_code=502, detail=res["error"])
    return {**res.get("data", {}), "model_used": model_pref}

@router.post("/ad-copy")
async def ad_copy(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Ads for product: {request.get('product')}.
JSON: {{"facebook":[{{"headline":"...","primary_text":"..."}}],"google":[{{"headline_1":"..."}}],"instagram":[{{"caption":"..."}}]}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_ad", prompt=prompt, model_pref=model_pref, system_prompt="Ad copywriter. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/email-sequence")
async def email_seq(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Email sequence for {request.get('goal')}.
JSON: {{"sequence_name":"...","emails":[{{"email_number":1,"subject_line":"...","body":"..."}}]}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_email", prompt=prompt, model_pref=model_pref, system_prompt="Email marketing expert. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/ebook")
async def ebook_builder(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""eBook for {request.get('topic')}.
JSON: {{"title":"...","chapters_list":[{{"title":"...","summary":"...","content":"..."}}],"sales_page_copy":"..."}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_ebook", prompt=prompt, model_pref=model_pref, system_prompt="eBook builder. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/ebook-outline")
async def ebook_out(request: dict):
    return await ebook_builder(request)

@router.post("/lead-scrape")
async def leads(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Find leads for {request.get('niche')}.
JSON: {{"leads":[{{"site_name":"...","contact_email":"...","url":"..."}}]}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_leads", prompt=prompt, model_pref=model_pref, system_prompt="Lead Gen. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/validate-saas")
async def validate_saas(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Validate SaaS: {request.get('idea')}.
JSON: {{"overall_score":"8/10","verdict":"...","competitors":[{{"name":"...","url":"..."}}],"go_to_market":{{"channel_1":"..."}}}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_saas", prompt=prompt, model_pref=model_pref, system_prompt="VC Analyst. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/thumbnail-studio")
async def thumbnail_studio(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Architect thumbnail for: {request.get('title')}.
JSON: {{"visual_prompt":"...","colors":{{"primary":"#..."}},"text_options":[{{"text":"..."}}],"ctr_prediction":"12%"}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_thumb", prompt=prompt, model_pref=model_pref, system_prompt="Designer. JSON only.", model=request.get("open_router_model"))
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    d = r.get("data", {})
    d["sample_image_url"] = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1280&auto=format&fit=crop"
    return {**d, "model_used": model_pref}

@router.post("/content-writer")
async def content_writer(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Write content: {request.get('topic')}.
JSON: {{"title":"...","meta_description":"...","body_sections":[{{"heading":"...","content":"..."}}],"conclusion":"..."}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_write", prompt=prompt, model_pref=model_pref, system_prompt="SEO writer. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/social-post")
async def social_post(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Social posts for: {request.get('topic')}.
JSON: {{"twitter":[{{"tweet":"..."}}],"linkedin":[{{"headline":"..."}}],"instagram":[{{"caption":"..."}}]}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_soc", prompt=prompt, model_pref=model_pref, system_prompt="SMM. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/repurpose-content")
async def repurpose(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Repurpose: {request.get('original_content')[:1000]}.
JSON: {{"repurposed":[{{"format":"twitter_thread","content":"..."}}]}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_rep", prompt=prompt, model_pref=model_pref, system_prompt="Strategist. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/vsl-script")
async def vsl(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""VSL: {request.get('product')}.
JSON: {{"total_duration":"...","sections":[{{"section":"Hook","script":"..."}}],"full_script":"..."}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_vsl", prompt=prompt, model_pref=model_pref, system_prompt="Copywriter. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}

@router.post("/bio-generator")
async def bio_gen(request: dict):
    model_pref = request.get("model_pref", "gemini")
    keys = await get_keys()
    ai_key = keys.get(model_pref, "")
    if not ai_key: raise HTTPException(status_code=400, detail="Key missing")
    prompt = f"""Bio for: {request.get('name')}.
JSON: {{"short_bio_50":"...","twitter_bio":"...","linkedin_about":"..."}}"""
    r = await AIOrchestrator({model_pref: ai_key}).process(tool_id="ai_bio", prompt=prompt, model_pref=model_pref, system_prompt="Brand expert. JSON only.")
    if "error" in r: raise HTTPException(status_code=502, detail=r["error"])
    return {**r.get("data", {}), "model_used": model_pref}
