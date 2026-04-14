MOCK_DATA = {
    "seo_serp_analyzer": {
        "analyzed_results": [],
        "insights": {
            "avg_content_length": 1500,
            "avg_da": 45,
            "content_gaps": ["Missing video content", "Lack of FAQ section"],
            "ranking_factors": ["High backlink count", "Keyword in H1"],
            "difficulty": "Medium",
            "search_intent": "Informational"
        },
        "recommendation": "# Strategic SEO Roadmap\n## 1. Content Expansion\nFocus on creating **long-form content** (2,000+ words) with embedded video tutorials.\n\n## 2. Technical Fixes\n- Implement Schema.org FAQ markup\n- Optimize LCP for mobile users"
    },
    "seo_keyword_research": {
        "clusters": [
            {
                "parent_topic": "Content Creation",
                "keywords": [
                    {"keyword": "how to create content", "estimated_volume": "High", "difficulty": "Low", "intent": "Informational"},
                    {"keyword": "content creation tools", "estimated_volume": "Medium", "difficulty": "Medium", "intent": "Commercial"}
                ]
            }
        ],
        "long_tail_keywords": ["best content creation strategy 2026", "how to start content creation for beginners"],
        "question_keywords": ["what is content creation?", "how to repurpose content?"]
    },
    "seo_backlinks": {
        "your_backlinks": "1,200",
        "link_gaps": [
            {"domain": "forbes.com", "da": "95", "type": "Guest Post", "url": "https://forbes.com"}
        ],
        "easy_wins": [
            {"domain": "local-directory.com", "strategy": "Submit business profile"}
        ],
        "recommendation": "Focus on resource page link building in the tech niche."
    },
    "seo_tech_audit": {
        "scores": {"performance": 85, "seo": 92, "accessibility": 95, "best_practices": 88},
        "issues": [
            {"title": "Large images slowing down load time", "description": "Compress images on the homepage", "severity": "high"}
        ],
        "recommendation": "Prioritize image optimization and minifying CSS/JS."
    },
    "seo_local": {
        "insights": "Your business appears in the top 3 map pack, but lacks recent reviews compared to competitors. Encourage more Google reviews to maintain visibility."
    },
    "seo_snippets": {
        "snippets": [
            {"question": "What is the best SEO tool?", "current_holder": "ahrefs.com", "snippet_type": "Paragraph", "difficulty": "Medium", "strategy": "Write a more concise, formatted paragraph", "suggestion": "Create an 'Ultimate Guide to SEO Tools' page"}
        ]
    },
    "seo_internal_links": {
        "suggestions": [
            {"source": "https://example.com/blog", "target": "https://example.com/pricing", "anchor_text": "check our plans", "reason": "Drives traffic to conversion page", "impact": "High", "relevance": "Authority"}
        ]
    },
    "yt_competitor_spy": {
        "channel_stats": {
            "subscribers": "1.2M",
            "total_videos": "450",
            "avg_views": "250K",
            "upload_frequency": "2x per week"
        },
        "top_videos": [
            {"title": "How I Built This in 30 Days", "views": "1.5M", "date": "2025-10-12", "engagement": "High"}
        ],
        "trending_topics": ["AI productivity", "Automated marketing", "No-code SaaS"],
        "ai_analysis": "# Competitive Intelligence Report\n## Channel Strategy\nThey are capitalizing on the **AI automation trend**. \n\n## Your Opportunity\nYou should focus on *step-by-step tutorials* to capture the educational gap they are leaving in the market."
    },
    "yt_storyboard": {
        "scenes": [
            {"narration": "Are you tired of slow content creation?", "visual_prompt": "Cinematic shot of a frustrated creator at a desk, dark lighting", "duration": "5s", "timestamp": "0:00-0:05", "on_screen_text": "Slow Growth?"},
            {"narration": "Meet the new AI OS.", "visual_prompt": "Futuristic UI glowing on a screen, upbeat tone", "duration": "5s", "timestamp": "0:05-0:10", "on_screen_text": "The Solution"}
        ]
    },
    "yt_thumbnail": {
        "predicted_ctr": "10.5%",
        "emotion_score": "High",
        "curiosity_score": "Strong",
        "suggestions": [
            {"concept": "Face reaction with arrow", "description": "Show a shocked face pointing to a rising graph", "colors": ["#FF0000", "#FFFFFF", "#000000"], "text_overlay": "NEVER DO THIS!"}
        ]
    },
    "yt_tags": {
        "optimized_titles": ["I Tried AI Content Creation for 30 Days", "The Secret AI Tool for 2026", "Stop Wasting Time: Use This AI Instead"],
        "description": "Here is exactly how I automate my content.\n\nTimestamps:\n0:00 - Intro\n1:00 - The Strategy",
        "tags": ["ai content", "automation", "productivity hack"],
        "hashtags": ["#AI", "#ContentCreation", "#Productivity"]
    },
    "yt_sentiment": {
        "positive": "80%",
        "neutral": "15%",
        "negative": "5%",
        "top_topics": ["Tutorial clarity", "Tool recommendations"],
        "content_requests": ["Can you do a deep dive on openrouter?", "Make a TikTok version!"],
        "summary": "Audience loved the direct approach and actionable advice. High demand for a follow-up focused on short-form content."
    },
    "tt_hook_generator": {
        "hooks": [
            {"text": "If you're still doing X in 2026, you're missing out on thousands.", "style": "shock", "estimated_retention": "92%", "why_it_works": "FOMO and time-relevance"},
            {"text": "Here is the exact formula I used to...", "style": "story", "estimated_retention": "88%", "why_it_works": "Promises actionable value"}
        ]
    },
    "tt_trend_scout": {
        "trending_audios": [{"name": "Funny Cat Meow", "artist": "CreatorX", "usage_count": "10.5K", "trend_velocity": "Rising"}],
        "trending_hashtags": [{"tag": "#aitechnology", "views": "500M", "growth": "+20%"}],
        "trending_formats": [{"format": "Green screen reaction", "description": "Reacting to an article over green screen", "example": "User pointing at a tech article"}],
        "recommendation": "Jump on the green screen reaction format quickly using the trending audio."
    },
    "tt_script_converter": {
        "scripts": [
            {
                "hook": "Stop wasting hours on content.",
                "script": "Stop wasting hours on content. This new AI OS does it for you in seconds. First, you just paste your idea. Second, it generates the script, SEO tags, and even thumbnail ideas. It's like having a full agency on your laptop. Hit the link in my bio to try it out.",
                "duration": "~30s",
                "word_count": 48,
                "cta": "Link in bio"
            }
        ]
    },
    "tt_engagement": {
        "avg_views": "250K",
        "avg_likes": "35K",
        "engagement_rate": "14%",
        "best_time": "6-8 PM EST",
        "top_performing": [{"theme": "Comedy Skits", "performance": "Peak"}],
        "recommendations": ["Post more between 6-8 PM", "Double down on comedy skits"]
    },
    "tt_post_rank": {
        "top_posts": [
            {"caption": "This AI strategy is insane #ai #tech", "views": "1.2M", "engagement": "12%", "hashtags": "#ai #tech", "velocity": "Rising"}
        ],
        "optimization_tips": ["Use trending hashtags related to #ai", "Keep videos between 15-30s"]
    },
    "ai_humanizer": {
        "humanized_text": "Look, generating content with AI is great, but sometimes it just sounds like a robot wrote it, right? I've found that breaking up the text into shorter bursts really helps. Plus, adding a bit of your own flavor completely transforms it.",
        "ai_score": "5%",
        "readability": "6th Grade",
        "uniqueness": "98%",
        "changes_made": ["Added conversational openers", "Varied sentence length", "Included rhetorical question"]
    },
    "ai_ad_copy": {
        "facebook": [{"headline": "Automate Your Workflow Today", "primary_text": "Tired of manual content creation? Let our AI OS handle the heavy lifting.", "description": "Join 10,000+ creators saving hours every week.", "cta": "Learn More"}],
        "google": [{"headline_1": "The Ultimate AI Content OS", "headline_2": "Save Hours Every Week", "description": "Automate SEO, YouTube, and TikTok content in one click.", "display_url": "apex.com/ai-os"}],
        "instagram": [{"caption": "Content creation doesn't have to be hard. 🚀 Drop a 🔥 if you want early access!", "hashtags": "#ContentCreator #AITools", "cta": "Link in bio"}],
        "strategy_notes": "Focus on time-saving benefits across all platforms."
    },
    "ai_email": {
        "emails": [
            {
                "subject_line": "The secret to 10x content",
                "subject_line_b": "Are you creating content the hard way?",
                "preview_text": "Here's exactly how top creators automate their workflow.",
                "body": "Hey [Name],\n\nI used to spend 20 hours a week on content. Now I spend 2. The difference? AI orchestration.\n\nHit reply if you want my full framework.\n\nCheers,",
                "cta_text": "Reply",
                "send_day": "Day 1",
                "predicted_open_rate": "42%"
            }
        ],
        "sequence_strategy": "Value-first approach moving towards a soft pitch on day 5."
    },
    "ai_ebook": {
        "title": "The AI Content Mastery Guide",
        "subtitle": "How to Automate 90% of Your Creator Workflow",
        "price_suggestion": "$27",
        "chapters_list": [
            {"title": "Chapter 1: The Automation Mindset", "summary": "Shifting from purely manual to guided AI automation.", "key_points": ["Time vs Money", "The 80/20 Rule"], "content": "You don't need to do everything yourself. In fact, you shouldn't..."}
        ],
        "sales_page_copy": "Tired of the content hamster wheel? This eBook will show you exactly how to step off and let AI do the heavy lifting. Get instant access today."
    },
    "ai_leads": {
        "leads": [
            {"site_name": "TechCrunch", "domain": "techcrunch.com", "url": "https://techcrunch.com/contribute", "da": "93", "contact_email": "tips@techcrunch.com", "outreach_template": "Hi Team, I have a unique piece on AI automation that fits perfectly with your recent editorial slant..."}
        ]
    },
    "ai_saas": {
        "overall_score": "8.5/10",
        "scores": {"market_demand": 9, "competition": 7, "monetization": 8, "feasibility": 9, "growth": 9},
        "revenue_projection": "MRR potential **$10K-$50K** in 12 months.",
        "competitors": ["Jasper", "Copy.ai", "Buffer"],
        "go_to_market": "# Go-To-Market (GTM) Plan\n1. Launch on **ProductHunt** to gain initial traction.\n2. Run targeted **TikTok ads** highlighting the time-saving benefits.\n3. Implement a *referral loop* for early adopters."
    }
}
