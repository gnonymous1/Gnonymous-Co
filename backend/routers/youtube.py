import json
from fastapi import APIRouter, HTTPException
from services.ai_orchestrator import AIOrchestrator
from services.serper_client import SerperClient
from services.key_registry import get_keys

router = APIRouter()


@router.post("/competitor-spy")
async def competitor_spy(request: dict):
    keys = await get_keys()
    channel_url = request.get("channel_url", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} API key not configured.")
    serper_key = keys.get("serper", "")
    channel_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            results = await serper.search_youtube(query=f"{channel_url} channel", num=10)
            channel_data = json.dumps(results.get("videos", results.get("organic", [])), indent=2)
        except:
            channel_data = "No live data available"
    prompt = f"""Analyze YouTube channel: "{channel_url}". Data: {channel_data}

Respond JSON:
{{
    "channel_stats": {{"subscribers": "...", "total_videos": "...", "avg_views": "...", "upload_frequency": "...", "avg_likes": "...", "avg_comments": "...", "engagement_rate": "...", "estimated_monthly_revenue": "$X-$Y", "channel_age": "...", "niche_authority_score": "8/10"}},
    "top_videos": [{{"title": "...", "views": "...", "date": "...", "engagement": "...", "estimated_revenue": "$...", "viral_blueprint": {{"optimized_title": "...", "ranking_tagline": "...", "high_ranked_description": "...", "retention_hook": "...", "thumbnail_strategy": "...", "tags": ["tag1","tag2","tag3"], "cta_strategy": "...", "upload_time": "...", "shorts_adaptation": "..."}}}}],
    "trending_topics": ["topic1","topic2"],
    "content_pillars": [{{"pillar": "...", "videos_count": "...", "avg_performance": "..."}}],
    "revenue_sources": ["AdSense", "Sponsorships", "..."],
    "growth_trajectory": "...",
    "weaknesses": ["weakness1","weakness2"],
    "opportunity_gaps": [{{"gap": "...", "potential": "High/Medium", "suggested_title": "..."}}],
    "ai_analysis": "Strategic dominance advice"
}}
Provide 10+ top videos, 10+ trending_topics, 5+ content_pillars, 5+ opportunity_gaps."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(tool_id="yt_competitor_spy", prompt=prompt, model_pref=model_pref, system_prompt="YouTube growth strategist. Always respond in valid JSON.")
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {
        "channel_url": channel_url,
        "channel_stats": data.get("channel_stats", {}),
        "top_videos": data.get("top_videos", []),
        "trending_topics": data.get("trending_topics", []),
        "content_pillars": data.get("content_pillars", []),
        "revenue_sources": data.get("revenue_sources", []),
        "growth_trajectory": data.get("growth_trajectory", ""),
        "weaknesses": data.get("weaknesses", []),
        "opportunity_gaps": data.get("opportunity_gaps", []),
        "ai_analysis": data.get("ai_analysis", data.get("content_strategy", "")),
        "model_used": ai_response.get("model_used", model_pref),
    }


@router.post("/rank-check")
async def rank_check(request: dict):
    keys = await get_keys()
    keyword = request.get("keyword", "")
    video_url = request.get("video_url", "")
    model_pref = request.get("model_pref", "gemini")
    serper_key = keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper.dev key required.")
    serper = SerperClient(serper_key)
    results = await serper.search_youtube(query=keyword, num=20)
    videos = results.get("videos", results.get("organic", []))
    position = None
    for i, v in enumerate(videos, 1):
        if video_url in str(v.get("link", "")):
            position = i
            break
    return {
        "keyword": keyword,
        "video_url": video_url,
        "position": position,
        "total_results": len(videos),
        "top_results": videos[:10],
        "rank_category": "Top 3" if position and position <= 3 else "Top 10" if position and position <= 10 else "Page 1" if position and position <= 20 else "Not Found",
    }


@router.post("/rank-track-bulk")
async def rank_track_bulk(request: dict):
    """Track multiple keywords at once for a channel."""
    keys = await get_keys()
    channel_url = request.get("channel_url", "")
    keywords = request.get("keywords", [])
    serper_key = keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper.dev key required.")
    serper = SerperClient(serper_key)
    results = []
    for kw in keywords[:10]:
        try:
            r = await serper.search_youtube(query=kw, num=20)
            videos = r.get("videos", r.get("organic", []))
            pos = None
            for i, v in enumerate(videos, 1):
                if channel_url.lower() in str(v.get("link", "")).lower():
                    pos = i
                    break
            results.append({"keyword": kw, "position": pos, "change": 0})
        except:
            results.append({"keyword": kw, "position": None, "change": 0})
    return {"channel_url": channel_url, "rankings": results}


@router.post("/storyboard")
async def storyboard(request: dict):
    keys = await get_keys()
    script = request.get("script", "")
    niche = request.get("niche", "general")
    style = request.get("style", "educational")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Break this video script into 10-14 storyboard scenes. Script: {script[:3000]}
Niche: {niche} | Style: {style}
Respond JSON: {{
    "scenes": [{{"scene_number": 1, "narration": "...", "visual_prompt": "Ultra-detailed AI image prompt...", "duration": "30s", "timestamp": "0:00-0:30", "on_screen_text": "...", "b_roll_suggestions": ["...", "..."], "transition": "Cut/Fade/Zoom", "music_mood": "Energetic/Calm/...", "camera_angle": "Wide/Close-up/..."}}],
    "total_duration": "...",
    "recommended_platform": "YouTube Long-form / Shorts",
    "chapters": [{{"timestamp": "0:00", "title": "..."}}],
    "thumbnail_moment": "Best timestamp for thumbnail",
    "hook_analysis": "Why the opening works",
    "cta_placement": "Where to add CTAs"
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_storyboard", prompt=prompt, model_pref=model_pref, system_prompt="Video storyboard artist and director. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/thumbnail-predict")
async def thumbnail_predict(request: dict):
    keys = await get_keys()
    title = request.get("title", "")
    description = request.get("description", "")
    niche = request.get("niche", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Predict thumbnail CTR and design strategies for: "{title}". Description: {description}. Niche: {niche}.
Respond JSON: {{
    "predicted_ctr": "8-12%",
    "emotion_score": "High/Medium/Low",
    "curiosity_score": "Strong/Medium/Weak",
    "face_recommendation": "Include face: Yes/No because...",
    "text_overlay_score": "8/10",
    "color_psychology": "Use {{'primary': '#...', 'secondary': '#...'}} because...",
    "ab_test_variants": [{{"concept": "...", "description": "...", "predicted_ctr": "...", "colors": ["#hex1","#hex2"], "text_overlay": "...", "emotion": "..."}}],
    "competitor_thumbnails_analysis": "What top videos in this niche use",
    "mobile_optimization": "How it looks on mobile (3-inch screen)",
    "click_triggers": ["curiosity gap", "social proof", "..."],
    "improvement_checklist": [{{"item": "...", "current": "...", "suggested": "..."}}]
}}. Include 5 A/B test variants."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_thumbnail", prompt=prompt, model_pref=model_pref, system_prompt="YouTube thumbnail CTR expert. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/optimize-tags")
async def optimize_tags(request: dict):
    keys = await get_keys()
    video_title = request.get("video_title", "")
    description = request.get("description", "")
    niche = request.get("niche", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_data = ""
    serper_key = keys.get("serper", "")
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search_youtube(query=video_title, num=5)
            serper_data = json.dumps(r.get("videos", r.get("organic", []))[:3], indent=2)
        except:
            pass
    prompt = f"""Generate optimized YouTube metadata for: "{video_title}". Niche: {niche}. Competitor data: {serper_data}.
