"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, AlertCircle, DollarSign, Target } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type SaasValidatorResponse = {
  scores?: {
    market_demand?: number;
    competition?: number;
    monetization?: number;
    feasibility?: number;
    growth?: number;
  };
  overall_score?: string;
  revenue_projection?: string;
  competitors?: string[];
  go_to_market?: string;
};

export default function SaasValidatorPage() {
  const { modelPreferences } = useGlobalStore();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SaasValidatorResponse | null>(null);

  const handle = async () => {
    if (!idea.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<SaasValidatorResponse>("/api/ai/validate-saas", { method: "POST", body: JSON.stringify({ idea: idea.trim(), model_pref: modelPreferences.ai_content }) });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to validate SaaS idea.");
    } finally { setLoading(false); }
  };

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div><div className="flex justify-between mb-1"><span className="text-xs text-zinc-500">{label}</span><span className="text-xs font-medium" style={{ color }}>{score}/10</span></div><div className="w-full h-2 rounded-full bg-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${score * 10}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: color }} /></div></div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">SaaS Idea Validator</h1>
        <p className="text-zinc-500 text-sm">Validate SaaS ideas with market trend analysis, competition audit, and revenue projections.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <label className="text-xs font-medium text-zinc-400 mb-2 block">Describe Your SaaS Idea</label>
        <textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="e.g., An AI tool that automatically generates SEO blog posts from YouTube videos..." rows={4} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none mb-4" />
        <button onClick={handle} disabled={loading || !idea.trim()} className="gradient-bg-emerald px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : <><Lightbulb size={16} /> Validate Idea</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Validating SaaS idea...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-semibold text-zinc-200 mb-4">Validation Scores</h3>
            <div className="space-y-3">
              <ScoreBar label="Market Demand" score={result.scores?.market_demand || 7} color="#10b981" />
              <ScoreBar label="Competition Level" score={result.scores?.competition || 5} color="#f59e0b" />
              <ScoreBar label="Monetization Potential" score={result.scores?.monetization || 8} color="#8b5cf6" />
              <ScoreBar label="Technical Feasibility" score={result.scores?.feasibility || 7} color="#06b6d4" />
              <ScoreBar label="Growth Potential" score={result.scores?.growth || 8} color="#f43f5e" />
            </div>
            <div className="mt-4 text-center"><span className="text-2xl font-bold gradient-text">{result.overall_score || "7.0"}/10</span><p className="text-xs text-zinc-500 mt-1">Overall Viability</p></div>
          </div>
          {result.revenue_projection && <div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-emerald-300 mb-2 text-sm flex items-center gap-2"><DollarSign size={14} /> Revenue Projection</h3><p className="text-sm text-zinc-400">{result.revenue_projection}</p></div>}
          {result.competitors && <div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-amber-300 mb-2 text-sm flex items-center gap-2"><Target size={14} /> Key Competitors</h3><div className="flex flex-wrap gap-2">{result.competitors.map((c: string, i: number) => (<span key={i} className="px-3 py-1.5 rounded-lg glass text-sm text-zinc-300">{c}</span>))}</div></div>}
          {result.go_to_market && <div className="glass-card p-5 rounded-2xl border border-violet-500/20"><h3 className="font-semibold text-violet-300 mb-2 text-sm">Go-to-Market Strategy</h3><p className="text-sm text-zinc-400 leading-relaxed">{result.go_to_market}</p></div>}
        </motion.div>
      )}
    </div>
  );
}
