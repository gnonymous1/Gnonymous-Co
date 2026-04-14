"""
YouTube Tool Prompts — used by AI Orchestrator for YouTube modules.
"""

# ─── Competitor Spy ──────────────────────────────────────────────────────────

COMPETITOR_SPY_SYSTEM = (
    "You are a YouTube growth strategist and data analyst. "
    "Always respond in valid JSON matching the specified schema."
)

COMPETITOR_SPY_PROMPT = """Analyze this YouTube channel: "{channel_url}"

Available data from search: {channel_data}

Create a comprehensive competitor analysis in this exact JSON format:
{{
    "channel_stats": {{
        "subscribers": "estimated count",
        "total_videos": "estimated count",
        "avg_views": "estimated average",
        "upload_frequency": "e.g., 3x per week"
    }},
    "top_videos": [
        {{"title": "...", "views": "...", "date": "...", "engagement": "High/Medium/Low"}}
    ],
    "trending_topics": ["topic1", "topic2", "topic3"],
    "content_strategy": "Description of their strategy",
    "ai_analysis": "Detailed strategic analysis with actionable insights on how to compete"
}}

Provide at least 8 top videos and 8 trending topics."""


# ─── Storyboard ──────────────────────────────────────────────────────────────

STORYBOARD_SYSTEM = (
    "You are a video storyboard artist. Break scripts into visually compelling scenes."
    "Always respond in valid JSON."
)

STORYBOARD_PROMPT = """Break this video script into 8-12 storyboard scenes.
Script: {script}

Each scene should have: narration, visual_prompt (for AI image generation), duration, timestamp range, and on_screen_text.
Respond JSON: {{"scenes": [{{"narration": "...", "visual_prompt": "...", "duration": "30s", "timestamp": "0:00-0:30", "on_screen_text": "..."}}]}}"""


# ─── Thumbnail Predictor ─────────────────────────────────────────────────────

THUMBNAIL_SYSTEM = (
    "You are a YouTube thumbnail optimization expert. Predict CTR and suggest improvements."
    "Always respond in valid JSON."
)

THUMBNAIL_PROMPT = """Predict thumbnail CTR and suggest designs for: "{title}".
Description: {description}

Respond JSON: {{
    "predicted_ctr": "8-12%",
    "emotion_score": "High/Medium/Low",
    "curiosity_score": "Strong/Medium/Weak",
    "suggestions": [
        {{"concept": "...", "description": "...", "colors": ["#hex1","#hex2"], "text_overlay": "text on thumbnail"}}
    ]
}}
Include 4 suggestions."""


# ─── Tags Optimizer ──────────────────────────────────────────────────────────

TAGS_SYSTEM = (
    "You are a YouTube SEO expert. Generate optimized metadata for maximum discoverability."
    "Always respond in valid JSON."
)

TAGS_PROMPT = """Generate SEO-optimized YouTube metadata for: "{video_title}"

Respond JSON: {{
    "optimized_titles": ["title1","title2","title3"],
    "description": "full optimized description with timestamps and links placeholders",
    "tags": ["tag1","tag2",...up to 20],
    "hashtags": ["#hash1","#hash2",...up to 8]
}}"""


# ─── Sentiment Analyzer ─────────────────────────────────────────────────────

SENTIMENT_SYSTEM = (
    "You are a YouTube audience analyst. Categorize sentiment and extract actionable insights."
    "Always respond in valid JSON."
)

SENTIMENT_PROMPT = """Analyze audience sentiment for this YouTube video: {video_url}.
Available data: {video_data}

Respond JSON: {{
    "positive": "65%",
    "neutral": "25%",
    "negative": "10%",
    "top_topics": ["topic1","topic2"],
    "content_requests": ["audience wants...",...],
    "summary": "detailed sentiment analysis"
}}"""
