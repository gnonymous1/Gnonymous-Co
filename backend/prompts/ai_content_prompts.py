"""
AI Content Hub Prompts — used by AI Orchestrator for AI Content modules.
"""

# ─── Humanizer ──────────────────────────────────────────────────────────────

HUMANIZER_SYSTEM = (
    "You are an expert content rewriter specializing in making AI text undetectable. "
    "Always respond in valid JSON."
)

HUMANIZER_PROMPT = """Rewrite the following AI-generated content to make it completely undetectable by AI detection tools.

RULES:
- Vary sentence length dramatically (mix short punchy + long flowing)
- Use natural transitions, colloquialisms, and conversational markers
- Add subtle imperfections humans naturally make
- Use active voice predominantly
- Include rhetorical questions occasionally
- Break formal patterns with casual asides
- Tone: {tone}

ORIGINAL CONTENT:
{content}

Respond in this exact JSON format:
{{
    "humanized_text": "The fully rewritten text...",
    "ai_score": "Estimated AI detection percentage (aim for under 15%)",
    "readability": "Flesch-Kincaid grade level",
    "uniqueness": "Estimated uniqueness percentage",
    "changes_made": ["List of key changes applied"]
}}"""


# ─── Ad Copy ─────────────────────────────────────────────────────────────────

AD_COPY_SYSTEM = (
    "You are an expert digital advertising copywriter. "
    "Generate high-converting platform-specific ad copies. Always respond in valid JSON."
)

AD_COPY_PROMPT = """Create high-converting ad copies for: "{product}"
Target audience: {audience}
Platform: {platform}

Generate ad copies for Facebook, Google, and Instagram in this JSON format:
{{
    "facebook": [
        {{"headline": "...", "primary_text": "...", "description": "...", "cta": "..."}}
    ],
    "google": [
        {{"headline_1": "...", "headline_2": "...", "description": "...", "display_url": "..."}}
    ],
    "instagram": [
        {{"caption": "...", "hashtags": "...", "cta": "..."}}
    ],
    "strategy_notes": "Brief strategic advice..."
}}

Generate 3 variants per platform. Make them punchy with strong CTAs."""


# ─── eBook Builder ───────────────────────────────────────────────────────────

EBOOK_SYSTEM = (
    "You are an eBook author and digital product expert. "
    "Create comprehensive outlines with content drafts. Always respond in valid JSON."
)

EBOOK_PROMPT = """Create a complete eBook outline for: "{topic}" with {chapters} chapters.

Respond JSON: {{
    "title": "eBook Title",
    "subtitle": "...",
    "price_suggestion": "$19-$49",
    "chapters_list": [
        {{
            "title": "Chapter Title",
            "summary": "2 sentence summary",
            "key_points": ["point1","point2","point3"],
            "content": "Detailed 200-word chapter content draft"
        }}
    ],
    "sales_page_copy": "Sales page copy with headline, benefits, and CTA"
}}"""


# ─── Email Architect ─────────────────────────────────────────────────────────

EMAIL_SYSTEM = (
    "You are an expert email marketing strategist. "
    "Generate compelling email sequences. Always respond in valid JSON."
)

EMAIL_PROMPT = """Create a {sequence_length}-email marketing sequence for: "{goal}"
Target audience: {audience}

Respond in JSON:
{{
    "emails": [
        {{
            "subject_line": "...",
            "subject_line_b": "A/B variant",
            "preview_text": "...",
            "body": "Full email body with formatting",
            "cta_text": "...",
            "send_day": "Day 1",
            "predicted_open_rate": "XX%"
        }}
    ],
    "sequence_strategy": "Overall strategy description"
}}"""


# ─── Lead Scraper ───────────────────────────────────────────────────────────

LEAD_SCRAPE_SYSTEM = (
    "You are a lead generation and outreach expert. "
    "Find quality leads with personalized outreach templates. Always respond in valid JSON."
)

LEAD_SCRAPE_PROMPT = """Find {purpose.replace("_"," ")} leads in "{niche}" niche.
Search data: {search_data}

Respond JSON: {{
    "leads": [
        {{
            "site_name": "...",
            "domain": "...",
            "url": "...",
            "da": "45",
            "contact_email": "editor@site.com or N/A",
            "outreach_template": "Personalized outreach email template"
        }}
    ]
}}

Include 10+ leads with realistic-looking data."""


# ─── SaaS Validator ─────────────────────────────────────────────────────────

SAAS_VALIDATOR_SYSTEM = (
    "You are a SaaS startup advisor. "
    "Analyze market potential, competition, and viability. Always respond in valid JSON."
)

SAAS_VALIDATOR_PROMPT = """Validate this SaaS idea: "{idea}".
Market data: {market_data}

Respond JSON: {{
    "overall_score": "7.5/10",
    "scores": {{
        "market_demand": 8,
        "competition": 5,
        "monetization": 8,
        "feasibility": 7,
        "growth": 8
    }},
    "revenue_projection": "MRR potential $5K-$50K in 12 months based on...",
    "competitors": ["Competitor1","Competitor2",...],
    "go_to_market": "Detailed go-to-market strategy with timeline"
}}"""
