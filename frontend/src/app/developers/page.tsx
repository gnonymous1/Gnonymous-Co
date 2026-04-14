"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2, Key, Copy, Check, RefreshCw, Zap, BarChart3,
  Shield, Book, Terminal, ChevronRight, AlertCircle
} from "lucide-react";

const TIERS = [
  { name: "Free", color: "text-zinc-400", rateLimit: "100 req/day", endpoints: 5, latency: "~800ms" },
  { name: "Pro", color: "text-violet-400", rateLimit: "5,000 req/day", endpoints: 25, latency: "~200ms" },
  { name: "Agency", color: "text-amber-400", rateLimit: "Unlimited", endpoints: 47, latency: "~80ms" },
];

const ENDPOINTS = [
  { method: "POST", path: "/api/seo/keywords", description: "Keyword research + SERP analysis", tier: "free" },
  { method: "POST", path: "/api/yt/analyze", description: "YouTube channel & video analysis", tier: "free" },
  { method: "POST", path: "/api/ai/script", description: "AI script generation", tier: "pro" },
  { method: "POST", path: "/api/tt/trend-scan", description: "TikTok trend scanner", tier: "pro" },
  { method: "POST", path: "/api/pipeline/create", description: "Create async content pipeline", tier: "pro" },
  { method: "GET", path: "/api/pipeline/jobs", description: "List all pipeline jobs", tier: "pro" },
  { method: "POST", path: "/api/seo/competitor-audit", description: "Full competitor SERP audit", tier: "agency" },
  { method: "POST", path: "/api/missions/run", description: "Run guided mission workflow", tier: "agency" },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400",
  POST: "bg-violet-500/20 text-violet-400",
  DELETE: "bg-rose-500/20 text-rose-400",
};

const TIER_BADGE: Record<string, string> = {
  free: "bg-zinc-500/20 text-zinc-400",
  pro: "bg-violet-500/20 text-violet-300",
  agency: "bg-amber-500/20 text-amber-400",
};

const EXAMPLE_CODE = `import httpx

API_KEY = "acx_your_api_key_here"
BASE_URL = "http://localhost:8000"

# Keyword research
response = httpx.post(
    f"{BASE_URL}/api/seo/keywords",
    headers={"X-API-Key": API_KEY},
    json={"query": "best AI tools 2026", "limit": 20}
)
print(response.json())`;

export default function DevelopersPage() {
  const [apiKey] = useState("acx_demo_" + Math.random().toString(36).slice(2, 14));
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [methodFilter, setMethodFilter] = useState("All");

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = ENDPOINTS.filter(e => methodFilter === "All" || e.method === methodFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
          <Code2 size={20} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-100">Developer API</h1>
          <p className="text-zinc-500 text-sm">Integrate Apex Content OS into your apps and workflows</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* API Key */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Key size={16} className="text-cyan-400" />
              <h2 className="font-bold text-zinc-200 text-sm">Your API Key</h2>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 font-mono text-xs text-zinc-300 overflow-hidden text-ellipsis">
                {showKey ? apiKey : "acx_••••••••••••••••••"}
              </div>
              <button onClick={() => setShowKey(p => !p)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400">
                <Shield size={14} />
              </button>
              <button onClick={() => copy(apiKey)} className="p-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl text-cyan-400">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-600">Current plan: <span className="text-violet-400 font-bold">Free</span> · 100 req/day</p>

            <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 text-xs font-bold flex items-center justify-center gap-2 border border-white/10">
              <RefreshCw size={12} /> Regenerate Key
            </button>
          </motion.div>

          {/* Plan tiers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-5 rounded-2xl">
            <h2 className="font-bold text-zinc-200 text-sm mb-4 flex items-center gap-2"><BarChart3 size={14} /> Rate Limits</h2>
            <div className="space-y-3">
              {TIERS.map(tier => (
                <div key={tier.name} className="p-3 bg-white/3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black ${tier.color}`}>{tier.name}</span>
                    <span className="text-[10px] text-zinc-600">{tier.latency}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{tier.rateLimit}</p>
                  <p className="text-[10px] text-zinc-600">{tier.endpoints} endpoints</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick note */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={13} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Authentication</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">Pass your key in the <code className="text-amber-400 bg-black/40 px-1 rounded">X-API-Key</code> header for every request.</p>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Code example */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-black/40 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400" />
                <span className="text-sm font-bold text-zinc-300">Quick Start — Python</span>
              </div>
              <button onClick={() => copy(EXAMPLE_CODE)} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-zinc-400 font-bold">
                {copied ? <Check size={12} /> : <Copy size={12} />} Copy
              </button>
            </div>
            <pre className="p-5 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto">
              <code>{EXAMPLE_CODE}</code>
            </pre>
          </motion.div>

          {/* Endpoints */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Book size={14} className="text-violet-400" />
                <span className="text-sm font-bold text-zinc-300">Available Endpoints</span>
              </div>
              <div className="flex gap-2">
                {["All", "GET", "POST"].map(m => (
                  <button key={m} onClick={() => setMethodFilter(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${methodFilter === m ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-zinc-500"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {filtered.map((ep, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-white/3 transition-colors group">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
                  <code className="text-xs text-cyan-400 font-mono flex-1">{ep.path}</code>
                  <span className="text-xs text-zinc-500 hidden md:block flex-1">{ep.description}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${TIER_BADGE[ep.tier]}`}>{ep.tier}</span>
                  <ChevronRight size={12} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-zinc-600">Showing {filtered.length} of {ENDPOINTS.length} endpoints</span>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                Full API Docs <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
