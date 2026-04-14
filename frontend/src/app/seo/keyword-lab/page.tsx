"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Search, Loader2, AlertCircle, Copy, Check, TrendingUp, Target } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface KeywordCluster {
  parent_topic: string;
  keywords: {
    keyword: string;
    estimated_volume: string;
    difficulty: string;
    intent: string;
  }[];
}

interface KeywordResponse {
  seed_keyword: string;
  clusters: KeywordCluster[];
  long_tail_keywords: string[];
  question_keywords: string[];
  model_used: string;
}

export default function KeywordLabPage() {
  const { apiKeys, modelPreferences } = useGlobalStore();
  const [seedKeyword, setSeedKeyword] = useState("AI SaaS Marketing");
  const [niche, setNiche] = useState("Technology");
  const [country, setCountry] = useState("us");
  const [targetIntent, setTargetIntent] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = React.useState<KeywordResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const handleResearch = async () => {
    if (!seedKeyword.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const data = await apiCall<KeywordResponse>("/api/seo/keyword-research", {
        method: "POST",
        body: JSON.stringify({
          seed_keyword: seedKeyword.trim(),
          niche: niche.trim() || "general",
          country,
          target_intent: targetIntent,
          model_pref: modelPreferences.seo,
        }),
      });
      setResults(data);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Research failed.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Input Operations */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 0% 0%, rgba(210, 187, 255, 0.05) 0%, transparent 40%)" }} />
          <div id="grid-overlay" className="opacity-5" />
        </div>
        
        <div className="relative space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 font-mono"><FlaskConical size={10} className="text-brand-secondary" /> Mission Seed</label>
              <input type="text" value={seedKeyword} onChange={(e) => setSeedKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleResearch()} placeholder="Enter focus vector (e.g., AI Analytics)..." className="glass-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 font-mono"><TrendingUp size={10} className="text-brand-primary" /> Target Vertical</label>
              <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Enterprise SaaS" className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={handleResearch} disabled={loading || !seedKeyword.trim()} className="btn btn-primary w-full h-[46px] font-bold text-xs tracking-widest uppercase shadow-brand">
                {loading ? <><Loader2 size={16} className="animate-spin" /> DISCOVERING...</> : <><Search size={16} /> INITIALIZE LAB</>}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest font-mono">Geo Market:</span>
              <div className="flex gap-1.5">
                {["us", "uk", "ca", "au"].map((c) => (
                  <button key={c} onClick={() => setCountry(c)} className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold transition-all border ${country === c ? "bg-brand-primary/20 text-brand-primary border-brand-primary/30" : "text-text-4 border-transparent hover:text-text-2"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-text-4 uppercase tracking-widest font-mono">Intent Filter:</span>
              <div className="flex gap-1.5">
                {["all", "informational", "commercial", "transactional"].map((intent) => (
                  <button key={intent} onClick={() => setTargetIntent(intent)} className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold font-mono transition-all border ${targetIntent === intent ? "bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30" : "text-text-4 border-transparent hover:text-text-2"}`}>
                    {intent === "all" ? "MIXED" : intent}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-400" /><span className="text-xs font-mono font-bold text-rose-300 uppercase">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center py-20">
          <div className="dot-live scale-150 mb-8" />
          <p className="text-text-3 text-sm font-mono uppercase tracking-[0.2em] animate-pulse">Clustering Semantic Intelligence...</p>
        </div>
      )}

      {results && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          
          {/* Master Intelligence Grid */}
          <div className="glass-card rounded-2xl border-white/5 overflow-hidden shadow-2xl bg-surface-lowest/40">
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-brand-secondary/10 to-transparent flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-text-1 flex items-center gap-3 uppercase tracking-[0.2em] font-mono"><Target size={16} className="text-brand-secondary" /> Master Strategy Blueprint</h3>
                <p className="text-[10px] text-text-4 mt-1 font-mono uppercase opacity-70">Calculated ranking vectors for deployment.</p>
              </div>
              <div className="flex gap-3">
                 <span className="badge badge-pro scale-90 opacity-70">MODEL: {results.model_used}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="font-mono text-[10px] uppercase">Search Vector</th>
                    <th className="font-mono text-[10px] uppercase">Intent Psychology</th>
                    <th className="font-mono text-[10px] uppercase">Target Asset</th>
                    <th className="font-mono text-[10px] uppercase">Telemetry</th>
                    <th className="font-mono text-[10px] uppercase px-6">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {results.clusters.flatMap(c => c.keywords).map((kw, i) => (
                    <tr key={i} className="group">
                      <td>
                        <p className="text-sm font-bold text-text-1 group-hover:text-brand-secondary transition-colors">{kw.keyword}</p>
                        <p className="text-[10px] text-text-4 font-mono uppercase opacity-60">Seed: {results.seed_keyword}</p>
                      </td>
                      <td>
                        <span className={`badge ${kw.intent === "Transactional" ? "badge-pro" : kw.intent === "Commercial" ? "badge-hard" : "badge-live"} font-mono text-[10px]`}>
                          {kw.intent}
                        </span>
                      </td>
                      <td>
                         <div className="p-3 rounded-xl bg-surface-lowest border border-white/5 max-w-sm group-hover:border-brand-secondary/30 transition-all">
                            <p className="text-[11px] text-text-3 font-medium leading-relaxed italic group-hover:text-text-2">&quot;The definitive guide to {kw.keyword} for maximum ROI in 2026.&quot;</p>
                         </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-5">
                          <div>
                            <p className="text-[9px] text-text-4 uppercase font-bold font-mono">Vol</p>
                            <p className="text-xs text-text-1 font-mono">{kw.estimated_volume}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-text-4 uppercase font-bold font-mono">Diff</p>
                            <span className={`text-xs font-black font-mono ${kw.difficulty === "Low" ? "text-brand-primary" : kw.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"}`}>{kw.difficulty}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6">
                        <button onClick={() => copyText(kw.keyword, `m-${i}`)} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-text-4 hover:text-white hover:bg-brand-secondary/20 hover:border-brand-secondary/30 transition-all">
                           {copiedIdx === `m-${i}` ? <Check size={14} className="text-brand-primary" /> : <Copy size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Semantic Clusters */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               {results.clusters.map((cluster, ci) => (
                <motion.div key={ci} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl border-white/5 bg-surface-lowest/40">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-brand-secondary text-[11px] uppercase tracking-[0.2em] font-mono">{cluster.parent_topic}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary rounded-md border border-brand-secondary/20 font-mono">{cluster.keywords.length} SEMA-NODES</span>
                  </div>
                  <div className="space-y-1">
                     {cluster.keywords.slice(0, 4).map((kw, ki) => (
                       <div key={ki} className="flex items-center justify-between text-xs py-2 px-3 rounded-lg hover:bg-white/5 transition-all text-text-3 hover:text-text-1 group/row">
                          <span className="font-medium">{kw.keyword}</span>
                          <span className="text-[10px] font-mono text-text-4 group-hover/row:text-text-3">{kw.estimated_volume}</span>
                       </div>
                     ))}
                  </div>
                </motion.div>
               ))}
            </div>

            {/* Strategic Verticals (Long Tail & Questions) */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border-white/5 bg-brand-primary/2">
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-5 flex items-center gap-2 font-mono"><TrendingUp size={14} /> Long-Tail Capture</h3>
                <div className="space-y-1">
                  {results.long_tail_keywords.map((kw, i) => (
                    <div key={i} onClick={() => copyText(kw, `lt-${i}`)} className="group flex items-center justify-between text-xs text-text-3 hover:text-brand-primary p-2.5 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                      <span className="truncate italic">{kw}</span>
                      <Copy size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>

               <div className="glass-card p-6 rounded-2xl border-white/5 bg-brand-accent/2">
                <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2 font-mono"><Search size={14} /> User Questions</h3>
                <div className="space-y-1">
                  {results.question_keywords.map((kw, i) => (
                    <div key={i} onClick={() => copyText(kw, `q-${i}`)} className="group flex items-center justify-between text-xs text-text-3 hover:text-amber-400 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-white/5">
                      <span className="truncate italic">{kw}</span>
                      <Copy size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

