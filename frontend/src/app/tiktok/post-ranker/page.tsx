"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2, AlertCircle, TrendingUp, Hash, Eye } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface TopPost {
  caption?: string;
  title?: string;
  views?: string;
  engagement?: string;
  hashtags?: string;
  velocity?: string;
}

interface PostRankerResult {
  top_posts?: TopPost[];
  optimization_tips?: string[];
}

export default function PostRankerPage() {
  const { modelPreferences } = useGlobalStore();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PostRankerResult | null>(null);

  const handle = async () => {
    if (!keyword.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<PostRankerResult>("/api/tt/post-rank", { method: "POST", body: JSON.stringify({ keyword: keyword.trim(), model_pref: modelPreferences.tiktok }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to rank posts."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">TikTok Post Ranker</h1>
        <p className="text-zinc-500 text-sm">Check which videos are ranking on the For You Page (FYP) and get optimization suggestions.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1"><input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="Enter keyword or hashtag to check FYP rankings" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <button onClick={handle} disabled={loading} className="gradient-bg-cyan px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Ranking...</> : <><Trophy size={16} /> Check FYP</>}
          </button>
        </div>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Checking FYP rankings...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {result.top_posts && <div className="space-y-3">{result.top_posts.map((p, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 ${i < 3 ? "gradient-bg-cyan" : "bg-zinc-800"}`}>{i + 1}</div>
              <div className="flex-1">
                <p className="text-sm text-zinc-300 font-medium">{p.caption || p.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-zinc-500"><Eye size={10} /> {p.views || "N/A"}</span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500"><TrendingUp size={10} /> {p.engagement || "N/A"}</span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500"><Hash size={10} /> {p.hashtags || ""}</span>
                </div>
              </div>
              <span className={`badge text-xs ${p.velocity === "Rising" ? "badge-easy" : "badge-medium"}`}>{p.velocity || "Stable"}</span>
            </div>
          ))}</div>}
          {result.optimization_tips && <div className="glass-card p-5 rounded-2xl border border-cyan-500/20"><h3 className="font-semibold text-cyan-300 mb-2 text-sm">Optimization Tips</h3><ul className="space-y-1">{result.optimization_tips.map((t: string, i: number) => (<li key={i} className="text-sm text-zinc-400">• {t}</li>))}</ul></div>}
        </motion.div>
      )}
    </div>
  );
}
