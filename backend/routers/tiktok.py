import json
from fastapi import APIRouter, HTTPException
from services.ai_orchestrator import AIOrchestrator
from services.key_registry import get_keys

router = APIRouter()


@router.post("/hooks")
async def generate_hooks(request: dict):
    keys = await get_keys()
    topic = request.get("topic", "")
    audience = request.get("target_audience", "general")
    platform = request.get("platform", "TikTok")
    niche = request.get("niche", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} API key not configured.")
    prompt = f"""Generate 15 viral {platform} hooks for the first 3 seconds of a video about: "{topic}".
Target audience: {audience} | Niche: {niche}

Respond JSON:
{{
    "hooks": [
        {{
            "text": "The hook text",
            "style": "question|shock|story|challenge|controversy|curiosity|fear|social_proof",
            "estimated_retention": "85%",
            "why_it_works": "Brief explanation",
            "visual_pairing": "What to show on screen",
            "platform_suitability": {{"tiktok": 9, "reels": 8, "shorts": 7}},
            "a_b_variant": "Alternative phrasing"
        }}
    ],
    "hook_formulas": [{{"formula": "...", "example": "...", "best_for": "..."}}],
    "opening_lines_bank": ["line1", "line2", "..."],
    "pattern_interrupts": ["visual idea 1", "visual idea 2"],
    "power_words": ["word1", "word2", "..."]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(
        tool_id="tt_hook_generator", prompt=prompt, model_pref=model_pref,
        system_prompt="Viral short-form content strategist. Always respond in valid JSON."
    )
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {
        "topic": topic,
        "hooks": data.get("hooks", []),
        "hook_formulas": data.get("hook_formulas", []),
        "opening_lines_bank": data.get("opening_lines_bank", []),
        "pattern_interrupts": data.get("pattern_interrupts", []),
        "power_words": data.get("power_words", []),
        "model_used": ai_response.get("model_used", model_pref),
    }


@router.post("/trends")
async def trend_scout(request: dict):
    keys = await get_keys()
    category = request.get("category", "general")
    country = request.get("country", "us")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_key = keys.get("serper", "")
    trend_data = ""
    if serper_key:
        from services.serper_client import SerperClient
        try:
            serper = SerperClient(serper_key)
            results = await serper.search(query=f"trending TikTok {category} {country} 2026", num=10)
            trend_data = json.dumps(results.get("organic", [])[:5], indent=2)
        except:
            pass
    prompt = f"""TikTok trend analysis for "{category}" in {country}. Data: {trend_data}

