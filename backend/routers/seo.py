import json
import httpx
import asyncio
from fastapi import APIRouter, HTTPException, Depends
from schemas.seo import SerpAnalyzeRequest, SerpAnalyzeResponse
from services.serper_client import SerperClient
from services.ai_orchestrator import AIOrchestrator
from prompts.seo_prompts import SERP_ANALYSIS_SYSTEM_PROMPT, SERP_ANALYSIS_PROMPT

router = APIRouter()

from services.key_registry import get_keys
from services.intelligent_scraper import get_scraper
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

scraper = get_scraper()

@router.post("/serp-analyze")
async def analyze_serp(request: SerpAnalyzeRequest, db: AsyncSession = Depends(get_db)):
    all_keys = await get_keys()
    serper_key = all_keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper.dev API key not configured.")
    
    # ... (rest of the logic remains similar but uses live scraping)
    serper_key = keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper.dev API key not configured.")
    ai_key = keys.get(request.model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{request.model_pref} API key not configured.")
    try:
        serper = SerperClient(serper_key)
        serp_data = await serper.search(query=request.keyword, country=request.country, language=request.language, num=100)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Serper.dev API error: {str(e)}")
    organic = serp_data.get("organic", [])
    formatted_results = []
    
    # Process top 5 results for deep analysis in parallel
    top_results_urls = [r.get("link", "") for r in organic[:5]]
    scraping_tasks = [scraper.scrape_url(url) for url in top_results_urls if url]
    scraped_contents = await asyncio.gather(*scraping_tasks)
    
    for i, result in enumerate(organic[:30], 1):
        content = scraped_contents[i-1] if i <= len(scraped_contents) else "Content not crawled."
        formatted_results.append({
            "position": i,
            "title": result.get("title", ""),
            "url": result.get("link", ""),
            "snippet": result.get("snippet", ""),
            "domain": result.get("link", "").split("/")[2] if result.get("link") else "",
            "crawled_content": content[:1000] # Pass snippet of content to AI
        })
    
    serp_data_str = json.dumps(formatted_results, indent=2)
    prompt = SERP_ANALYSIS_PROMPT.format(keyword=request.keyword, serp_data=serp_data_str)
    
    # Use the persistent AI key
    ai_key = all_keys.get(request.model_pref, "")
    orchestrator = AIOrchestrator({request.model_pref: ai_key})
    
    ai_response = await orchestrator.process(
        tool_id="seo_serp_analyzer", prompt=prompt, model_pref=request.model_pref, system_prompt=SERP_ANALYSIS_SYSTEM_PROMPT,
    )
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI Model error: {ai_response['error']}")
    ai_data = ai_response.get("data", {})
    analyzed = ai_data.get("analyzed_results", formatted_results)
    insights = ai_data.get("insights", {})
    return {
        "keyword": request.keyword,
        "total_results": len(organic),
        "top_results": analyzed[:30],
        "insights": {
            "avg_content_length": insights.get("avg_content_length", 0),
            "avg_da": insights.get("avg_da", 0),
            "content_gaps": insights.get("content_gaps", []),
            "ranking_factors": insights.get("ranking_factors", []),
            "difficulty": insights.get("difficulty", "Unknown"),
            "search_intent": insights.get("search_intent", "Unknown"),
        },
        "recommendation": ai_data.get("recommendation", ""),
        "model_used": ai_response.get("model_used", request.model_pref),
        "credits_used": ai_response.get("tokens_used"),
        "people_also_ask": serp_data.get("peopleAlsoAsk", [])[:8],
        "related_searches": serp_data.get("relatedSearches", [])[:10],
        "knowledge_graph": serp_data.get("knowledgeGraph", {}),
        "featured_snippet": serp_data.get("answerBox", {}),
    }


@router.post("/keyword-research")
async def keyword_research(request: dict):
    keys = await get_keys()
    seed = request.get("seed_keyword", "")
    niche = request.get("niche", "general")
    country = request.get("country", "us")
    target_intent = request.get("target_intent", "all")
    model_pref = request.get("model_pref", "gemini")
    language = request.get("language", "en")
    serper_key = keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper.dev API key required.")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} API key not configured.")
    try:
        serper = SerperClient(serper_key)
        serp_data = await serper.search(query=seed, country=country, num=20)
        autocomplete = await serper.autocomplete(query=seed)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Serper error: {str(e)}")
    related = serp_data.get("relatedSearches", [])
    suggestions = autocomplete.get("suggestions", [])
    people_ask = serp_data.get("peopleAlsoAsk", [])[:6]
    prompt = f"""You are an expert SEO keyword researcher.
Seed Keyword: "{seed}" | Niche: "{niche}" | Country: {country.upper()} | Intent: {target_intent}
Related: {json.dumps(related)} | Autocomplete: {json.dumps(suggestions)} | PAA: {json.dumps(people_ask)}

Respond in JSON:
{{
    "clusters": [{{"parent_topic": "...", "keywords": [{{"keyword": "...", "estimated_volume": "...", "difficulty": "Easy/Medium/Hard", "intent": "informational/commercial/transactional/navigational", "cpc": "$X.XX", "competition": "Low/Med/High"}}]}}],
    "long_tail_keywords": ["...", "..."],
    "question_keywords": ["...", "..."],
    "buyer_intent_keywords": ["...", "..."],
    "negative_keywords": ["...", "..."],
    "content_ideas": [{{"title": "...", "format": "article/video/list", "word_count": "...", "monetization": "..."}}],
    "seasonal_trends": [{{"month": "...", "opportunity": "..."}}],
    "competitor_gap_keywords": ["...", "..."]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(
        tool_id="seo_keyword_research", prompt=prompt, model_pref=model_pref,
        system_prompt="You are an SEO keyword research expert. Always respond in valid JSON."
    )
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {
        "seed_keyword": seed,
        "clusters": data.get("clusters", []),
        "long_tail_keywords": data.get("long_tail_keywords", []),
        "question_keywords": data.get("question_keywords", []),
        "buyer_intent_keywords": data.get("buyer_intent_keywords", []),
        "negative_keywords": data.get("negative_keywords", []),
        "content_ideas": data.get("content_ideas", []),
        "seasonal_trends": data.get("seasonal_trends", []),
        "competitor_gap_keywords": data.get("competitor_gap_keywords", []),
        "people_also_ask": people_ask,
        "related_searches": related,
        "model_used": ai_response.get("model_used", model_pref),
    }


@router.post("/backlink-audit")
async def backlink_audit(request: dict):
    keys = await get_keys()
    target_url = request.get("target_url", "")
    competitors = request.get("competitors", [])
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    serper_key = keys.get("serper", "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    search_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"backlinks {target_url}", num=10)
            search_data = json.dumps(r.get("organic", [])[:5], indent=2)
        except:
            pass
    comp_str = ", ".join(competitors) if competitors else "none provided"
    prompt = f"""Analyze backlink profile for {target_url} vs competitors: {comp_str}. Data: {search_data}.
