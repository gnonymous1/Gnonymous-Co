"use client";
import React from "react";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Video, Repeat, DollarSign, ChevronRight, Zap, Target, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";

const missions = [
  {
    id: "viral-youtube",
    icon: <Video size={28} />,
    color: "from-rose-600/30 to-rose-500/10",
    accent: "text-rose-400",
    border: "border-rose-500/20",
    badge: "Most Popular",
    badgeColor: "bg-rose-500/20 text-rose-300",
    title: "Viral YouTube Channel Launch",
    description: "Go from zero to 1K subs in 30 days. AI handles niche, scripting, thumbnails, and SEO.",
    steps: ["Niche & Competitor Audit", "Channel SEO Setup", "First 10 Video Scripts", "Thumbnail Concepts", "Upload Schedule", "Analytics Baseline"],
    estimatedTime: "~25 min",
    modules: 6,
  },
  {
    id: "seo-domination",
    icon: <TrendingUp size={28} />,
    color: "from-violet-600/30 to-violet-500/10",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    badge: "High ROI",
    badgeColor: "bg-violet-500/20 text-violet-300",
    title: "SEO Domination Sprint",
    description: "Rank page-1 for 10 money keywords in 60 days using AI-powered content clusters.",
    steps: ["Keyword Gap Analysis", "Competitor SERP Audit", "Content Cluster Map", "10 Article Briefs", "Internal Link Strategy", "Rank Tracking Setup"],
    estimatedTime: "~30 min",
    modules: 6,
  },
  {
    id: "content-repurpose",
    icon: <Repeat size={28} />,
    color: "from-cyan-600/30 to-cyan-500/10",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    badge: "Time Saver",
    badgeColor: "bg-cyan-500/20 text-cyan-300",
    title: "Omnichannel Content Repurpose",
    description: "Turn one piece of content into 20 platform-ready assets across YouTube, TikTok, X, LinkedIn.",
    steps: ["Source Content Input", "YouTube Long-Form", "TikTok Shorts (x3)", "Twitter/X Thread", "LinkedIn Article", "Blog Post + SEO"],
    estimatedTime: "~15 min",
    modules: 6,
  },
  {
    id: "monetize-niche",
    icon: <DollarSign size={28} />,
    color: "from-emerald-600/30 to-emerald-500/10",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    badge: "Revenue",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    title: "Niche Monetization Blueprint",
    description: "Find a profitable niche, build authority content, and map affiliate + product revenue streams.",
    steps: ["Niche Profitability Score", "Audience Pain Analysis", "Affiliate Program Map", "Lead Magnet Creation", "Email Sequence Draft", "Revenue Projection"],
    estimatedTime: "~20 min",
    modules: 6,
  },
];

const stats = [
  { label: "Missions Available", value: "4", icon: <Rocket size={18} />, color: "text-violet-400" },
  { label: "Avg. Completion Time", value: "22m", icon: <Zap size={18} />, color: "text-cyan-400" },
  { label: "AI Steps Per Mission", value: "6", icon: <Target size={18} />, color: "text-emerald-400" },
  { label: "Success Rate", value: "94%", icon: <BarChart3 size={18} />, color: "text-rose-400" },
];

export default function MissionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <Rocket size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">Guided Missions</h1>
            <p className="text-zinc-500 text-sm">End-to-end AI workflows — input a goal, get a complete execution plan</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className={`${s.color}`}>{s.icon}</div>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={`glass-card rounded-3xl border ${m.border} overflow-hidden group hover:scale-[1.01] transition-transform`}
          >
            <div className={`bg-gradient-to-br ${m.color} p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`${m.accent}`}>{m.icon}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.badgeColor}`}>{m.badge}</span>
              </div>
              <h2 className="text-xl font-black text-zinc-100 mb-2">{m.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{m.description}</p>
            </div>

            <div className="p-6">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">Mission Steps</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {m.steps.map((step, si) => (
                  <div key={si} className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${m.accent} bg-white/5 shrink-0`}>{si + 1}</span>
                    <span className="text-zinc-400 text-xs">{step}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Zap size={12} />{m.estimatedTime}</span>
                  <span className="flex items-center gap-1"><Sparkles size={12} />{m.modules} AI modules</span>
                </div>
                <Link
                  href={`/missions/${m.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${m.accent} bg-white/5 hover:bg-white/10`}
                >
                  Launch <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