Respond JSON:
{{
    "trending_audios": [{{"name": "...", "artist": "...", "usage_count": "...", "trend_velocity": "Rising/Stable/Declining", "ranking_keyword": "...", "best_content_type": "...", "expiry_estimate": "1 week/1 month", "top_creators_using": ["@user1"]}}],
    "trending_hashtags": [{{"tag": "#...", "views": "...", "growth": "...", "relevance_score": 98, "competition": "Low/Med/High", "sub_tags": ["#related"]}}],
    "trending_formats": [{{"format": "...", "description": "...", "example": "...", "ranking_tagline": "...", "seo_description": "...", "monetization_tier": "High|Medium|Low", "avg_views": "...", "difficulty": "...", "content_ideas": ["idea1","idea2"]}}],
    "high_traffic_keywords": ["kw1","kw2"],
    "viral_sound_analysis": [{{"sound_type": "Original/Remix/Speech", "emotion": "...", "best_use": "..."}}],
    "trending_effects": [{{"effect": "...", "usage": "...", "tutorial_opportunity": true}}],
    "niche_specific_trends": [{{"trend": "...", "category_fit": "...", "urgency": "Post now/This week"}}],
    "content_calendar_suggestions": [{{"day": "Monday", "trend": "...", "optimal_time": "7-9PM"}}],
    "recommendation": "AI dominance strategy"
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(
        tool_id="tt_trend_scout", prompt=prompt, model_pref=model_pref,
        system_prompt="TikTok trend analysis expert. Always respond in valid JSON."
    )
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {**data, "model_used": ai_response.get("model_used", model_pref)}


@router.post("/convert-script")
async def convert_script(request: dict):
    keys = await get_keys()
    long_content = request.get("long_content", "")
    platform = request.get("platform", "TikTok")
    style = request.get("style", "educational")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Convert this content into 7 short-form scripts for {platform}:

CONTENT: {long_content[:3000]}
Style: {style}

Each script must have a killer hook, be under 150 words, end with strong CTA.
Respond JSON:
{{
    "scripts": [
        {{
            "hook": "First 3 seconds...",
            "script": "Full verbatim script...",
            "duration": "~60s",
            "word_count": 140,
            "cta": "CTA text",
            "visual_direction": "What to show on screen",
            "text_overlays": [{{"text": "...", "timing": "0:05"}}],
            "hashtags": ["#tag1","#tag2"],
            "best_upload_time": "7-9 PM EST",
            "predicted_views": "10K-50K",
            "thumbnail_frame": "Best frame for thumbnail"
        }}
    ],
    "repurposing_map": [{{"source_section": "...", "short_form_angle": "..."}}],
    "content_series_idea": "Turn 1 video into X-part series"
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(
        tool_id="tt_script_converter", prompt=prompt, model_pref=model_pref,
        system_prompt="Viral short-form content writer. Always respond in valid JSON."
    )
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {
        "scripts": data.get("scripts", []),
        "repurposing_map": data.get("repurposing_map", []),
        "content_series_idea": data.get("content_series_idea", ""),
        "model_used": ai_response.get("model_used", model_pref)
    }


@router.post("/engagement")
async def engagement_analytics(request: dict):
    keys = await get_keys()
    profile_url = request.get("profile_url", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_key = keys.get("serper", "")
    search_data = ""
    if serper_key:
        from services.serper_client import SerperClient
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"{profile_url} TikTok analytics engagement", num=5)
            search_data = json.dumps(r.get("organic", [])[:3], indent=2)
        except:
            pass
    prompt = f"""Deep TikTok engagement analysis for: {profile_url}. Data: {search_data}.
Respond JSON: {{
    "avg_views": "100K",
    "avg_likes": "10K",
    "avg_comments": "500",
    "avg_shares": "2K",
    "engagement_rate": "9.5%",
    "follower_growth_rate": "+5% weekly",
    "best_time": "7-9 PM EST",
    "best_day": "Tuesday/Thursday",
    "content_score": "8.5/10",
    "virality_coefficient": "1.8x average",
    "audience_retention_avg": "78%",
    "top_performing": [{{"theme": "...", "performance": "High/Medium", "avg_views": "...", "reason": "..."}}],
    "underperforming_content": [{{"theme": "...", "issue": "...", "fix": "..."}}],
    "audience_demographics": {{"age_18_24": "45%", "age_25_34": "30%", "other": "25%"}},
    "competitor_benchmark": {{"your_er": "9.5%", "niche_avg_er": "6.2%", "status": "Above Average"}},
    "monetization_potential": {{"brand_deals": "$X-Y per post", "creator_fund": "$X per 1000 views", "affiliate": "..."}},
    "growth_recommendations": ["tip1","tip2","tip3","tip4","tip5"],
    "30_day_strategy": [{{"week": 1, "focus": "...", "post_frequency": "...", "content_types": ["..."]}}]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="tt_engagement", prompt=prompt, model_pref=model_pref, system_prompt="TikTok analytics expert. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/post-rank")
async def post_rank(request: dict):
    keys = await get_keys()
    keyword = request.get("keyword", "")
    niche = request.get("niche", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_key = keys.get("serper", "")
    search_data = ""
    if serper_key:
        from services.serper_client import SerperClient
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"TikTok {keyword} trending", num=10)
            search_data = json.dumps(r.get("organic", [])[:5], indent=2)
        except:
            pass
    prompt = f"""TikTok FYP ranking analysis for "{keyword}" in {niche}. Data: {search_data}.
Respond JSON: {{
    "top_posts": [{{"caption": "...", "views": "1.2M", "likes": "...", "comments": "...", "shares": "...", "engagement": "12%", "hashtags": "#tag1 #tag2", "velocity": "Rising/Stable/Declining", "audio": "...", "posting_time": "...", "what_worked": "..."}}],
    "fyp_algorithm_insights": [{{"factor": "...", "weight": "High/Med/Low", "how_to_optimize": "..."}}],
    "ranking_formula": "Caption structure + hashtag strategy used by top posts",
    "best_caption_structure": "...",
    "optimal_hashtag_mix": {{"branded": 1, "niche": 3, "trending": 3, "broad": 3}},
    "posting_frequency_recommendation": "...",
    "content_recycling_tips": ["..."],
    "optimization_tips": ["tip1","tip2","tip3","tip4","tip5"],
    "competitor_captions_analysis": "What works in this niche"
}}. Include 10 top posts."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="tt_post_rank", prompt=prompt, model_pref=model_pref, system_prompt="TikTok FYP ranking analyst. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/viral-caption")
async def viral_caption(request: dict):
    """Generate viral captions for TikTok/Reels/Shorts."""
    keys = await get_keys()
    topic = request.get("topic", "")
    platform = request.get("platform", "TikTok")
    niche = request.get("niche", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Generate 10 viral {platform} captions for: "{topic}". Niche: {niche}.
Respond JSON: {{
    "captions": [{{"text": "...", "character_count": 150, "hook_type": "Question/Statement/List", "predicted_engagement": "High/Med", "hashtag_set": ["#tag1","#tag2",...], "emoji_strategy": "..."}}],
    "caption_templates": [{{"template": "...", "fill_in": ["blank1","blank2"]}}],
    "hashtag_clusters": [{{"cluster_name": "...", "hashtags": ["#...",...]}}],
    "call_to_action_bank": ["Comment below...", "Tag someone who..."],
    "trending_caption_formats": ["POV:", "the way", "not me", "..."]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="tt_caption", prompt=prompt, model_pref=model_pref, system_prompt="Viral caption writer. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}

@router.post("/trend-analyzer")
async def analyze_trends(request: dict):
    all_keys = await get_keys()
    ai_key = all_keys.get(request.get("model_pref", "gemini"), "")
    if not ai_key:
        raise HTTPException(status_code=400, detail="AI API key not configured for trends.")
    # ... logic ...

@router.post("/content-calendar")
async def content_calendar(request: dict):
    """Generate a 30-day TikTok content calendar."""
    keys = await get_keys()
    niche = request.get("niche", "")
    posting_frequency = request.get("posting_frequency", "daily")
    goal = request.get("goal", "grow followers")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Create a 30-day TikTok content calendar for niche: "{niche}". Goal: {goal}. Frequency: {posting_frequency}.
Respond JSON: {{
    "calendar": [{{"day": 1, "date_of_week": "Monday", "content_type": "Tutorial/Trending/Story/Educational", "topic": "...", "hook": "...", "duration": "30s/60s/3min", "hashtag_strategy": "trending+niche+branded", "best_time": "7PM EST", "trend_to_use": "...", "monetization_type": "Brand deal/Affiliate/None"}}],
    "content_pillars": [{{"pillar": "...", "percentage": "30%", "purpose": "..."}}],
    "weekly_themes": [{{"week": 1, "theme": "...", "goal": "..."}}],
    "viral_templates": ["Template idea 1", "Template idea 2"],
    "batch_filming_guide": "Film 30 videos in 1 day strategy"
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="tt_calendar", prompt=prompt, model_pref=model_pref, system_prompt="TikTok content strategist. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}
