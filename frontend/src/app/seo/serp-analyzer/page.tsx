"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Cpu, Download, BarChart3, TrendingUp, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface SerpResult {
  position: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  estimated_da: number;
  content_type: string;
  sentiment?: string;
  readability?: string;
}

interface SerpInsights {
  avg_content_length: number;
  avg_da: number;
  content_gaps: string[];
  ranking_factors: string[];
  difficulty: string;
  search_intent: string;
}

interface SerpResponse {
  keyword: string;
  total_results: number;
  top_results: SerpResult[];
  insights: SerpInsights;
  recommendation: string;
  model_used: string;
  credits_used: { input: number; output: number } | null;
}

const countries = [
  { code: "us", name: "United States" }, { code: "uk", name: "United Kingdom" },
  { code: "pk", name: "Pakistan" }, { code: "in", name: "India" },
  { code: "ca", name: "Canada" }, { code: "au", name: "Australia" },
  { code: "de", name: "Germany" }, { code: "fr", name: "France" },
];

export default function SerpAnalyzerPage() {
  const { apiKeys, modelPreferences } = useGlobalStore();
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("us");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SerpResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "insights">("results");

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;
    if (!apiKeys.serper) {
      setError("Serper.dev API key not configured. Access denied.");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const data = await apiCall<SerpResponse>("/api/seo/serp-analyze", {
        method: "POST",
        body: JSON.stringify({
          keyword: keyword.trim(),
          country,
          language: "en",
          model_pref: modelPreferences.seo,
        }),
      });
      setResults(data);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Analysis failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Search Console */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-2xl border-white/5"
      >
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Keyword Input */}
          <div className="flex-1">
            <label className="text-[10px] font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest">
              <Search size={10} /> Target Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter your target search term..."
              className="luxe-input w-full px-4 py-3 rounded-xl text-sm font-medium"
            />
          </div>

          {/* Country Selector */}
          <div className="w-full lg:w-48">
            <label className="text-[10px] font-bold text-zinc-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest">
              <Globe size={10} /> Search Location
            </label>
            <div className="relative">
               <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="luxe-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer font-medium"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-canvas text-text-1">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-4">
                <Globe size={12} />
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
              className="btn btn-primary px-8 h-[46px] text-xs font-bold tracking-widest uppercase shadow-emerald-900/40"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> ANALYZING...
                </>
              ) : (
                <>
                  <TrendingUp size={14} /> ANALYZE SERP
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
          >
            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
            <span className="text-xs font-mono font-medium text-rose-300 uppercase">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="dot-live scale-150 mb-8" />
            <p className="text-text-2 text-sm font-mono uppercase tracking-[0.2em] animate-pulse">Synchronizing Intelligence...</p>
            <p className="text-text-4 text-[10px] uppercase mt-2 font-mono">Targeting: {keyword} // Model: {modelPreferences.seo}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* High-Density Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Detected Results", value: results.total_results, icon: <BarChart3 size={14} />, color: "text-brand-secondary" },
                { label: "Inferred Authority", value: results.insights.avg_da || "—", icon: <ShieldCheck size={14} />, color: "text-brand-secondary" },
                { label: "Strategic Diff", value: results.insights.difficulty, icon: <AlertCircle size={14} />, color: "text-brand-accent amber-400" },
                { label: "Target Intent", value: results.insights.search_intent, icon: <Search size={14} />, color: "text-brand-primary" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 rounded-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-4 font-mono">{stat.label}</span>
                    <p className={`text-2xl font-black font-mono tracking-tighter ${stat.color === 'text-brand-accent amber-400' ? 'text-amber-400' : stat.color}`}>
                       {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View Selector */}
            <div className="flex gap-1.5 p-1 bg-surface-lowest border border-white/5 rounded-xl w-fit">
              {(["results", "insights"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-brand-primary text-white shadow-emerald-900/40"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {tab === "results" ? "Search Results" : "Content Intelligence"}
                </button>
              ))}
            </div>

            {/* Tactical Grid */}
            {activeTab === "results" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl overflow-hidden border-white/5 shadow-2xl"
              >
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="font-mono text-[10px] uppercase">Rank</th>
                        <th className="font-mono text-[10px] uppercase">Intel Title</th>
                        <th className="font-mono text-[10px] uppercase">Domain</th>
                        <th className="font-mono text-[10px] uppercase">AUTH</th>
                        <th className="font-mono text-[10px] uppercase">Vector</th>
                        <th className="font-mono text-[10px] uppercase">Sentiment</th>
                        <th className="font-mono text-[10px] uppercase">Tone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.top_results.map((result, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="group"
                        >
                          <td className="font-mono text-brand-secondary font-black text-xs px-6">
                            {result.position || i + 1}
                          </td>
                          <td className="max-w-md">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-text-1 font-semibold hover:text-brand-primary transition-colors flex items-center gap-1.5 text-sm"
                            >
                              <span className="truncate">{result.title || "Unknown Signal"}</span>
                              <ExternalLink size={10} className="opacity-30 group-hover:opacity-100 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="text-text-4 font-mono text-[10px] tracking-tight opacity-70">
                            {result.domain || "N/A"}
                          </td>
                          <td>
                            <span className={`badge ${
                              (result.estimated_da || 0) >= 70 ? "badge-hard" :
                              (result.estimated_da || 0) >= 40 ? "badge-medium" : "badge-live"
                            } font-mono text-[10px]`}>
                              {result.estimated_da || 0}
                            </span>
                          </td>
                          <td className="text-text-3 text-[10px] font-bold uppercase tracking-wider">
                            {result.content_type || "ARTICLE"}
                          </td>
                          <td className="text-[10px] font-mono font-black uppercase tracking-tighter">
                             <span className={result.sentiment?.toLowerCase() === 'positive' ? 'text-brand-primary' : result.sentiment?.toLowerCase() === 'negative' ? 'text-rose-400' : 'text-text-4'}>
                               {result.sentiment || "NEUTRAL"}
                             </span>
                          </td>
                          <td className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest italic opacity-80 px-6">
                             {result.readability || "OPTIMAL"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Neural Analysis */}
            {activeTab === "insights" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Master Recommendation */}
                <div className="lg:col-span-3 glass-card p-8 rounded-2xl border-brand-secondary/10 relative overflow-hidden bg-surface-lowest/40">
                  <div className="absolute inset-0 bg-brand-secondary/5 opacity-40 pointer-events-none" />
                  <div className="relative flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <Cpu size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-secondary">Master Analysis Recommendation</h3>
                        <p className="text-[10px] text-text-4 font-mono uppercase tracking-widest mt-0.5">Tactical Deployment Vector // Model: {results.model_used}</p>
                    </div>
                  </div>
                  <div className="relative text-text-2 text-sm leading-relaxed max-w-5xl">
                    <FormattedContent content={results.recommendation} />
                  </div>
                </div>

                {/* Content Gaps */}
                <div className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <TrendingUp size={16} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest font-mono">Structural Vulnerabilities</h3>
                  </div>
                  <ul className="space-y-3">
                    {results.insights.content_gaps.map((gap, i) => (
                      <li key={i} className="flex gap-3 text-xs text-text-3 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0 shadow-cyan" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ranking Factors */}
                <div className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-brand-primary mb-2">
                    <BarChart3 size={16} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest font-mono">Calculated Dominance Factors</h3>
                  </div>
                  <ul className="space-y-3">
                    {results.insights.ranking_factors.map((factor, i) => (
                      <li key={i} className="flex gap-3 text-xs text-text-3 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 flex-shrink-0 shadow-brand" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Intelligence Meta */}
                <div className="glass-card p-6 rounded-2xl border-white/5 flex flex-col justify-center gap-4">
                   <div className="p-4 rounded-xl bg-surface-lowest/60 border border-white/5">
                      <div className="text-[10px] font-bold text-text-4 uppercase mb-1 font-mono">NEURAL LOAD</div>
                      <div className="text-xl font-bold font-mono text-brand-secondary">
                        {results.credits_used?.output || 0 + (results.credits_used?.input || 0) || '0'} <span className="text-[10px] text-text-4 uppercase font-normal">TOKENS</span>
                      </div>
                   </div>
                   <button className="btn btn-secondary w-full text-xs font-bold uppercase font-mono tracking-widest h-11">
                     <Download size={14} className="mr-2" /> EXPORT LOGS
                   </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
