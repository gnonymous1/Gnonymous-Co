"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Loader2, AlertCircle, Award, ArrowRight } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type SnippetOpportunity = {
  question?: string;
  current_holder?: string;
  snippet_type?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  strategy?: string;
  suggestion?: string;
};

type SnippetHunterResponse = {
  snippets?: SnippetOpportunity[];
};

export default function SnippetHunterPage() {
  const { modelPreferences } = useGlobalStore();
  const [niche, setNiche] = useState("AI Content Marketing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = React.useState<SnippetHunterResponse | null>(null);

  const handle = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<SnippetHunterResponse>("/api/seo/snippet-hunt", { method: "POST", body: JSON.stringify({ niche: niche.trim(), model_pref: modelPreferences.seo }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to hunt snippets"); } finally { setLoading(false); }
  };

  React.useEffect(() => {
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Featured Snippet Hunter</h1>
        <p className="text-zinc-500 text-sm">Find questions where Google shows Position Zero and craft content to win them.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1"><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="e.g., digital marketing, web development" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <button onClick={handle} disabled={loading} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Hunting...</> : <><Target size={16} /> Hunt Snippets</>}
          </button>
        </div>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Hunting for featured snippet opportunities...</p></div>}
      {result?.snippets && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {result.snippets.map((s, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5 rounded-2xl">
              <div className="flex items-start gap-3">
                <Award size={18} className="text-amber-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-zinc-200 font-medium">{s.question}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Current holder: <span className="text-zinc-400">{s.current_holder || "Unknown"}</span></p>
                  <div className="mt-3 p-3 rounded-xl bg-white/2 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 mb-1 font-medium flex items-center gap-1"><ArrowRight size={10} /> Your Content Strategy:</p>
                    <p className="text-sm text-zinc-400">{s.strategy || s.suggestion}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className={`badge text-xs ${s.difficulty === "Easy" ? "badge-easy" : s.difficulty === "Medium" ? "badge-medium" : "badge-hard"}`}>{s.difficulty || "Medium"}</span>
                    <span className="badge badge-info text-xs">{s.snippet_type || "Paragraph"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
