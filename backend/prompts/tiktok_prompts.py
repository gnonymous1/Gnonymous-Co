"""
TikTok & Reels Tool Prompts — used by AI Orchestrator for TikTok modules.
"""

# ─── Hook Generator ─────────────────────────────────────────────────────────

HOOK_SYSTEM = (
    "You are a viral short-form content strategist. "
    "Generate hooks that stop the scroll instantly. Always respond in valid JSON."
)

HOOK_PROMPT = """Generate 10 viral TikTok/Reels hooks for the first 3 seconds of a video about: "{topic}"
Target audience: {audience}

Each hook must stop the scroll instantly. Mix these styles:
- Questions that create curiosity gaps
- Shocking statistics or facts
- Story openers ("I was broke until...")
- Direct challenges ("You're doing X wrong")
- Controversial takes

Respond in this exact JSON format:
{{
    "hooks": [
        {{
            "text": "The actual hook text to say in the first 3 seconds",
            "style": "question|shock|story|challenge|controversy",
            "estimated_retention": "85%",
            "why_it_works": "Brief explanation"
        }}
    ]
}}

Make hooks punchy, direct, and impossible to scroll past."""


# ─── Trend Scout ─────────────────────────────────────────────────────────────

TREND_SYSTEM = (
    "You are a TikTok trend analyst. Identify trending content patterns."
    "Always respond in valid JSON."
)

TREND_PROMPT = """As a TikTok trend analyst, identify the top trending content in the "{category}" category for {country}.

Search data: {trend_data}

Respond in this JSON format:
{{
    "trending_audios": [{{"name": "...", "artist": "...", "usage_count": "...", "trend_velocity": "Rising/Peak/Declining"}}],
    "trending_hashtags": [{{"tag": "#...", "views": "...", "growth": "+X%"}}],
    "trending_formats": [{{"format": "...", "description": "...", "example": "..."}}],
    "recommendation": "Strategic advice..."
}}

Include at least 5 audios, 8 hashtags, and 4 formats."""


# ─── Script Converter ────────────────────────────────────────────────────────

CONVERT_SYSTEM = (
    "You are a viral short-form content writer. Convert long content to punchy shorts."
    "Always respond in valid JSON."
)

CONVERT_PROMPT = """Convert this long-form content into exactly 5 short-form scripts (60 seconds each) for TikTok/Reels/Shorts:

CONTENT:
{long_content}

Each script must:
- Have a killer hook in the first 3 seconds
- Be under 150 words (60 seconds spoken)
- End with a strong CTA

Respond in JSON:
{{
    "scripts": [
        {{
            "hook": "First 3 seconds hook",
            "script": "Full script text...",
            "duration": "~60s",
            "word_count": 140,
            "cta": "Call to action"
        }}
    ]
}}"""


# ─── Engagement Analytics ───────────────────────────────────────────────────

ENGAGEMENT_SYSTEM = (
    "You are a TikTok analytics expert. Analyze engagement patterns and provide recommendations."
    "Always respond in valid JSON."
)

ENGAGEMENT_PROMPT = """Analyze TikTok engagement for: {profile_url}.
Data: {search_data}

Respond JSON: {{
    "avg_views": "100K",
    "avg_likes": "10K",
    "engagement_rate": "9.5%",
    "best_time": "7-9 PM EST",
    "top_performing": [{{"theme": "...", "performance": "High/Medium"}}],
    "recommendations": ["tip1","tip2",...]
}}"""


# ─── Post Ranker ─────────────────────────────────────────────────────────────

POST_RANK_SYSTEM = (
    "You are a TikTok FYP ranking analyst. Evaluate posts for algorithmic potential."
    "Always respond in valid JSON."
)

POST_RANK_PROMPT = """Analyze TikTok FYP rankings for "{keyword}".
Data: {search_data}

Respond JSON: {{
    "top_posts": [{{"caption": "...", "views": "1.2M", "engagement": "12%", "hashtags": "#tag1 #tag2", "velocity": "Rising/Stable/Declining"}}],
    "optimization_tips": ["tip1","tip2",...]
}}

Include 10 posts."""
