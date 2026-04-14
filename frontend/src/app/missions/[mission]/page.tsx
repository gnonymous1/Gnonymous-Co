"use client";
import React, { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Loader2, ChevronRight, ChevronLeft, Rocket,
  Sparkles, Copy, Check, RotateCcw
} from "lucide-react";
import Link from "next/link";

const MISSIONS: Record<string, {
  title: string;
  color: string;
  accent: string;
  steps: { name: string; prompt: string; output: string }[];
}> = {
  "viral-youtube": {
    title: "Viral YouTube Channel Launch",
    color: "from-rose-600/30 to-rose-500/10",
    accent: "text-rose-400",
    steps: [
      {
        name: "Niche & Competitor Audit",
        prompt: "Enter your target niche or topic area",
        output: `✅ Niche Analysis Complete\n\n**Recommended Niche:** AI Productivity Tools\n**Market Size:** 8.4M monthly searches\n**Avg CPM:** $12.40\n**Top 3 Competitors:** MattVidPro AI, AI Advantage, All About AI\n\n**Opportunity Score:** 91/100\n**Content Gap Found:** "Beginner AI tutorials" — massive underserved gap\n**Best Sub-Niche:** "AI tools for non-techies" (3.2K searches, KD: 18)`,
      },
      {
        name: "Channel SEO Setup",
        prompt: "Your channel name (or desired name)",
        output: `✅ Channel SEO Blueprint\n\n**Optimized Name:** "[Name] | AI Simplified"\n**Keyword-Rich Description Template:** Generated ✓\n**5 Channel Tags:** ai tools, artificial intelligence, productivity, beginner ai, chatgpt tutorials\n**About Page Copy:** Generated (450 chars) ✓\n**Suggested Banner Hook:** "New AI Tool Every Week"`,
      },
      {
        name: "First 10 Video Scripts",
        prompt: "Top 3 topics you want to cover",
        output: `✅ 10 Video Scripts Generated\n\n1. "5 Free AI Tools That Replace Expensive Software" — 1,240 words ✓\n2. "ChatGPT Prompt That Writes Your Emails" — 980 words ✓\n3. "I Tried 10 AI Image Generators (Honest Review)" — 1,450 words ✓\n4–10: Outlines ready, full scripts on demand\n\n**Avg. CTR Hook Score:** 87/100\n**Est. Watch Time Per Video:** 6–8 min`,
      },
      {
        name: "Thumbnail Concepts",
        prompt: "Your primary brand color",
        output: `✅ Thumbnail Concepts Ready\n\n**Style:** High-contrast text + face reaction\n**Color Palette:** Deep blue + neon yellow (highest CTR combo for tech)\n**Font Rec:** Bebas Neue + Impact\n**Concept 1:** "SHOCKED FACE + BIG TEXT + Before/After"\n**Concept 2:** "Split screen: old vs AI-powered"\n**Concept 3:** "Minimal: just number + emoji"\n\n**Predicted CTR Range:** 6–11%`,
      },
      {
        name: "Upload Schedule",
        prompt: "How many hours/week can you dedicate?",
        output: `✅ 30-Day Upload Calendar\n\nWeek 1-2: 2x/week (Tue + Thu, 6 PM EST)\nWeek 3+: 3x/week when batch production begins\n\n**Optimal Upload Window:** Tue–Thu 3–6 PM EST\n**Shorts Strategy:** 1 Short per long-form (auto-repurpose)\n**Posting Queue:** Videos 1–6 fully scheduled ✓\n**Community Post Plan:** Weekly poll on Sundays`,
      },
      {
        name: "Analytics Baseline",
        prompt: "Your expected starting subscriber count",
        output: `✅ 90-Day Growth Projection\n\nMonth 1: 0 → 250 subs | 3.2K views\nMonth 2: 250 → 1,100 subs | 14K views  \nMonth 3: 1,100 → 3,800 subs | 48K views\n\n**Key Metrics to Track:** CTR > 5%, AVD > 45%, Sub/View ratio > 2%\n**Monetization Threshold:** Est. Month 4–5 (YouTube Partner)\n**Est. RPM at 1K subs:** $8–14\n**First Sponsorship Est.:** Month 3 ($150–400 per video)`,
      },
    ],
  },
  "seo-domination": {
    title: "SEO Domination Sprint",
    color: "from-violet-600/30 to-violet-500/10",
    accent: "text-violet-400",
    steps: [
      { name: "Keyword Gap Analysis", prompt: "Your website URL or niche", output: "✅ 47 keyword gaps identified. Top opportunity: 'best crm software 2026' (12K/mo, KD 24). Full cluster exported." },
      { name: "Competitor SERP Audit", prompt: "Top competitor domain", output: "✅ Competitor audit complete. 8 backlink gaps. 3 content formats outperforming you. Quick wins mapped." },
      { name: "Content Cluster Map", prompt: "Primary keyword to dominate", output: "✅ Topical cluster: 1 pillar + 12 supporting articles. Internal link map generated. 60-day ranking timeline set." },
      { name: "10 Article Briefs", prompt: "Target readers (beginners / pros)", output: "✅ 10 SEO briefs ready. Avg target word count: 2,400. LSI keywords, headings, and FAQs included per article." },
      { name: "Internal Link Strategy", prompt: "Number of existing articles", output: "✅ Internal link map created. 34 link placements identified. Anchor text variations assigned. PageRank flow optimized." },
      { name: "Rank Tracking Setup", prompt: "Preferred tracking tool (or 'none')", output: "✅ Tracking configured for 47 keywords. Weekly ranking report template. Alert thresholds set. 90-day forecast ready." },
    ],
  },
  "content-repurpose": {
    title: "Omnichannel Content Repurpose",
    color: "from-cyan-600/30 to-cyan-500/10",
    accent: "text-cyan-400",
    steps: [
      { name: "Source Content Input", prompt: "Paste your source content URL or topic", output: "✅ Content analyzed. Key insights extracted: 5 main points, 3 quotable moments, 2 data points, 1 core argument." },
      { name: "YouTube Long-Form", prompt: "Desired video length (10/20/30 min)", output: "✅ YouTube script generated: 2,200 words, 18-min runtime. Hook, 5-act structure, CTAs. Chapters timestamped." },
      { name: "TikTok Shorts (x3)", prompt: "Your TikTok style (educational/entertaining)", output: "✅ 3 TikTok scripts: 45s, 38s, 52s. Hook in first 2 seconds. Text overlay notes. Audio cue suggestions." },
      { name: "Twitter/X Thread", prompt: "Thread length preference (10/20 tweets)", output: "✅ 15-tweet thread. Opening hook, value progression, CTA tweet. Quote-tweet suggestion. Optimal posting time: Tue 8 AM EST." },
      { name: "LinkedIn Article", prompt: "Your professional angle/industry", output: "✅ LinkedIn article: 1,100 words. Professional tone, data-backed, 3 personal insights. Hashtag set (#contentmarketing #ai #growth)." },
      { name: "Blog Post + SEO", prompt: "Target keyword for the blog", output: "✅ Blog post: 2,800 words. SEO optimized (KD 19, 4.2K search vol). Meta title + description. Featured image concept. Schema ready." },
    ],
  },
  "monetize-niche": {
    title: "Niche Monetization Blueprint",
    color: "from-emerald-600/30 to-emerald-500/10",
    accent: "text-emerald-400",
    steps: [
      { name: "Niche Profitability Score", prompt: "Topics you're interested in (comma separated)", output: "✅ Top niche: AI Finance Tools — Score 94/100. CPC $11.20, affiliate density: high, competition: medium. 3-year growth: +380%." },
      { name: "Audience Pain Analysis", prompt: "Your target audience", output: "✅ Top 5 pains identified. #1: 'Too many tools, don't know which work.' Hook: 'I tested 50 AI tools so you don't have to.'" },
      { name: "Affiliate Program Map", prompt: "Content platform (YouTube / Blog / Both)", output: "✅ 8 programs mapped. Best: Jasper AI ($200/sale), ConvertKit (30% recurring), Notion ($10/ref). Monthly potential at 1K traffic: $840." },
      { name: "Lead Magnet Creation", prompt: "Your best skill or knowledge area", output: "✅ Lead magnet: 'The 10 AI Tools That Made Me $5K/Month' (PDF). Outline + 3 key sections drafted. Opt-in conversion rate est: 34%." },
      { name: "Email Sequence Draft", prompt: "Welcome email tone (professional/casual)", output: "✅ 7-email sequence. Day 0: welcome + lead magnet. Day 2: story. Day 4: value. Day 7: soft pitch. Open rate optimization applied." },
      { name: "Revenue Projection", prompt: "Starting monthly traffic estimate", output: "✅ 12-Month Revenue Model:\nMonth 3: $480 (affiliate)\nMonth 6: $1,800 (affiliate + sponsorship)\nMonth 12: $6,400 (affiliate + digital products + ads)\nBreakeven: Month 2." },
    ],
  },
};