Respond JSON: {{
  "your_backlinks": "estimated count",
  "domain_authority": "estimated DA 1-100",
  "trust_flow": "estimated TF",
  "link_velocity": "Growing/Stable/Declining",
  "toxic_links": [{{"domain": "...", "reason": "...", "action": "Disavow/Keep"}}],
  "link_gaps": [{{"domain": "...", "da": "...", "type": "Guest Post/Resource/Directory", "url": "...", "difficulty": "Easy/Medium/Hard"}}],
  "anchor_text_distribution": [{{"anchor": "...", "percentage": "...", "type": "brand/naked/keyword/generic"}}],
  "competitor_comparison": [{{"domain": "...", "backlinks": "...", "da": "...", "advantage": "..."}}],
  "easy_wins": [{{"domain": "...", "strategy": "...", "estimated_da": "...", "contact": "..."}}],
  "disavow_candidates": ["domain1.com", "domain2.com"],
  "recommendation": "strategic advice"
}}. Include 8+ link gaps, 5+ easy wins."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(tool_id="seo_backlinks", prompt=prompt, model_pref=model_pref, system_prompt="SEO backlink expert. Valid JSON only.")
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    data = ai_response.get("data", {})
    return {**data, "model_used": ai_response.get("model_used", model_pref)}


@router.post("/track-rank")
async def track_rank(request: dict):
    keys = await get_keys()
    domain = request.get("domain", "")
    kw_list = request.get("keywords", [])
    serper_key = keys.get("serper", "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper key required.")
    serper = SerperClient(serper_key)
    rankings = []
    for kw in kw_list[:15]:
        try:
            r = await serper.search(query=kw, num=50)
            organic = r.get("organic", [])
            pos = None
            top_comp = ""
            url_at_pos = ""
            for i, item in enumerate(organic, 1):
                link = item.get("link", "")
                if domain.lower() in link.lower():
                    pos = i
                    url_at_pos = link
                if i == 1:
                    top_comp = link.split("/")[2] if "/" in link else link
            featured = bool(r.get("answerBox"))
            rankings.append({
                "keyword": kw,
                "position": pos or 100,
                "change": 0,
                "top_competitor": top_comp,
                "your_url": url_at_pos,
                "featured_snippet": featured,
                "search_volume": r.get("searchParameters", {}).get("num", "N/A"),
                "total_results": len(organic),
            })
        except:
            rankings.append({"keyword": kw, "position": None, "change": 0, "top_competitor": "Error", "featured_snippet": False})
    return {"domain": domain, "rankings": rankings, "total_keywords": len(rankings), "top_10_count": sum(1 for r in rankings if r.get("position") and r["position"] <= 10)}


