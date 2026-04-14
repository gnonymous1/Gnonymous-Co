"""Optimized SEO Prompt Templates with Enhanced Structure and Efficiency"""

# ─── Base System Prompts ────────────────────────────────────────────────────
BASE_SYSTEM_PROMPT = """You are an expert AI assistant specializing in {domain}. Respond ONLY in valid JSON format.
Follow these strict guidelines:
1. Be concise yet comprehensive
2. Prioritize actionable insights
3. Use data-driven analysis
4. Provide clear recommendations
5. Never exceed response limits"""

# ─── SEO Analysis Prompts ────────────────────────────────────────────────────
SERP_ANALYSIS_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT.format(domain="SEO and search engine analysis")

SERP_ANALYSIS_PROMPT = """Analyze the following Google SERP data for keyword "{keyword}".

## SERP Data:
{serp_data}

## Analysis Requirements:
1. Domain Authority Analysis: Estimate DA (1-100) for each result
2. Content Type Classification: Identify content types (blog, product, video, etc.)
3. Content Length Estimation: Average word count for top results
4. Content Gap Identification: 3-5 topics not covered by current results
5. Ranking Factor Analysis: Top 5 factors influencing rankings
6. Keyword Difficulty: Rate as Easy/Medium/Hard/Very Hard
7. Search Intent: Informational/Commercial/Transactional/Navigational
8. Strategic Recommendation: Actionable SEO strategy

## JSON Response Schema:
{{
    "keyword": "{keyword}",
    "analyzed_results": [
        {{
            "position": 1,
            "title": "string",
            "url": "string",
            "domain": "string",
            "estimated_da": 85,
            "content_type": "blog post",
            "word_count": 2500,
            "backlinks_estimated": 150
        }}
    ],
    "insights": {{
        "avg_content_length": 2500,
        "avg_da": 65,
        "content_gaps": ["gap1", "gap2", "gap3"],
        "ranking_factors": ["factor1", "factor2"],
        "difficulty": "Medium",
        "search_intent": "Informational",
        "competition_level": "Moderate"
    }},
    "recommendation": {{
        "strategy": "Detailed strategic recommendation...",
        "action_items": ["item1", "item2", "item3"],
        "content_guidance": "Specific content creation advice..."
    }}
}}

## Optimization Notes:
- Focus on actionable insights
- Prioritize data accuracy
- Provide specific recommendations
- Keep response concise but comprehensive"""

# ─── Keyword Research Prompts ────────────────────────────────────────────────
KEYWORD_RESEARCH_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT.format(domain="keyword research and analysis")

KEYWORD_RESEARCH_PROMPT = """Generate comprehensive keyword research for seed keyword "{seed_keyword}" in niche "{niche}".

## Requirements:
1. Keyword Clusters: Group related keywords by topic
2. Search Volume: Estimate monthly search volume
3. Difficulty Score: Rate keyword difficulty (1-100)
4. Intent Classification: Identify search intent
5. Commercial Potential: Flag commercial intent keywords
6. Long-tail Opportunities: Identify low-competition long-tail keywords
7. Question Keywords: Extract common question-based queries
8. Competitor Analysis: Suggest competitor keywords to target

## JSON Response Schema:
{{
    "seed_keyword": "{seed_keyword}",
    "niche": "{niche}",
    "keyword_clusters": [
        {{
            "topic": "Main Topic",
            "keywords": [
                {{
                    "keyword": "example keyword",
                    "volume": 1000,
                    "difficulty": 45,
                    "intent": "Informational",
                    "commercial": false,
                    "opportunity_score": 85
                }}
            ]
        }}
    ],
    "long_tail_opportunities": ["keyword1", "keyword2"],
    "question_keywords": ["question1", "question2"],
    "strategy": {{
        "primary_targets": ["keyword1", "keyword2"],
        "secondary_targets": ["keyword3", "keyword4"],
        "content_gaps": ["gap1", "gap2"]
    }}
}}

## Optimization Notes:
- Focus on high-opportunity keywords
- Prioritize commercial intent where relevant
- Include question-based keywords for featured snippets
- Provide clear content strategy recommendations"""

# ─── Backlink Analysis Prompts ──────────────────────────────────────────────
BACKLINK_ANALYSIS_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT.format(domain="backlink analysis and strategy")

BACKLINK_ANALYSIS_PROMPT = """Analyze backlink profile for target URL "{target_url}" compared to competitors {competitors}.

## Analysis Requirements:
1. Backlink Quality: Assess domain authority of linking sites
2. Link Diversity: Analyze link source diversity
3. Anchor Text: Extract and categorize anchor text
4. Link Gaps: Identify backlink opportunities competitors have
5. Toxic Links: Flag potentially harmful backlinks
6. Link Growth: Analyze backlink acquisition trends
7. Competitive Analysis: Compare against competitor profiles

## JSON Response Schema:
{{
    "target_url": "{target_url}",
    "backlink_profile": {{
        "total_backlinks": 500,
        "referring_domains": 120,
        "domain_authority": 65,
        "trust_flow": 45,
        "citation_flow": 55
    }},
    "link_quality": {{
        "high_quality": 60,
        "medium_quality": 30,
        "low_quality": 10,
        "toxic": 5
    }},
    "anchor_text_distribution": {{
        "branded": 40,
        "exact_match": 25,
        "partial_match": 20,
        "generic": 15
    }},
    "link_gaps": [
        {{
            "competitor": "competitor.com",
            "missing_links": ["link1.com", "link2.com"],
            "opportunity_score": 85
        }}
    ],
    "recommendations": {{
        "link_building_strategy": "Detailed strategy...",
        "toxic_link_removal": ["link1.com", "link2.com"],
        "high_priority_targets": ["target1.com", "target2.com"]
    }}
}}

## Optimization Notes:
- Focus on quality over quantity
- Prioritize high-authority link opportunities
- Provide actionable link building strategies
- Include toxic link identification and removal recommendations"""

