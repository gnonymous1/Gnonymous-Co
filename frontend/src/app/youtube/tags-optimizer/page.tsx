"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tags, Loader2, AlertCircle, Copy, Check, Hash } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface TagsOptimizationResponse {
  optimized_titles?: string[];
  description?: string;
  tags?: string[];
  hashtags?: string[];
}

export default function TagsOptimizerPage() {
  const { modelPreferences } = useGlobalStore();
  const [videoTitle, setVideoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TagsOptimizationResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handle = async () => {
    if (!videoTitle.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<TagsOptimizationResponse>("/api/yt/optimize-tags", { method: "POST", body: JSON.stringify({ video_title: videoTitle.trim(), model_pref: modelPreferences.youtube }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to optimize tags."); } finally { setLoading(false); }
  };

  const copy = (t: string, id: string) => { navigator.clipboard.writeText(t); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Tags & Description Optimizer</h1>
        <p className="text-zinc-500 text-sm">Generate SEO-optimized titles, descriptions, tags, and hashtags for maximum discoverability.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1"><input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="Enter your video title or topic" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <button onClick={handle} disabled={loading} className="bg-gradient-to-br from-red-600 to-pink-600 px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Optimizing...</> : <><Tags size={16} /> Optimize</>}
          </button>
        </div>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Optimizing tags & description...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {result.optimized_titles && <div className="glass-card p-5 rounded-2xl"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-red-300 text-sm">Optimized Titles</h3><button onClick={() => copy(result.optimized_titles?.join("\n") || "", "titles")} className="text-zinc-500 hover:text-zinc-300">{copied === "titles" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button></div><div className="space-y-2">{result.optimized_titles.map((t: string, i: number) => (<p key={i} className="text-sm text-zinc-300 p-2 rounded-lg hover:bg-white/3">{t}</p>))}</div></div>}
          {result.description && <div className="glass-card p-5 rounded-2xl"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-cyan-300 text-sm">Optimized Description</h3><button onClick={() => copy(result.description || "", "desc")} className="text-zinc-500 hover:text-zinc-300">{copied === "desc" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button></div><FormattedContent content={result.description as string} /></div>}
          {result.tags && <div className="glass-card p-5 rounded-2xl"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-violet-300 text-sm">{result.tags.length} Tags</h3><button onClick={() => copy(result.tags?.join(", ") || "", "tags")} className="text-zinc-500 hover:text-zinc-300">{copied === "tags" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button></div><div className="flex flex-wrap gap-2">{result.tags.map((tag: string, i: number) => (<span key={i} className="px-3 py-1.5 rounded-lg glass text-sm text-zinc-300"><Hash size={10} className="inline mr-1" />{tag}</span>))}</div></div>}
          {result.hashtags && <div className="glass-card p-5 rounded-2xl"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-amber-300 text-sm">Hashtags</h3><button onClick={() => copy(result.hashtags?.join(" ") || "", "hash")} className="text-zinc-500 hover:text-zinc-300">{copied === "hash" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button></div><p className="text-sm text-amber-400">{result.hashtags?.join("  ")}</p></div>}
        </motion.div>
      )}
    </div>
  );
}