@router.post("/tech-audit")
async def tech_audit(request: dict):
    keys = await get_keys()
    url = request.get("url", "")
    model_pref = request.get("model_pref", "gemini")
    strategy = request.get("strategy", "desktop")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    pagespeed_data = {}
    try:
        from services.pagespeed_client import PageSpeedClient
        ps_client = PageSpeedClient()
        pagespeed_data = await ps_client.analyze(url=url, strategy=strategy)
        parsed = ps_client.parse_lighthouse_result(pagespeed_data)
        pagespeed_str = json.dumps(parsed, indent=2)
    except Exception as e:
        pagespeed_str = f"PageSpeed unavailable: {str(e)}"
    serper_key = keys.get("serper", "")
    site_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"site:{url} performance review", num=5)
            site_data = json.dumps(r.get("organic", [])[:3], indent=2)
        except:
            pass
    prompt = (
        f"Perform a complete technical SEO audit for: {url}\n"
        f"Strategy: {strategy}\nPageSpeed: {pagespeed_str}\nSearch data: {site_data}\n\n"
        'Respond JSON: {'
        '"scores": {"performance": 75, "seo": 85, "accessibility": 90, "best_practices": 80}, '
        '"core_web_vitals": {"lcp": "2.5s", "fid": "100ms", "cls": "0.1", "inp": "200ms", "ttfb": "800ms"}, '
        '"issues": [{"title": "...", "description": "...", "severity": "high/medium/low", "fix": "...", "estimated_impact": "..."}], '
        '"structured_data": {"found": true, "types": ["Article", "FAQPage"]}, '
        '"mobile_usability": {"score": 90, "issues": []}, '
        '"security": {"https": true, "hsts": true, "mixed_content": false}, '
        '"crawlability": {"robots_txt": "...", "sitemap": "...", "canonicals": "..."}, '
        '"recommendation": "detailed fix instructions"}'
        "\nInclude 12+ issues prioritized by impact."
    )
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(tool_id="seo_tech_audit", prompt=prompt, model_pref=model_pref, system_prompt="Technical SEO auditor. Valid JSON only.")
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    result = ai_response.get("data", {})
    return {**result, "model_used": ai_response.get("model_used", model_pref)}


@router.post("/local-seo")
async def local_seo(request: dict):
    keys = await get_keys()
    business_name = request.get("business_name", "")
    location = request.get("location", "")
    model_pref = request.get("model_pref", "gemini")
    business_type = request.get("business_type", "general")
    serper_key = keys.get("serper", "")
    ai_key = keys.get(model_pref, "")
    if not serper_key:
        raise HTTPException(status_code=400, detail="Serper key required.")
    serper = SerperClient(serper_key)
    query = f"{business_name} {location}" if location else business_name
    try:
        local_data = await serper.search_local(query=query, location=location or "United States")
    except:
        local_data = await serper.search(query=query, num=10)
    places = local_data.get("places", local_data.get("organic", []))[:10]
    if ai_key:
        prompt = f"""Local SEO analysis for "{business_name}" in "{location}" (Type: {business_type}).
Competitors: {json.dumps(places[:5])}
Respond JSON: {{
  "gmb_score": "8/10",
  "gmb_recommendations": [{{"action": "...", "impact": "High/Medium", "priority": 1}}],
  "citation_opportunities": [{{"site": "...", "url": "...", "category": "...", "da": "..."}}],
  "local_keywords": [{{"keyword": "...", "monthly_searches": "...", "difficulty": "..."}}],
  "competitor_analysis": [{{"name": "...", "rating": "...", "reviews": "...", "strengths": "...", "weaknesses": "..."}}],
  "review_strategy": "...",
  "schema_recommendations": ["LocalBusiness", "..."],
  "map_pack_strategy": "...",
  "insights": "..."
}}"""
        orchestrator = AIOrchestrator({model_pref: ai_key})
        r = await orchestrator.process(tool_id="seo_local", prompt=prompt, model_pref=model_pref, system_prompt="Local SEO expert. Valid JSON only.")
        ai_data = r.get("data", {})
        return {**ai_data, "local_results": places, "model_used": r.get("model_used", model_pref)}
    return {"local_results": places, "insights": "Configure AI key for deep analysis."}


