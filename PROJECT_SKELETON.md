# 🏗️ Apex Content OS v7.0 - Project Skeleton

## 📁 Project Structure Overview

```
Content Creator/
├── architecture.md                  # Comprehensive architecture documentation
├── autoload_script.py              # Script for auto-loading modules
├── replace_script.py               # Script for text replacement operations
├── replace_script_v2.py            # Enhanced replacement script
├── start.bat                       # Windows startup script
├── .github/                        # GitHub configuration
│   └── workflows/ci.yml             # CI/CD pipeline
├── backend/                        # FastAPI backend
│   ├── .env                        # Environment variables
│   ├── apex_content_os.db          # SQLite database
│   ├── content_os.db               # Content database
│   ├── config.py                   # Configuration settings
│   ├── database.py                 # Database initialization
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   ├── models/                     # Database models
│   │   ├── api_key.py              # API key model
│   │   ├── archive.py              # Archive model
│   │   ├── models.py               # Main models
│   │   ├── project.py              # Project model
│   │   ├── usage_log.py            # Usage logging model
│   │   └── __init__.py             # Models initialization
│   ├── prompts/                    # AI prompt templates
│   │   ├── ai_content_prompts.py   # AI content prompts
│   │   ├── seo_prompts.py          # SEO prompts
│   │   ├── tiktok_prompts.py       # TikTok prompts
│   │   ├── youtube_prompts.py      # YouTube prompts
│   │   └── __init__.py             # Prompts initialization
│   ├── routers/                    # API routers
│   │   ├── agency.py               # Agency endpoints
│   │   ├── ai_content.py           # AI content endpoints
│   │   ├── autopilot.py            # Autopilot endpoints
│   │   ├── billing.py              # Billing endpoints
│   │   ├── developer_api.py        # Developer API endpoints
│   │   ├── general.py              # General endpoints
│   │   ├── missions.py             # Missions endpoints
│   │   ├── monetize.py             # Monetization endpoints
│   │   ├── pipeline.py             # Pipeline endpoints
│   │   ├── seo.py                  # SEO endpoints
│   │   ├── settings.py             # Settings endpoints
│   │   ├── tiktok.py               # TikTok endpoints
│   │   ├── youtube.py              # YouTube endpoints
│   │   └── __init__.py             # Routers initialization
│   ├── schemas/                    # Pydantic schemas
│   │   ├── ai_content.py           # AI content schemas
│   │   ├── seo.py                  # SEO schemas
│   │   ├── settings.py             # Settings schemas
│   │   ├── tiktok.py               # TikTok schemas
│   │   ├── youtube.py              # YouTube schemas
│   │   └── __pycache__/            # Compiled Python files
│   ├── services/                   # Service layer
│   │   ├── ai_orchestrator.py      # AI model orchestrator
│   │   ├── cache_service.py        # Caching service
│   │   ├── key_registry.py         # Key registry service
│   │   ├── mock_data.py            # Mock data generator
│   │   ├── pagespeed_client.py     # PageSpeed client
│   │   ├── pipeline_service.py     # Pipeline service
│   │   ├── serper_client.py        # Serper API client
│   │   └── stripe_client.py        # Stripe client
│   └── tests/                      # Test files
│       └── __init__.py             # Tests initialization
└── frontend/                       # Next.js frontend
    ├── .gitignore                  # Git ignore rules
    ├── AGENTS.md                   # Agents documentation
    ├── CLAUDE.md                   # Claude documentation
    ├── eslint.config.mjs           # ESLint configuration
    ├── next.config.ts              # Next.js configuration
    ├── package-lock.json           # NPM lock file
    ├── package.json                # NPM dependencies
    ├── postcss.config.mjs          # PostCSS configuration
    ├── README.md                   # Frontend README
    ├── tsconfig.json               # TypeScript configuration
    ├── public/                     # Public assets
    │   ├── favicon.ico             # Favicon
    │   ├── logo.png                # Logo
    │   ├── logo.svg                # Logo SVG
    │   └── robots.txt              # Robots.txt
    ├── src/                        # Source code
    │   ├── app/                    # Next.js app router
    │   │   ├── (auth)/             # Authentication routes
    │   │   │   ├── login/          # Login page
    │   │   │   │   └── page.tsx    # Login page component
    │   │   │   └── register/       # Register page
    │   │   │       └── page.tsx    # Register page component
    │   │   ├── (main)/             # Main application routes
    │   │   │   ├── agency/         # Agency features
    │   │   │   │   ├── page.tsx    # Agency main page
    │   │   │   │   └── reports/    # Agency reports
    │   │   │   │       └── page.tsx # Reports page
    │   │   │   ├── ai-hub/         # AI content hub
    │   │   │   │   ├── ad-copy/    # Ad copy generator
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── ebook-builder/ # eBook builder
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── email-architect/ # Email architect
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── humanizer/   # Humanizer tool
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── lead-scraper/ # Lead scraper
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── saas-validator/ # SaaS validator
    │   │   │   │       └── page.tsx
    │   │   │   ├── autopilot/      # Autopilot features
    │   │   │   │   └── page.tsx    # Autopilot main page
    │   │   │   ├── billing/        # Billing features
    │   │   │   │   └── page.tsx    # Billing main page
    │   │   │   ├── developers/     # Developer features
    │   │   │   │   └── page.tsx    # Developers main page
    │   │   │   ├── factory/        # Factory features
    │   │   │   │   ├── calendar/   # Calendar
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── new/         # New factory
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx     # Factory main page
    │   │   │   ├── marketplace/     # Marketplace
    │   │   │   │   └── page.tsx     # Marketplace main page
    │   │   │   ├── missions/       # Missions
    │   │   │   │   ├── [mission]/   # Mission details
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx     # Missions main page
    │   │   │   ├── monetize/        # Monetization features
    │   │   │   │   ├── affiliate/   # Affiliate marketing
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── content-roi/ # Content ROI
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── niche-finder/ # Niche finder
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx     # Monetize main page
    │   │   │   ├── pricing/         # Pricing page
    │   │   │   │   └── page.tsx     # Pricing page component
    │   │   │   ├── referrals/       # Referrals
    │   │   │   │   └── page.tsx     # Referrals page
    │   │   │   ├── seo/             # SEO tools
    │   │   │   │   ├── backlink-auditor/ # Backlink auditor
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── internal-linking/ # Internal linking
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── keyword-lab/ # Keyword lab
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── local-seo/   # Local SEO
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── rank-tracker/ # Rank tracker
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── serp-analyzer/ # SERP analyzer
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── snippet-hunter/ # Snippet hunter
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── technical-audit/ # Technical audit
    │   │   │   │       └── page.tsx
    │   │   │   ├── settings/        # Settings
    │   │   │   │   ├── api-keys/    # API keys
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── archive/     # Archive
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── model-selection/ # Model selection
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── usage-tracker/ # Usage tracker
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── workspace/   # Workspace
    │   │   │   │       └── page.tsx
    │   │   │   ├── tiktok/          # TikTok tools
    │   │   │   │   ├── engagement-analytics/ # Engagement analytics
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── hook-generator/ # Hook generator
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── post-ranker/ # Post ranker
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── script-converter/ # Script converter
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── trend-scout/ # Trend scout
    │   │   │   │       └── page.tsx
    │   │   │   ├── youtube/         # YouTube tools
    │   │   │   │   ├── competitor-spy/ # Competitor spy
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── rank-checker/ # Rank checker
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── sentiment-analyzer/ # Sentiment analyzer
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── storyboarder/ # Storyboarder
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── tags-optimizer/ # Tags optimizer
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── thumbnail-predictor/ # Thumbnail predictor
    │   │   │   │       └── page.tsx
    │   │   │   ├── page.tsx          # Dashboard home
    │   │   │   └── layout.tsx        # Main layout
    │   │   ├── auth/                 # Authentication
    │   │   │   └── [...nextauth]/    # NextAuth routes
    │   │   │       └── route.ts      # NextAuth route handler
    │   │   ├── globals.css           # Global styles
    │   │   └── layout.tsx            # Root layout
    │   ├── components/               # React components
    │   │   ├── FormattedContent.tsx  # Formatted content component
    │   │   ├── layout/               # Layout components
    │   │   │   ├── ClientLayout.tsx  # Client layout wrapper
    │   │   │   ├── Sidebar.tsx       # Sidebar navigation
    │   │   │   ├── TopBar.tsx        # Top navigation bar
    │   │   │   ├── TrendingTicker.tsx # Trending ticker
    │   │   │   └── TrendInsightModal.tsx # Trend insight modal
    │   │   ├── shared/               # Shared components
    │   │   │   └── ModulePlaceholder.tsx # Module placeholder
    │   │   └── ui/                   # UI components
    │   │       ├── badge.tsx         # Badge component
    │   │       ├── button.tsx        # Button component
    │   │       ├── card.tsx          # Card component
    │   │       ├── dialog.tsx        # Dialog component
    │   │       ├── dropdown-menu.tsx # Dropdown menu
    │   │       ├── index.ts          # UI exports
    │   │       ├── input.tsx         # Input component
    │   │       ├── skeleton.tsx      # Skeleton loader
    │   │       ├── table.tsx         # Table component
    │   │       ├── tabs.tsx          # Tabs component
    │   │       ├── toast.tsx         # Toast component
    │   │       ├── toggle.tsx        # Toggle component
    │   │       └── toggle-group.tsx  # Toggle group
    │   ├── hooks/                    # React hooks
    │   │   ├── useApiCall.ts        # API call hook
    │   │   └── useDebounce.ts       # Debounce hook
    │   ├── lib/                      # Utility libraries
    │   │   ├── api.ts                # API client
    │   │   ├── auth.ts               # Auth utilities
    │   │   ├── constants.ts          # Constants
    │   │   └── utils.ts              # Utility functions
    │   ├── stores/                   # Zustand stores
    │   │   ├── useGlobalStore.ts     # Global state store
    │   │   ├── useProjectStore.ts    # Project state store
    │   │   └── useUIStore.ts         # UI state store
    │   └── types/                    # TypeScript types
    │       └── index.ts              # Type definitions
    └── middleware.ts                # Next.js middleware