# ─── Technical SEO Prompts ─────────────────────────────────────────────────
TECHNICAL_SEO_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT.format(domain="technical SEO analysis")

TECHNICAL_SEO_PROMPT = """Perform comprehensive technical SEO audit for URL "{url}".

## Audit Requirements:
1. Page Speed: Analyze performance metrics
2. Mobile Friendliness: Assess mobile optimization
3. Crawlability: Check robots.txt and meta tags
4. Indexability: Verify search engine accessibility
5. Structured Data: Validate schema markup
6. URL Structure: Analyze URL optimization
7. Internal Linking: Assess internal link structure
8. Security: Check HTTPS implementation
9. Core Web Vitals: Evaluate LCP, FID, CLS

## JSON Response Schema:
{{
    "url": "{url}",
    "performance": {{
        "lighthouse_score": 85,
        "lcp": 1.2,
        "fid": 0.05,
        "cls": 0.1,
        "speed_index": 2.3
    }},
    "mobile_friendly": true,
    "crawlability": {{
        "robots_txt": "Allowed",
        "meta_robots": "index,follow",
        "canonical": "Properly implemented"
    }},
    "indexability": {{
        "status": "Indexable",
        "issues": ["No major issues"]
    }},
    "structured_data": {{
        "valid": true,
        "types": ["Article", "Breadcrumb"],
        "issues": []
    }},
    "issues": [
        {{
            "severity": "High/Medium/Low",
            "description": "Issue description",
            "recommendation": "Fix recommendation"
        }}
    ],
    "prioritized_fixes": ["fix1", "fix2", "fix3"]
}}

## Optimization Notes:
- Prioritize issues by impact and difficulty
- Provide specific technical recommendations
- Include Core Web Vitals optimization guidance
- Focus on actionable fixes with clear instructions"""

# ─── Content Optimization Prompts ───────────────────────────────────────────
CONTENT_OPTIMIZATION_SYSTEM_PROMPT = BASE_SYSTEM_PROMPT.format(domain="content optimization")

CONTENT_OPTIMIZATION_PROMPT = """Optimize content for target keyword "{keyword}" with focus on "{content_type}".

## Optimization Requirements:
1. Content Structure: Recommended headings and sections
2. Keyword Placement: Optimal keyword density and placement
3. Readability: Improve content readability
4. Semantic SEO: Related terms and entities
5. Content Length: Optimal word count
6. Multimedia: Image and video recommendations
7. Internal Linking: Suggest relevant internal links
8. Schema Markup: Recommended structured data

## JSON Response Schema:
{{
    "keyword": "{keyword}",
    "content_type": "{content_type}",
    "optimization": {{
        "title": "Optimized title suggestion",
        "meta_description": "Optimized meta description",
        "headings": ["H1", "H2", "H3"],
        "keyword_placement": {{
            "title": true,
            "url": false,
            "first_100_words": true,
            "subheadings": true
        }},
        "readability": {{
            "current_score": 65,
            "target_score": 80,
            "improvements": ["Use shorter sentences", "Add transition words"]
        }},
        "semantic_terms": ["term1", "term2", "term3"],
        "content_length": {{
            "current": 1500,
            "recommended": 2200,
            "rational": "Competitive analysis shows top results average 2200 words"
        }},
        "multimedia": {{
            "images": ["suggestion1", "suggestion2"],
            "videos": ["suggestion1"]
        }},
        "internal_links": ["/page1", "/page2"],
        "schema_recommendations": ["Article", "FAQ"]
    }}
}}

## Optimization Notes:
- Focus on user intent and content quality
- Provide specific content structure recommendations
- Include semantic SEO enhancements
- Recommend multimedia elements for engagement"""

# ─── Prompt Optimization Features ────────────────────────────────────────────
def optimize_prompt_for_model(prompt: str, model_tier: str) -> str:
    """Optimize prompt based on model capabilities"""
    if model_tier == "premium":
        return f"{prompt}\n\n## Additional Instructions for Premium Models:\n- Provide deeper analysis\n- Include more data points\n- Offer advanced recommendations"
    elif model_tier == "fast":
        return f"{prompt}\n\n## Simplified Instructions for Fast Models:\n- Focus on core requirements\n- Prioritize speed over depth\n- Keep response concise"
    else:  # standard
        return prompt

def add_contextual_data(prompt: str, additional_data: Dict[str, Any]) -> str:
    """Enhance prompt with additional contextual data"""
    context = "\n\n## Additional Context:\n"
    for key, value in additional_data.items():
        context += f"{key}: {value}\n"
    return f"{prompt}{context}"