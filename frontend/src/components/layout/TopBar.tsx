"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, ChevronRight, Bell, Search, Sparkles, Command } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import Link from "next/link";
import CommandPalette from "@/components/ui/CommandPalette";

const LABELS: Record<string, string> = {
  "/": "Overview",
  "/seo/serp-analyzer": "SERP Analyzer",
  "/seo/keyword-lab": "Keyword Lab",
  "/seo/backlink-auditor": "Backlink Auditor",
  "/seo/rank-tracker": "Rank Tracker",
  "/seo/technical-audit": "Technical Audit",
  "/seo/local-seo": "Local SEO",
  "/seo/snippet-hunter": "Snippet Hunter",
  "/seo/internal-linking": "Internal Linking",
  "/seo/content-gap": "Content Gap",
  "/seo/ai-writer": "AI Writer",
  "/youtube/rank-checker": "Rank Checker",
  "/youtube/competitor-spy": "Competitor Spy",
  "/youtube/storyboarder": "Storyboarder",
  "/youtube/thumbnail-predictor": "Thumbnail Predictor",
  "/youtube/tags-optimizer": "Tags Optimizer",
  "/youtube/sentiment-analyzer": "Sentiment Analyzer",
  "/youtube/script-generator": "Script Generator",
  "/youtube/channel-audit": "Channel Audit",
  "/tiktok/trend-scout": "Trend Scout",
  "/tiktok/hook-generator": "Hook Generator",
  "/tiktok/engagement-analytics": "Engagement Analytics",
  "/tiktok/script-converter": "Script Converter",
  "/tiktok/post-ranker": "Post Ranker",
  "/tiktok/viral-caption": "Viral Caption",
  "/tiktok/content-calendar": "Content Calendar",
  "/ai-hub/thumbnail-studio": "Thumbnail Studio",
  "/ai-hub/humanizer": "Humanizer",
  "/ai-hub/ad-copy": "Ad Copy",
  "/ai-hub/ebook-builder": "eBook Builder",
  "/ai-hub/email-architect": "Email Architect",
  "/ai-hub/lead-scraper": "Lead Scraper",
  "/ai-hub/saas-validator": "SaaS Validator",
  "/ai-hub/content-writer": "Content Writer",
  "/ai-hub/social-media": "Social Media",
  "/ai-hub/repurpose": "Repurpose Engine",
  "/ai-hub/vsl-script": "VSL Script",
  "/ai-hub/bio-generator": "Bio Generator",
  "/monetize": "Revenue Center",
  "/monetize/niche-finder": "Niche Finder",
  "/monetize/content-roi": "Content ROI",
  "/monetize/affiliate": "Affiliate Hub",
  "/factory": "Content Factory",
  "/factory/new": "Pipeline Builder",
  "/factory/calendar": "Content Calendar",
  "/missions": "Guided Missions",
  "/autopilot": "Autopilot Agent",
  "/agency": "Agency Dashboard",
  "/agency/reports": "White-Label Reports",
  "/marketplace": "Prompt Marketplace",
  "/developers": "Developer API",
  "/referrals": "Referral Program",
  "/pricing": "Pricing",
  "/billing": "Billing",
  "/settings/api-keys": "API Keys",
  "/settings/model-selection": "AI Models",
  "/settings/workspace": "Workspace",
  "/settings/usage-tracker": "Usage Tracker",
  "/settings/archive": "Archive",
};

const CATS: Record<string, string> = {
  seo: "SEO & Search", youtube: "YouTube", tiktok: "TikTok & Reels",
  "ai-hub": "AI Content Hub", monetize: "Monetization", factory: "Content Factory",
  missions: "Guided Missions", autopilot: "Guided Missions", agency: "Agency & Growth",
  marketplace: "Agency & Growth", developers: "Agency & Growth", referrals: "Agency & Growth",
  settings: "Settings", pricing: "Billing", billing: "Billing",
};

const MODEL_COLOR: Record<string, string> = {
  gemini: "text-brand-secondary", openrouter: "text-cyan-400", nvidia: "text-brand-primary",
};

export default function TopBar() {
  const pathname = usePathname();
  const { modelPreferences } = useGlobalStore();

  const seg = pathname.split("/").filter(Boolean);
  const cat = seg[0] || "";
  const catLabel = CATS[cat] || "";
  const pageLabel = LABELS[pathname] || "Dashboard";

  const model =
    cat === "seo" ? modelPreferences.seo :
    cat === "youtube" ? modelPreferences.youtube :
    cat === "tiktok" ? modelPreferences.tiktok :
    cat === "ai-hub" ? modelPreferences.ai_content : "gemini";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-topbar h-12 flex items-center justify-between px-4 flex-shrink-0 z-30"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] tracking-tight">
        {catLabel && (
          <>
            <span className="text-zinc-500 font-semibold uppercase">{catLabel}</span>
            <ChevronRight size={10} className="text-zinc-500" />
          </>
        )}
        <span className="text-white font-bold uppercase tracking-wider">{pageLabel}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Command Palette */}
        <CommandPalette />

        {/* Model pill */}
        {cat && cat !== "settings" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-white/5">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <Cpu size={11} className="text-zinc-500" />
            <span className={`text-[10px] font-bold capitalize ${MODEL_COLOR[model] || "text-emerald-400"}`}>
              {model}
            </span>
          </div>
        )}

        {/* Bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all group">
          <Bell size={13} className="text-zinc-500 group-hover:text-white" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </button>

        {/* Upgrade */}
        <Link href="/pricing">
          <button className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold text-brand-secondary hover:text-white transition-all bg-brand-secondary/10 border border-brand-secondary/20 hover:bg-brand-secondary/20">
            <Sparkles size={11} />
            UPGRADE
          </button>
        </Link>
      </div>
    </motion.header>
  );
}