Respond JSON: {{
    "optimized_titles": [{{"title": "...", "predicted_ctr": "...", "seo_score": "9/10"}}],
    "description": "Full 5000-char description with timestamps, keywords, links placeholders",
    "tags": ["tag1","tag2",...],
    "hashtags": ["#hash1","#hash2",...],
    "chapters": [{{"timestamp": "0:00", "title": "..."}}],
    "pinned_comment": "First comment to pin for engagement",
    "card_suggestions": [{{"timestamp": "...", "card_type": "video/playlist", "suggestion": "..."}}],
    "end_screen_strategy": "...",
    "keyword_density_target": {{"primary": "1.5-2%", "secondary": "0.5-1%"}},
    "upload_best_time": "Tuesday 2-4 PM EST",
    "thumbnail_text_suggestion": "..."
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_tags", prompt=prompt, model_pref=model_pref, system_prompt="YouTube SEO expert. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/sentiment")
async def sentiment(request: dict):
    keys = await get_keys()
    video_url = request.get("video_url", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_key = keys.get("serper", "")
    video_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"{video_url} comments reactions review", num=5)
            video_data = json.dumps(r.get("organic", [])[:3], indent=2)
        except:
            pass
    prompt = f"""Deep audience sentiment analysis for YouTube video: {video_url}. Data: {video_data}.
Respond JSON: {{
    "positive": "65%", "neutral": "25%", "negative": "10%",
    "top_topics": ["topic1","topic2"],
    "emotion_breakdown": {{"excited": "30%", "educated": "25%", "entertained": "20%", "frustrated": "10%", "neutral": "15%"}},
    "content_requests": ["audience wants..."],
    "pain_points": ["..."],
    "praise_themes": ["..."],
    "sentiment_trend": "Improving/Stable/Declining",
    "engagement_quality": "High/Medium/Low",
    "brand_perception": "...",
    "viral_comments_type": "Questions/Praise/Debates",
    "next_video_recommendations": [{{"title": "...", "based_on": "..."}}],
    "monetization_signals": ["mentions buying", "..."],
    "summary": "Detailed analysis"
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_sentiment", prompt=prompt, model_pref=model_pref, system_prompt="YouTube audience analyst. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/script-generator")
async def script_generator(request: dict):
    """Full YouTube script generator."""
    keys = await get_keys()
    topic = request.get("topic", "")
    duration = request.get("duration", "10")
    style = request.get("style", "educational")
    target_audience = request.get("target_audience", "general")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Write a complete {duration}-minute YouTube script for: "{topic}".
Style: {style} | Audience: {target_audience}
Respond JSON: {{
    "title": "...",
    "hook": "First 30 seconds verbatim...",
    "intro": "Next 60 seconds...",
    "main_sections": [{{"heading": "...", "script": "...", "duration": "...", "b_roll": "..."}}],
    "cta": "Subscribe/Like CTA text",
    "outro": "Closing 30 seconds",
    "full_script": "Complete verbatim script",
    "word_count": 1500,
    "speaking_notes": ["slow down here", "pause for effect"],
    "chapter_timestamps": [{{"time": "0:00", "section": "..."}}],
    "thumbnail_moments": ["Best screenshot-able moments"],
    "keywords_to_mention": ["keyword1", "keyword2"]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_script_gen", prompt=prompt, model_pref=model_pref, system_prompt="Professional YouTube scriptwriter. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/channel-audit")
async def channel_audit(request: dict):
    """Full channel SEO and strategy audit."""
    keys = await get_keys()
    channel_url = request.get("channel_url", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    serper_key = keys.get("serper", "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    channel_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search_youtube(query=channel_url, num=15)
            channel_data = json.dumps(r.get("videos", r.get("organic", []))[:8], indent=2)
        except:
            pass
    prompt = f"""Complete channel audit for: "{channel_url}". Data: {channel_data}.
Respond JSON: {{
    "channel_score": "7.5/10",
    "branding_score": "...",
    "seo_score": "...",
    "content_consistency_score": "...",
    "upload_schedule": "...",
    "niche_clarity": "Strong/Weak/Mixed",
    "monetization_readiness": {{"adsense_eligible": true, "rpm_estimate": "$X-$Y", "sponsor_rate": "$X per 1000 views"}},
    "critical_issues": [{{"issue": "...", "impact": "High", "fix": "..."}}],
    "quick_wins": [{{"action": "...", "effort": "Low", "potential_impact": "..."}}],
    "30_day_action_plan": [{{"week": 1, "actions": ["...", "..."]}}],
    "growth_forecast": {{"current_trajectory": "...", "optimized_trajectory": "..."}}
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="yt_channel_audit", prompt=prompt, model_pref=model_pref, system_prompt="YouTube channel strategist. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}
