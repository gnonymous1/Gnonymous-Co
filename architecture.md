# 🏛️ Apex Content OS v6.0 — Global Dominance Architecture

> **Version:** 6.0 | **Codename:** APEX | **Last Updated:** 2026-04-02

---

## 1. Executive Overview

Apex Content OS v6.0 is a **30-module AI-powered content intelligence platform** designed for SEO dominance, YouTube growth, TikTok virality, and AI content generation. It uses a **modular plugin architecture** where each tool is an independent React component powered by a unified FastAPI backend that dynamically routes requests to the optimal AI model.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 15)                       │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐ │
│  │ Sidebar  │  │            Module Viewport                   │ │
│  │ Nav      │  │  ┌────────────────────────────────────────┐  │ │
│  │ ────────── │  │  │  Tool Header + Input Form             │  │ │
│  │ SEO (8)  │  │  │  AI Processing Indicator               │  │ │
│  │ YT  (6)  │  │  │  Rich Result Renderer (JSON → UI)      │  │ │
│  │ TT  (5)  │  │  │  Export / Save / Share Actions          │  │ │
│  │ AI  (6)  │  │  └────────────────────────────────────────┘  │ │
│  │ SET (5)  │  └──────────────────────────────────────────────┘ │
│  └──────────┘                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Router Layer │  │ AI Orchestr. │  │ Data Fetcher Layer    │ │
│  │ /api/seo/*   │  │ Gemini       │  │ Serper.dev (SERP)     │ │
│  │ /api/yt/*    │  │ OpenRouter   │  │ YouTube Data API v3   │ │
│  │ /api/tt/*    │  │ NVIDIA NIM   │  │ TikTok Trend API      │ │
│  │ /api/ai/*    │  │              │  │ PageSpeed Insights    │ │
│  │ /api/set/*   │  │ Model Select │  │ Moz/Ahrefs (Optional) │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Database Layer (SQLite / PostgreSQL)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.x | App Router, SSR, API Routes |
| React | 19.x | Component Framework |
| Tailwind CSS | 4.x | Utility-First Styling |
| Framer Motion | 12.x | Animations & Transitions |
| Lucide React | Latest | Icon System |
| Shadcn/UI | Latest | Headless UI Primitives |
| Zustand | 5.x | Global State Management |
| Recharts | 2.x | Data Visualization |
| React Hook Form | Latest | Form Management |
| Zod | Latest | Schema Validation |

### 3.2 Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Runtime |
| FastAPI | 0.115+ | High-Concurrency API |
| Uvicorn | Latest | ASGI Server |
| SQLAlchemy | 2.x | ORM |
| Pydantic | 2.x | Data Validation |
| httpx | Latest | Async HTTP Client |
| google-generativeai | Latest | Gemini SDK |
| openai | Latest | OpenRouter SDK |

### 3.3 External APIs
| API | Purpose | Endpoint |
|---|---|---|
| Serper.dev | Google SERP, Images, News | `https://google.serper.dev` |
| YouTube Data API v3 | Channel & Video Analytics | `googleapis.com/youtube/v3` |
| TikTok Unofficial API | Trend & Hashtag Data | Custom Scraper |
| Google PageSpeed | Technical SEO Audits | `googleapis.com/pagespeedonline` |
| Gemini API | Primary AI Model | `generativelanguage.googleapis.com` |
| OpenRouter | Multi-Model Gateway | `openrouter.ai/api/v1` |
| NVIDIA NIM | High-Performance Inference | `integrate.api.nvidia.com` |

---

## 4. Frontend Architecture

### 4.1 Directory Structure
```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout with sidebar
│   ├── page.tsx                   # Dashboard home
│   ├── globals.css                # Tailwind + custom styles
│   ├── seo/
│   │   ├── serp-analyzer/page.tsx
│   │   ├── keyword-lab/page.tsx
│   │   ├── backlink-auditor/page.tsx
│   │   ├── rank-tracker/page.tsx
│   │   ├── technical-audit/page.tsx
│   │   ├── local-seo/page.tsx
│   │   ├── snippet-hunter/page.tsx
│   │   └── internal-linking/page.tsx
│   ├── youtube/
│   │   ├── rank-checker/page.tsx
│   │   ├── competitor-spy/page.tsx
│   │   ├── storyboarder/page.tsx
│   │   ├── thumbnail-predictor/page.tsx
│   │   ├── tags-optimizer/page.tsx
│   │   └── sentiment-analyzer/page.tsx
│   ├── tiktok/
│   │   ├── trend-scout/page.tsx
│   │   ├── hook-generator/page.tsx
│   │   ├── engagement-analytics/page.tsx
│   │   ├── script-converter/page.tsx
│   │   └── post-ranker/page.tsx
│   ├── ai-hub/
│   │   ├── humanizer/page.tsx
│   │   ├── ad-copy/page.tsx
│   │   ├── ebook-builder/page.tsx
│   │   ├── email-architect/page.tsx
│   │   ├── lead-scraper/page.tsx
│   │   └── saas-validator/page.tsx
│   └── settings/
│       ├── api-keys/page.tsx
│       ├── model-selection/page.tsx
│       ├── workspace/page.tsx
│       ├── usage-tracker/page.tsx
│       └── archive/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            # Main navigation
│   │   ├── SidebarItem.tsx        # Nav item component
│   │   ├── SidebarGroup.tsx       # Collapsible category
│   │   ├── TopBar.tsx             # Header with search
│   │   └── PageShell.tsx          # Shared page wrapper
│   ├── ui/                        # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   ├── toggle.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── shared/
│   │   ├── ResultCard.tsx         # Unified result display
│   │   ├── LoadingOrb.tsx         # AI processing animation
│   │   ├── StatWidget.tsx         # Metric display
│   │   ├── ChartContainer.tsx     # Recharts wrapper
│   │   ├── ExportButton.tsx       # PDF/CSV export
│   │   └── AIModelBadge.tsx       # Shows which AI processed
│   └── modules/                   # Module-specific components
│       ├── seo/
│       ├── youtube/
│       ├── tiktok/
│       ├── ai-hub/
│       └── settings/
├── lib/
│   ├── api.ts                     # API client (fetch wrapper)
│   ├── utils.ts                   # Utility functions
│   └── constants.ts               # App constants
├── stores/
│   ├── useGlobalStore.ts          # Zustand: API keys, user prefs
│   ├── useProjectStore.ts         # Zustand: Active project data
│   └── useUIStore.ts              # Zustand: Sidebar state, theme
├── types/
│   └── index.ts                   # TypeScript interfaces
└── hooks/
    ├── useApiCall.ts              # Generic API hook
    └── useDebounce.ts             # Input debounce
```

### 4.2 Global State (Zustand)
```typescript
// stores/useGlobalStore.ts
interface GlobalState {
  // API Keys
  apiKeys: {
    gemini: string;
    openRouter: string;
    nvidia: string;
    serper: string;
    youtubeDataApi: string;
  };
  // AI Model Preferences
  modelPreferences: {
    seo: 'gemini' | 'openrouter' | 'nvidia';
    youtube: 'gemini' | 'openrouter' | 'nvidia';
    tiktok: 'gemini' | 'openrouter' | 'nvidia';
    aiContent: 'gemini' | 'openrouter' | 'nvidia';
  };
  // Usage Tracking
  usage: {
    totalTokens: number;
    totalCost: number;
    callsByModel: Record<string, number>;
  };
  // Project Data
  activeProject: Project | null;
  projects: Project[];
}
```

### 4.3 Design System
- **Theme:** Dark Mode Primary with optional Light Mode
- **Glass Effect:** `backdrop-blur-xl bg-white/5 border border-white/10`
- **Accent Gradient:** `from-violet-500 via-purple-500 to-fuchsia-500`
- **Cards:** Rounded-2xl, glass background, subtle glow on hover
- **Typography:** Inter (body), JetBrains Mono (data/code)
- **Animations:** Page transitions (fade+slide), card hover lifts, loading orbs, skeleton pulses

---

## 5. Backend Architecture

### 5.1 Directory Structure
```
backend/
├── main.py                        # FastAPI app entry
├── config.py                      # Settings & env vars
├── database.py                    # SQLAlchemy engine
├── models/                        # DB Models
│   ├── project.py
│   ├── api_key.py
│   ├── usage_log.py
│   └── archive.py
├── schemas/                       # Pydantic Schemas
│   ├── seo.py
│   ├── youtube.py
│   ├── tiktok.py
│   ├── ai_content.py
│   └── settings.py
├── routers/
│   ├── seo.py                     # 8 SEO endpoints
│   ├── youtube.py                 # 6 YouTube endpoints
│   ├── tiktok.py                  # 5 TikTok endpoints
│   ├── ai_content.py              # 6 AI Content endpoints
│   └── settings.py                # 5 Settings endpoints
├── services/
│   ├── ai_orchestrator.py         # Model switching engine
│   ├── serper_client.py           # Serper.dev integration
│   ├── youtube_client.py          # YouTube API client
│   ├── tiktok_client.py           # TikTok data client
│   ├── pagespeed_client.py        # Google PageSpeed
│   └── cache.py                   # Response caching
└── prompts/
    ├── seo_prompts.py             # SEO tool prompts
    ├── youtube_prompts.py         # YouTube tool prompts
    ├── tiktok_prompts.py          # TikTok tool prompts
    └── ai_content_prompts.py      # AI Content prompts
```

### 5.2 AI Orchestrator Engine
```python
# services/ai_orchestrator.py
class AIOrchestrator:
    """Dynamic AI Model Switcher"""

    async def process(self, tool_id: str, input_data: dict,
                      model_pref: str, api_keys: dict) -> dict:
        # 1. Select model based on preference
        model = self._select_model(model_pref, api_keys)
        # 2. Get tool-specific prompt template
        prompt = self._get_prompt(tool_id, input_data)
        # 3. If SEO tool, fetch live SERP data first
        if tool_id.startswith("seo_"):
            serp_data = await self.serper.fetch(input_data)
            prompt = self._inject_serp(prompt, serp_data)
        # 4. Call selected AI model
        response = await model.generate(prompt)
        # 5. Parse into structured JSON
        result = self._parse_response(response, tool_id)
        # 6. Log usage
        await self._log_usage(tool_id, model_pref, response.usage)
        return result

    def _select_model(self, pref, keys):
        match pref:
            case 'gemini':  return GeminiClient(keys['gemini'])
            case 'openrouter': return OpenRouterClient(keys['openRouter'])
            case 'nvidia':  return NvidiaClient(keys['nvidia'])
```

### 5.3 Data Flow
```
Frontend Input → POST /api/{category}/{tool}
    → Router validates with Pydantic
    → Service fetches live data (SERP/YT/TT)
    → AI Orchestrator selects model
    → Prompt template + live data → AI Model
    → Structured JSON response → Frontend
    → Rich UI rendering with charts/tables/cards
```

---

## 6. Module Specifications (30 Pages)

### PART 1: SEO & Search Mastery (8 Modules)

#### 6.1 Google SERP Analyzer
- **Route:** `/seo/serp-analyzer`
- **API:** `POST /api/seo/serp-analyze`
- **Input:** `{ keyword: string, country: string, language: string }`
- **Data Source:** Serper.dev → Top 100 organic results
- **AI Task:** Analyze ranking patterns, content gaps, DA/PA distribution
- **Output Schema:**
```json
{
  "keyword": "string",
  "totalResults": "number",
  "topResults": [{
    "position": "number",
    "title": "string",
    "url": "string",
    "snippet": "string",
    "domainAuthority": "number",
    "contentLength": "number",
    "contentType": "string"
  }],
  "insights": {
    "avgContentLength": "number",
    "avgDA": "number",
    "contentGaps": ["string"],
    "rankingFactors": ["string"],
    "difficulty": "string"
  },
  "recommendation": "string"
}
```
- **UI:** Data table with sortable columns, DA distribution chart, content length bar chart, AI insights card

#### 6.2 Keyword Research Lab
- **Route:** `/seo/keyword-lab`
- **API:** `POST /api/seo/keyword-research`
- **Input:** `{ seedKeyword: string, niche: string, country: string }`
- **Data Source:** Serper.dev autocomplete + related searches
- **AI Task:** Generate keyword clusters with volume/difficulty estimates
- **Output:** Keyword clusters with parent topics, long-tails, questions, commercial intent tags
- **UI:** Interactive cluster map, filterable table, export to CSV

#### 6.3 Backlink Auditor
- **Route:** `/seo/backlink-auditor`
- **API:** `POST /api/seo/backlink-audit`
- **Input:** `{ targetUrl: string, competitors: string[] }`
- **AI Task:** Analyze backlink profiles, find link gaps between you and competitors
- **UI:** Venn diagram of shared/unique backlinks, opportunity table

#### 6.4 Live Page Rank Tracker
- **Route:** `/seo/rank-tracker`
- **API:** `POST /api/seo/track-rank`
- **Input:** `{ domain: string, keywords: string[] }`
- **Data Source:** Serper.dev position check
- **UI:** Line chart showing rank over time, position change badges (↑↓)

#### 6.5 Technical SEO Audit
- **Route:** `/seo/technical-audit`
- **API:** `POST /api/seo/tech-audit`
- **Input:** `{ url: string }`
- **Data Source:** Google PageSpeed Insights API
- **AI Task:** Interpret scores, suggest fixes prioritized by impact
- **UI:** Lighthouse-style score rings, issue list with severity badges

#### 6.6 Google Maps Local SEO
- **Route:** `/seo/local-seo`
- **API:** `POST /api/seo/local-seo`
- **Input:** `{ businessName: string, location: string, category: string }`
- **Data Source:** Serper.dev local/maps results
- **UI:** Map embed, competitor grid, review sentiment chart

#### 6.7 Featured Snippet Hunter
- **Route:** `/seo/snippet-hunter`
- **API:** `POST /api/seo/snippet-hunt`
- **Input:** `{ niche: string, questionKeywords: string[] }`
- **Data Source:** Serper.dev with `type: "search"` filtering featured snippets
- **AI Task:** Find questions where Google shows Position Zero, suggest content to win them
- **UI:** Question cards with current snippet holder, your content suggestion

#### 6.8 Internal Linking Architect
- **Route:** `/seo/internal-linking`
- **API:** `POST /api/seo/internal-links`
- **Input:** `{ sitemapUrl: string, targetPage: string }`
- **AI Task:** Crawl sitemap, suggest internal links based on topical relevance
- **UI:** Network graph visualization, link suggestion table

---

### PART 2: YouTube Dominance (6 Modules)

#### 6.9 YouTube Video Rank Checker
- **Route:** `/youtube/rank-checker`
- **API:** `POST /api/yt/rank-check`
- **Input:** `{ keyword: string, videoUrl: string }`
- **Data Source:** Serper.dev YouTube search + YouTube Data API
- **UI:** Position badge, engagement stats (views, likes, comments), competitor comparison

#### 6.10 Competitor Channel Spy
- **Route:** `/youtube/competitor-spy`
- **API:** `POST /api/yt/competitor-spy`
- **Input:** `{ channelUrl: string }`
- **Data Source:** YouTube Data API v3
- **Output:** Most viewed videos, upload frequency, trending topics, growth rate
- **UI:** Channel stats dashboard, video performance table, topic heatmap

#### 6.11 Script-to-Video Storyboarder
- **Route:** `/youtube/storyboarder`
- **API:** `POST /api/yt/storyboard`
- **Input:** `{ script: string, duration: number, style: string }`
- **AI Task:** Break script into scenes, generate AI image prompts per scene
- **UI:** Timeline view with scene cards, each showing timestamp + image prompt + narration

#### 6.12 Viral Thumbnail Predictor
- **Route:** `/youtube/thumbnail-predictor`
- **API:** `POST /api/yt/thumbnail-predict`
- **Input:** `{ thumbnailUrl: string, title: string, niche: string }`
- **AI Task:** Analyze thumbnail composition, predict CTR, suggest improvements
- **UI:** Thumbnail preview with overlay annotations, CTR score gauge, improvement tips

#### 6.13 Tags & Description Optimizer
- **Route:** `/youtube/tags-optimizer`
- **API:** `POST /api/yt/optimize-tags`
- **Input:** `{ videoTitle: string, niche: string, competitors: string[] }`
- **AI Task:** Generate SEO-optimized title, description, tags, hashtags
- **UI:** Copy-ready metadata blocks with one-click copy buttons

#### 6.14 Comment Sentiment Analyzer
- **Route:** `/youtube/sentiment-analyzer`
- **API:** `POST /api/yt/sentiment`
- **Input:** `{ videoUrl: string }`
- **Data Source:** YouTube Data API v3 (comments)
- **AI Task:** Categorize sentiment, extract topic requests, identify pain points
- **UI:** Sentiment pie chart, word cloud, top request list

---

### PART 3: TikTok & Reels Factory (5 Modules)

#### 6.15 TikTok Trend Scout
- **Route:** `/tiktok/trend-scout`
- **API:** `POST /api/tt/trends`
- **Input:** `{ country: string, category: string }`
- **Data Source:** TikTok Trend API / Creative Center
- **UI:** Trending audio cards with play preview, hashtag volume chart, trend velocity indicators

#### 6.16 Short-Form Hook Generator
- **Route:** `/tiktok/hook-generator`
- **API:** `POST /api/tt/hooks`
- **Input:** `{ topic: string, targetAudience: string, tone: string }`
- **AI Task:** Generate 10 lethal first-3-second hooks per topic
- **UI:** Hook cards with copy button, categorized by style (question/shock/stat/story)

#### 6.17 Engagement Analytics
- **Route:** `/tiktok/engagement-analytics`
- **API:** `POST /api/tt/engagement`
- **Input:** `{ profileUrl: string }`
- **AI Task:** Deep analysis of reach, shares, watch-time patterns
- **UI:** Multi-metric dashboard with date range filter, engagement rate chart

#### 6.18 Script-to-Shorts Converter
- **Route:** `/tiktok/script-converter`
- **API:** `POST /api/tt/convert-script`
- **Input:** `{ longContent: string, platform: string }`
- **AI Task:** Convert long blog/video into 5 × 60-second short-form scripts
- **UI:** Tabbed script viewer with word count, estimated duration, hook highlight

#### 6.19 TikTok Post Ranker
- **Route:** `/tiktok/post-ranker`
- **API:** `POST /api/tt/rank-post`
- **Input:** `{ videoUrl: string, hashtags: string[] }`
- **AI Task:** Check FYP ranking signals, suggest optimization
- **UI:** FYP score gauge, ranking factor breakdown, optimization checklist

---

### PART 4: AI Content Hub (6 Modules)

#### 6.20 The "Humanizer" Rewriter
- **Route:** `/ai-hub/humanizer`
- **API:** `POST /api/ai/humanize`
- **Input:** `{ content: string, tone: string, readingLevel: string }`
- **AI Task:** Rewrite AI content to be undetectable, maintain meaning, vary sentence structure
- **UI:** Side-by-side before/after view, AI detection score, readability metrics

#### 6.21 Multi-Platform Ad Copy
- **Route:** `/ai-hub/ad-copy`
- **API:** `POST /api/ai/ad-copy`
- **Input:** `{ product: string, platform: string, audience: string, budget: string }`
- **AI Task:** Generate platform-specific ad copies (FB, Google, IG) with hooks and CTAs
- **UI:** Platform-tabbed preview cards with character count, copy buttons

#### 6.22 eBook & Digital Product Builder
- **Route:** `/ai-hub/ebook-builder`
- **API:** `POST /api/ai/ebook`
- **Input:** `{ topic: string, chapters: number, audience: string }`
- **AI Task:** Generate chapter outlines, content drafts, sales page copy
- **UI:** Chapter accordion with expand/edit, progress tracker, export to Markdown/PDF

#### 6.23 Email Marketing Architect
- **Route:** `/ai-hub/email-architect`
- **API:** `POST /api/ai/email-sequence`
- **Input:** `{ goal: string, sequenceLength: number, audience: string }`
- **AI Task:** Generate cold email + nurture sequences (Beehiiv/Substack style)
- **UI:** Email timeline with preview cards, subject line A/B variants, open rate predictions

#### 6.24 GBOB Lead Scraper
- **Route:** `/ai-hub/lead-scraper`
- **API:** `POST /api/ai/lead-scrape`
- **Input:** `{ niche: string, location: string, criteria: string }`
- **Data Source:** Serper.dev for business discovery
- **AI Task:** Find guest posting targets, audit their SEO, generate outreach templates
- **UI:** Lead table with SEO scores, outreach template generator, export to CSV

#### 6.25 SaaS Idea Validator
- **Route:** `/ai-hub/saas-validator`
- **API:** `POST /api/ai/validate-saas`
- **Input:** `{ idea: string, targetMarket: string }`
- **Data Source:** Serper.dev for market research
- **AI Task:** Analyze market trends, competition, revenue potential, MVP features
- **UI:** Validation scorecard, competitor matrix, revenue projection chart, MVP feature list

---

### PART 5: Settings & Orchestration (5 Modules)

#### 6.26 API Key Command Center
- **Route:** `/settings/api-keys`
- **Features:** Encrypted storage, connection test per key, status indicators
- **UI:** Key input cards with show/hide toggle, green/red connection status dots

#### 6.27 AI Model Selection
- **Route:** `/settings/model-selection`
- **Features:** Per-category model assignment, model capability comparison
- **UI:** Toggle switches per category, model comparison table, cost estimator

#### 6.28 Multi-User Workspace
- **Route:** `/settings/workspace`
- **Features:** Team member invite, role-based permissions (Admin/Editor/Viewer)
- **UI:** Team member list, role dropdown, activity log

#### 6.29 Usage & Wallet Tracker
- **Route:** `/settings/usage-tracker`
- **Features:** Cost per API call, daily/weekly/monthly aggregation, budget alerts
- **UI:** Cost breakdown pie chart, usage timeline, budget threshold settings

#### 6.30 Project Archive
- **Route:** `/settings/archive`
- **Features:** Full history of all tool runs, search & filter, re-run capability
- **UI:** Searchable table with filters by tool/date/status, result preview drawer

---

## 7. API Endpoint Summary

| # | Method | Endpoint | Module |
|---|--------|----------|--------|
| 1 | POST | `/api/seo/serp-analyze` | SERP Analyzer |
| 2 | POST | `/api/seo/keyword-research` | Keyword Lab |
| 3 | POST | `/api/seo/backlink-audit` | Backlink Auditor |
| 4 | POST | `/api/seo/track-rank` | Rank Tracker |
| 5 | POST | `/api/seo/tech-audit` | Technical SEO |
| 6 | POST | `/api/seo/local-seo` | Local SEO |
| 7 | POST | `/api/seo/snippet-hunt` | Snippet Hunter |
| 8 | POST | `/api/seo/internal-links` | Internal Linking |
| 9 | POST | `/api/yt/rank-check` | YT Rank Checker |
| 10 | POST | `/api/yt/competitor-spy` | Competitor Spy |
| 11 | POST | `/api/yt/storyboard` | Storyboarder |
| 12 | POST | `/api/yt/thumbnail-predict` | Thumbnail Predictor |
| 13 | POST | `/api/yt/optimize-tags` | Tags Optimizer |
| 14 | POST | `/api/yt/sentiment` | Sentiment Analyzer |
| 15 | POST | `/api/tt/trends` | Trend Scout |
| 16 | POST | `/api/tt/hooks` | Hook Generator |
| 17 | POST | `/api/tt/engagement` | Engagement Analytics |
| 18 | POST | `/api/tt/convert-script` | Script Converter |
| 19 | POST | `/api/tt/rank-post` | Post Ranker |
| 20 | POST | `/api/ai/humanize` | Humanizer |
| 21 | POST | `/api/ai/ad-copy` | Ad Copy |
| 22 | POST | `/api/ai/ebook` | eBook Builder |
| 23 | POST | `/api/ai/email-sequence` | Email Architect |
| 24 | POST | `/api/ai/lead-scrape` | Lead Scraper |
| 25 | POST | `/api/ai/validate-saas` | SaaS Validator |
| 26 | GET/PUT | `/api/settings/api-keys` | API Key Center |
| 27 | GET/PUT | `/api/settings/model-prefs` | Model Selection |
| 28 | CRUD | `/api/settings/workspace` | Workspace |
| 29 | GET | `/api/settings/usage` | Usage Tracker |
| 30 | CRUD | `/api/settings/archive` | Project Archive |

---

## 8. Database Schema

```sql
-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (encrypted)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,  -- gemini|openrouter|nvidia|serper|youtube
    encrypted_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_verified TIMESTAMP
);

-- Usage Logs
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY,
    tool_id VARCHAR(100) NOT NULL,
    model_used VARCHAR(50) NOT NULL,
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost_usd DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Archive (tool run history)
CREATE TABLE archives (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    tool_id VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    model_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workspace Users
CREATE TABLE workspace_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer',  -- admin|editor|viewer
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rank Tracking History
CREATE TABLE rank_history (
    id UUID PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    position INTEGER,
    checked_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. Security Architecture

- **API Keys:** AES-256 encrypted at rest, never sent to frontend after initial save
- **CORS:** Restricted to frontend origin only
- **Rate Limiting:** Per-IP and per-API-key throttling
- **Input Sanitization:** Pydantic validation on all endpoints
- **Environment Variables:** All secrets in `.env`, never committed

---

## 10. Deployment Strategy

```
┌──────────────┐     ┌──────────────┐
│   Vercel      │     │   Railway /   │
│   (Frontend)  │────▶│   Render      │
│   Next.js 15  │     │   (Backend)   │
└──────────────┘     │   FastAPI     │
                      └──────┬───────┘
                             │
                      ┌──────▼───────┐
                      │  PostgreSQL   │
                      │  (Supabase)   │
                      └──────────────┘
```

- **Frontend:** Vercel (optimized for Next.js)
- **Backend:** Railway or Render (Python/FastAPI)
- **Database:** Supabase PostgreSQL (free tier available)
- **Dev Mode:** SQLite locally, PostgreSQL in production

---

## 11. Build Priority (Phase Plan)

| Phase | Modules | Priority |
|-------|---------|----------|
| **Phase 1** | Sidebar + SERP Analyzer + API Key Center | 🔴 NOW |
| **Phase 2** | Keyword Lab + Rank Tracker + Technical Audit | 🟠 Next |
| **Phase 3** | YouTube (all 6 modules) | 🟡 Week 2 |
| **Phase 4** | TikTok (all 5 modules) | 🟢 Week 3 |
| **Phase 5** | AI Content Hub (all 6 modules) | 🔵 Week 4 |
| **Phase 6** | Settings + Workspace + Archive | 🟣 Week 5 |
| **Phase 7** | Polish, Testing, Deployment | ⚪ Week 6 |
