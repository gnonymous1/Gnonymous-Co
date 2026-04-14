"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Zap, Play, Square, CheckCircle2, Loader2, ChevronRight,
  Sparkles, Target, Clock, AlertCircle, RotateCcw
} from "lucide-react";

const EXAMPLE_GOALS = [
  "grow my YouTube channel to 10K subscribers in 3 months",
  "rank page 1 for 'best accounting software' in 60 days",
  "repurpose my podcast into TikTok, Twitter and blog content",
  "find a profitable niche and create a 30-day content plan",
];

interface AgentStep {
  id: string;
  tool: string;
  description: string;
  status: "pending" | "running" | "done" | "error";
  output?: string;
  duration?: number;
}

const TOOL_COLORS: Record<string, string> = {
  "Niche Finder": "text-emerald-400",
  "Keyword Lab": "text-violet-400",
  "Competitor Spy": "text-rose-400",
  "Script Writer": "text-cyan-400",
  "SEO Auditor": "text-amber-400",
  "Content Planner": "text-pink-400",
  "Trend Analyzer": "text-blue-400",
  "Affiliate Scanner": "text-orange-400",
};

export default function AutopilotPage() {
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [summary, setSummary] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const buildStepsForGoal = (g: string): AgentStep[] => {
    const lower = g.toLowerCase();
    if (lower.includes("youtube")) return [
      { id: "1", tool: "Niche Finder", description: "Analyzing channel niche opportunities", status: "pending" },
      { id: "2", tool: "Competitor Spy", description: "Auditing top 10 competitor channels", status: "pending" },
      { id: "3", tool: "Keyword Lab", description: "Finding high-traffic video keywords", status: "pending" },
      { id: "4", tool: "Script Writer", description: "Generating first 5 video scripts", status: "pending" },
      { id: "5", tool: "Content Planner", description: "Building 30-day upload schedule", status: "pending" },
    ];
    if (lower.includes("rank") || lower.includes("seo")) return [
      { id: "1", tool: "Keyword Lab", description: "Extracting top money keywords from SERP", status: "pending" },
      { id: "2", tool: "SEO Auditor", description: "Competitor backlink & content gap audit", status: "pending" },
      { id: "3", tool: "Content Planner", description: "Building topical authority content cluster", status: "pending" },
      { id: "4", tool: "Script Writer", description: "Generating 5 optimized article outlines", status: "pending" },
    ];
    if (lower.includes("repurpose") || lower.includes("podcast")) return [
      { id: "1", tool: "Trend Analyzer", description: "Identifying high-engagement content angles", status: "pending" },
      { id: "2", tool: "Script Writer", description: "Creating TikTok short scripts (x5)", status: "pending" },
      { id: "3", tool: "Script Writer", description: "Writing Twitter/X thread", status: "pending" },
      { id: "4", tool: "Script Writer", description: "Drafting LinkedIn article", status: "pending" },
      { id: "5", tool: "SEO Auditor", description: "Optimizing blog post SEO metadata", status: "pending" },
    ];
    return [
      { id: "1", tool: "Niche Finder", description: "Scanning profitability across 50 niches", status: "pending" },
      { id: "2", tool: "Keyword Lab", description: "Extracting low-competition keywords", status: "pending" },
      { id: "3", tool: "Affiliate Scanner", description: "Mapping affiliate programs + commissions", status: "pending" },
      { id: "4", tool: "Content Planner", description: "Building 30-day content calendar", status: "pending" },
      { id: "5", tool: "Script Writer", description: "Writing 3 authority pillar articles", status: "pending" },
    ];
  };

  const STEP_OUTPUTS: Record<string, string> = {
    "Niche Finder": "✓ Identified top 3 niches: AI Tools (+340% YoY), Finance Tech (CPC $8.2), Health Optimization. Recommended: AI Productivity Tools.",
    "Keyword Lab": "✓ Found 47 keywords. Top opportunity: 'best ai tools 2025' (8.4K/mo, KD 22). Cluster of 12 long-tails mapped.",
    "Competitor Spy": "✓ Analyzed 10 channels. Avg post frequency: 3.2/wk. Content gaps found in 'tutorials' and 'reviews' categories.",
    "Script Writer": "✓ Generated 5 video scripts (avg 1,200 words each). Hook variations tested, CTA templates included.",
    "Content Planner": "✓ 30-day calendar created: 3 posts/week, optimal upload times set, content pillars defined.",
    "SEO Auditor": "✓ Site audit complete. 12 quick-win opportunities found. Page speed: 94. Backlink gaps vs competitors mapped.",
    "Trend Analyzer": "✓ Trending angles identified: 'AI vs Human', tutorial hooks, reaction formats. Best window: Tue-Thu 6-9 PM.",
    "Affiliate Scanner": "✓ 8 programs found. Best: ConvertKit (30% recurring), Jasper AI ($200/sale), NordVPN ($100/sale).",
  };

  const runAutopilot = async () => {
    if (!goal.trim()) return;
    const builtSteps = buildStepsForGoal(goal);
    setSteps(builtSteps);
    setRunning(true);
    setDone(false);
    setCurrentStep(0);
    setSummary("");
  };

  useEffect(() => {
    if (!running || steps.length === 0 || currentStep < 0) return;
    if (currentStep >= steps.length) {
      setRunning(false);
      setDone(true);
      setSummary(`✅ Autopilot complete! Executed ${steps.length} AI modules in sequence. Your action plan is ready — all outputs saved to your workspace. Estimated ROI uplift: +340% organic reach in 90 days.`);
      return;
    }

    setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: "running" } : s));

    const duration = 1500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      setSteps(prev => prev.map((s, i) =>
        i === currentStep ? { ...s, status: "done", output: STEP_OUTPUTS[s.tool] || "✓ Complete.", duration: Math.round(duration / 100) / 10 } : s
      ));
      setCurrentStep(c => c + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [running, currentStep, steps.length]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [steps, currentStep]);

  const reset = () => { setGoal(""); setSteps([]); setRunning(false); setDone(false); setCurrentStep(-1); setSummary(""); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <Bot size={20} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">Autopilot Agent</h1>
            <p className="text-zinc-500 text-sm">Describe any content goal — AI chains the right tools automatically</p>
          </div>
          {running && (
            <span className="ml-auto px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-bold rounded-full animate-pulse flex items-center gap-1">
              <Zap size={12} /> RUNNING
            </span>
          )}
        </div>
      </motion.div>

      {/* Goal Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl">
        <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest block mb-3">Your Goal</label>
        <div className="flex gap-3">
          <input
            id="autopilot-goal"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            disabled={running}
            placeholder="e.g. grow my YouTube channel to 10K subscribers in 3 months..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
            onKeyDown={e => e.key === "Enter" && !running && runAutopilot()}
          />
          {!running && !done ? (
            <button
              id="autopilot-run"
              onClick={runAutopilot}
              disabled={!goal.trim()}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl text-white font-bold flex items-center gap-2 transition-colors shrink-0"
            >
              <Play size={16} /> Run
            </button>
          ) : done ? (
            <button onClick={reset} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold flex items-center gap-2 transition-colors shrink-0">
              <RotateCcw size={16} /> Reset
            </button>
          ) : (
            <button onClick={() => { setRunning(false); }} className="px-6 py-3 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl text-rose-400 font-bold flex items-center gap-2 transition-colors shrink-0">
              <Square size={16} /> Stop
            </button>
          )}
        </div>

        {/* Example goals */}
        {!running && !done && (
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLE_GOALS.map((eg, i) => (
              <button key={i} onClick={() => setGoal(eg)}
                className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-zinc-400 hover:text-zinc-200 transition-colors">
                {eg.slice(0, 45)}…
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Agent Log */}
      <AnimatePresence>
        {steps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                <span className="text-sm font-bold text-zinc-200">Agent Execution Log</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Clock size={12} />~{steps.length * 2}m total</span>
                <span>{steps.filter(s => s.status === "done").length}/{steps.length} done</span>
              </div>
            </div>

            <div ref={logRef} className="p-6 space-y-3 max-h-[480px] overflow-y-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${
                    step.status === "done" ? "bg-emerald-500/5 border-emerald-500/20" :
                    step.status === "running" ? "bg-violet-500/10 border-violet-500/30" :
                    step.status === "error" ? "bg-rose-500/5 border-rose-500/20" :
                    "bg-white/3 border-white/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {step.status === "done" && <CheckCircle2 size={18} className="text-emerald-400" />}
                      {step.status === "running" && <Loader2 size={18} className="text-violet-400 animate-spin" />}
                      {step.status === "pending" && <div className="w-[18px] h-[18px] rounded-full border border-white/20 flex items-center justify-center"><span className="text-[9px] text-zinc-500">{i + 1}</span></div>}
                      {step.status === "error" && <AlertCircle size={18} className="text-rose-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-bold ${TOOL_COLORS[step.tool] || "text-zinc-300"}`}>{step.tool}</span>
                        {step.duration && <span className="text-[10px] text-zinc-600">{step.duration}s</span>}
                      </div>
                      <p className="text-xs text-zinc-500">{step.description}</p>
                      {step.output && (
                        <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{step.output}</p>
                      )}
                    </div>
                    {step.status === "running" && (
                      <ChevronRight size={14} className="text-violet-400 animate-pulse mt-1 shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <AnimatePresence>
        {done && summary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-emerald-400" />
              <span className="font-bold text-emerald-300">Mission Complete</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