export default function MissionWizardPage({ params }: { params: Promise<{ mission: string }> }) {
  const { mission: missionId } = use(params);
  const mission = MISSIONS[missionId];

  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [runStatus, setRunStatus] = useState<Record<number, "idle" | "loading" | "done">>({});
  const [copied, setCopied] = useState<number | null>(null);

  if (!mission) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <Rocket size={48} className="text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-400 mb-2">Mission Not Found</h2>
        <Link href="/missions" className="text-violet-400 hover:text-violet-300">← Back to Missions</Link>
      </div>
    );
  }

  const currentStep = mission.steps[step];
  const totalSteps = mission.steps.length;
  const completedSteps = Object.values(runStatus).filter(s => s === "done").length;
  const isCurrentDone = runStatus[step] === "done";

  const runStep = async () => {
    setRunStatus(prev => ({ ...prev, [step]: "loading" }));
    await new Promise(r => setTimeout(r, 1800));
    setRunStatus(prev => ({ ...prev, [step]: "done" }));
  };

  const copyOutput = (i: number) => {
    navigator.clipboard.writeText(mission.steps[i].output);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/missions" className="text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1 mb-4">
          <ChevronLeft size={12} /> Back to Missions
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <Rocket size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">{mission.title}</h1>
            <p className="text-zinc-500 text-sm">{completedSteps} of {totalSteps} steps complete</p>
          </div>
          {completedSteps === totalSteps && (
            <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">✓ COMPLETE</span>
          )}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="glass-card px-5 py-4 rounded-2xl">
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>Mission Progress</span>
          <span className="font-bold text-zinc-200">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full" />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {mission.steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                runStatus[i] === "done" ? "bg-emerald-500/20 text-emerald-400" :
                i === step ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-zinc-600"
              }`}>
              {runStatus[i] === "done" ? <CheckCircle2 size={10} /> : <span>{i + 1}</span>}
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current step card */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
          className={`glass-card rounded-3xl overflow-hidden border ${
            isCurrentDone ? "border-emerald-500/20" : "border-violet-500/20"
          }`}>
          <div className={`bg-gradient-to-br ${mission.color} p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Step {step + 1} of {totalSteps}</span>
              {isCurrentDone && <CheckCircle2 size={18} className="text-emerald-400" />}
            </div>
            <h2 className="text-xl font-black text-zinc-100">{currentStep.name}</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Input */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest block mb-2">{currentStep.prompt}</label>
              <div className="flex gap-3">
                <input
                  value={inputs[step] || ""}
                  onChange={e => setInputs(prev => ({ ...prev, [step]: e.target.value }))}
                  disabled={isCurrentDone || runStatus[step] === "loading"}
                  placeholder="Type your input here…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm"
                />
                {!isCurrentDone ? (
                  <button onClick={runStep} disabled={runStatus[step] === "loading"}
                    className="px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white font-bold flex items-center gap-2 text-sm shrink-0">
                    {runStatus[step] === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {runStatus[step] === "loading" ? "Running…" : "Run AI"}
                  </button>
                ) : (
                  <button onClick={() => setRunStatus(prev => ({ ...prev, [step]: "idle" }))}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold flex items-center gap-2 text-sm shrink-0">
                    <RotateCcw size={15} /> Redo
                  </button>
                )}
              </div>
            </div>

            {/* Output */}
            <AnimatePresence>
              {runStatus[step] === "loading" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl flex items-center gap-3">
                  <Loader2 size={18} className="text-violet-400 animate-spin shrink-0" />
                  <p className="text-sm text-zinc-400">AI executing step…</p>
                </motion.div>
              )}
              {isCurrentDone && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-300">Output Ready</span>
                    </div>
                    <button onClick={() => copyOutput(step)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-zinc-400 font-bold">
                      {copied === step ? <Check size={12} /> : <Copy size={12} />}
                      {copied === step ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{currentStep.output}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-white/5 flex justify-between">
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl text-zinc-400 font-bold text-sm">
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => step < totalSteps - 1 ? setStep(s => s + 1) : null}
              disabled={step === totalSteps - 1}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 rounded-xl text-white font-bold text-sm">
              Next Step <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Completion */}
      {completedSteps === totalSteps && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-zinc-100 mb-2">Mission Complete! 🚀</h3>
          <p className="text-zinc-400 text-sm mb-6">All {totalSteps} steps executed. Your complete action plan is ready.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/missions" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold">
              More Missions
            </Link>
            <Link href="/autopilot" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold flex items-center gap-2">
              <Sparkles size={16} /> Try Autopilot
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