@router.post("/snippet-hunt")
async def snippet_hunt(request: dict):
    keys = await get_keys()
    niche = request.get("niche", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    serper_key = keys.get("serper", "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    search_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"{niche} featured snippet", num=10)
            search_data = json.dumps(r.get("organic", [])[:5], indent=2)
            paa = json.dumps(r.get("peopleAlsoAsk", [])[:6], indent=2)
        except:
            paa = "[]"
    prompt = f"""Find featured snippet opportunities in "{niche}". Data: {search_data}. PAA: {paa}.
Respond JSON: {{
  "snippets": [{{"question": "...", "current_holder": "domain.com", "snippet_type": "Paragraph/List/Table/Video", "difficulty": "Easy/Medium/Hard", "strategy": "...", "suggestion": "...", "word_count_needed": "40-60", "schema_type": "FAQPage/HowTo/..."}}],
  "paa_opportunities": [{{"question": "...", "opportunity_score": "8/10", "content_to_create": "..."}}],
  "voice_search_phrases": ["...", "..."],
  "rich_result_opportunities": [{{"type": "Recipe/FAQ/How-To", "keyword": "...", "difficulty": "..."}}]
}}. Include 12+ snippet opportunities."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(tool_id="seo_snippets", prompt=prompt, model_pref=model_pref, system_prompt="Featured snippet expert. Valid JSON only.")
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    return {**ai_response.get("data", {}), "model_used": ai_response.get("model_used", model_pref)}


@router.post("/internal-links")
async def internal_links(request: dict):
    keys = await get_keys()
    sitemap_url = request.get("sitemap_url", "")
    target_page = request.get("target_page", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    serper_key = keys.get("serper", "")
    site_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            domain = sitemap_url.replace("https://", "").replace("http://", "").split("/")[0]
            r = await serper.search(query=f"site:{domain}", num=20)
            site_data = json.dumps([{"title": o.get("title"), "url": o.get("link")} for o in r.get("organic", [])[:15]], indent=2)
        except:
            pass
    prompt = f"""Analyze internal linking for {sitemap_url}. Target: {target_page or "N/A"}. Pages: {site_data}.
Respond JSON: {{
  "suggestions": [{{"source": "page URL", "target": "page URL", "anchor_text": "...", "reason": "...", "impact": "High/Medium", "relevance": "Topical/Authority", "page_authority_boost": "..%"}}],
  "orphan_pages": ["url1", "url2"],
  "hub_pages": [{{"url": "...", "links_in": "...", "topic_cluster": "..."}}],
  "silo_structure": [{{"cluster": "...", "pillar": "...", "supporting_pages": ["..."]}}],
  "priority_actions": [{{"action": "...", "pages_affected": "...", "estimated_impact": "..."}}]
}}. Include 12+ suggestions."""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    ai_response = await orchestrator.process(tool_id="seo_internal_links", prompt=prompt, model_pref=model_pref, system_prompt="Internal linking strategist. Valid JSON only.")
    if "error" in ai_response:
        raise HTTPException(status_code=502, detail=f"AI error: {ai_response['error']}")
    return {**ai_response.get("data", {}), "model_used": ai_response.get("model_used", model_pref)}


@router.post("/content-gap")
async def content_gap(request: dict):
    """Content Gap Analyzer — Find what competitors rank for but you don't."""
    keys = await get_keys()
    your_domain = request.get("your_domain", "")
    competitor_domains = request.get("competitor_domains", [])
    niche = request.get("niche", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    serper_key = keys.get("serper", "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    comp_data = {}
    if serper_key:
        serper = SerperClient(serper_key)
        for comp in competitor_domains[:3]:
            try:
                r = await serper.search(query=f"site:{comp} {niche}", num=10)
                comp_data[comp] = [{"title": o.get("title"), "url": o.get("link")} for o in r.get("organic", [])[:5]]
            except:
                pass
    prompt = f"""Content Gap Analysis: your domain={your_domain}, competitors={competitor_domains}, niche={niche}.
Competitor content: {json.dumps(comp_data)}.
Respond JSON: {{
  "gaps": [{{"topic": "...", "competitors_ranking": ["dom1","dom2"], "search_volume": "...", "difficulty": "...", "opportunity_score": "9/10", "content_type": "article/video/tool", "suggested_title": "..."}}],
  "your_advantages": [{{"topic": "...", "your_position": "...", "competitors_missing": true}}],
  "quick_wins": [{{"keyword": "...", "competitor": "...", "their_weakness": "...", "your_strategy": "..."}}],
  "content_calendar": [{{"week": 1, "topic": "...", "format": "...", "priority": "High"}}]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="seo_content_gap", prompt=prompt, model_pref=model_pref, system_prompt="Content gap analyst. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/ai-writer")
async def ai_writer(request: dict):
    """AI Article Writer — Generate full SEO articles."""
    keys = await get_keys()
    keyword = request.get("keyword", "")
    tone = request.get("tone", "informational")
    word_count = request.get("word_count", 1500)
    model_pref = request.get("model_pref", "gemini")
    include_faq = request.get("include_faq", True)
    ai_key = keys.get(model_pref, "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    prompt = f"""Write a complete SEO-optimized article for keyword: "{keyword}".
Tone: {tone} | Target: ~{word_count} words | Include FAQ: {include_faq}
Respond JSON: {{
  "title": "H1 title",
  "meta_description": "155 char meta",
  "article": "Full markdown article with H2/H3 headers...",
  "faq": [{{"question": "...", "answer": "..."}}],
  "word_count": {word_count},
  "reading_time": "X mins",
  "primary_keyword_density": "1.5%",
  "lsi_keywords": ["...", "..."],
  "schema_markup": {{"@type": "Article", "headline": "..."}}
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="seo_ai_writer", prompt=prompt, model_pref=model_pref, system_prompt="Expert SEO content writer. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}


@router.post("/competitor-analysis")
async def competitor_analysis(request: dict):
    """Deep competitor SEO analysis."""
    keys = await get_keys()
    competitor_url = request.get("competitor_url", "")
    your_url = request.get("your_url", "")
    model_pref = request.get("model_pref", "gemini")
    ai_key = keys.get(model_pref, "")
    serper_key = keys.get("serper", "")
    if not ai_key:
        raise HTTPException(status_code=400, detail=f"{model_pref} key required.")
    search_data = ""
    if serper_key:
        try:
            serper = SerperClient(serper_key)
            r = await serper.search(query=f"site:{competitor_url}", num=10)
            search_data = json.dumps(r.get("organic", [])[:5], indent=2)
        except:
            pass
    prompt = f"""Deep competitor analysis: competitor={competitor_url}, you={your_url}. Data: {search_data}.
Respond JSON: {{
  "competitor_profile": {{"da": "...", "traffic": "...", "top_pages": [...], "content_strategy": "..."}},
  "keyword_opportunities": [{{"keyword": "...", "their_position": "...", "your_position": "...", "opportunity": "..."}}],
  "content_weaknesses": [{{"topic": "...", "their_content_quality": "Low/Med/High", "your_opportunity": "..."}}],
  "backlink_strategy": "...",
  "technical_advantages": ["..."],
  "action_plan": [{{"action": "...", "priority": "High/Med", "timeline": "...", "expected_impact": "..."}}]
}}"""
    orchestrator = AIOrchestrator({model_pref: ai_key})
    r = await orchestrator.process(tool_id="seo_competitor", prompt=prompt, model_pref=model_pref, system_prompt="SEO competitor analyst. Valid JSON only.")
    if "error" in r:
        raise HTTPException(status_code=502, detail=f"AI error: {r['error']}")
    return {**r.get("data", {}), "model_used": r.get("model_used", model_pref)}
