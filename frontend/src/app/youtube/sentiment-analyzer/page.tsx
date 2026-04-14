"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Loader2, AlertCircle, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface SentimentAnalyzerResponse {
  positive?: string;
  neutral?: string;
  negative?: string;
  top_topics?: string[];
  content_requests?: string[];
  summary?: string;
}

export default function SentimentAnalyzerPage() {
  const { modelPreferences } = useGlobalStore();
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SentimentAnalyzerResponse | null>(null);

  const handle = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<SentimentAnalyzerResponse>("/api/yt/sentiment", { method: "POST", body: JSON.stringify({ video_url: videoUrl.trim(), model_pref: modelPreferences.youtube }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to analyze sentiment."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Target Acquisition */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1">
             <label className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 font-mono">
                <MessageCircle size={10} className="text-rose-500" /> Video Signal URL
             </label>
             <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="Paste YouTube video coordinate..." className="glass-input w-full px-4 py-3 rounded-xl text-sm font-medium" />
          </div>
          <div className="flex items-end">
            <button onClick={handle} disabled={loading} className="btn btn-primary bg-gradient-to-br from-rose-600 to-pink-600 border-none px-8 h-[46px] text-xs font-black tracking-widest uppercase hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] shadow-2xl transition-all">
              {loading ? <><Loader2 size={16} className="animate-spin" /> SCANNING...</> : <><MessageCircle size={16} /> ANALYZE FEED</>}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-400" /><span className="text-xs font-mono font-bold text-rose-300 uppercase">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center py-20">
          <div className="dot-live bg-rose-500 shadow-rose scale-150 mb-8" />
          <p className="text-text-3 text-sm font-mono uppercase tracking-[0.2em] animate-pulse">Extracting Audience Telemetry...</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Sentiment Triple Reactor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-2xl text-center border-white/5 bg-surface-lowest/40">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-3 shadow-brand-inner">
                  <ThumbsUp size={18} className="text-brand-primary" />
                </div>
                <p className="text-2xl font-black font-mono text-brand-primary tracking-tighter">{result.positive || "65%"}</p>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mt-1 font-mono">Positive Resonance</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center border-white/5 bg-surface-lowest/40">
                <div className="w-10 h-10 rounded-full bg-surface-lowest-2 flex items-center justify-center mx-auto mb-3 border border-white/10">
                  <MessageCircle size={18} className="text-text-4" />
                </div>
                <p className="text-2xl font-black font-mono text-text-2 tracking-tighter">{result.neutral || "25%"}</p>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mt-1 font-mono">Neutral Flux</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center border-white/5 bg-surface-lowest/40">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-3 shadow-rose-inner">
                  <ThumbsDown size={18} className="text-rose-500" />
                </div>
                <p className="text-2xl font-black font-mono text-rose-500 tracking-tighter">{result.negative || "10%"}</p>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-[0.2em] mt-1 font-mono">Adverse Signal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Semantic Topics */}
              {result.top_topics && (
                <div className="glass-card p-6 rounded-2xl border-white/5 bg-surface-lowest/40">
                  <h3 className="text-[10px] font-black text-cyan-400 mb-5 uppercase tracking-[0.2em] font-mono">Semantic Topic Clusters</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.top_topics.map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-surface-lowest border border-white/5 text-[11px] font-bold text-text-2 shadow-sm uppercase font-mono tracking-tight">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Intel */}
              {result.content_requests && (
                <div className="glass-card p-6 rounded-2xl border-white/5 bg-brand-accent/2">
                  <h3 className="text-[10px] font-black text-amber-400 mb-5 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
                    <Lightbulb size={14} className="text-amber-400" /> Audience Content Requests
                  </h3>
                  <ul className="space-y-3">
                    {result.content_requests.map((r: string, i: number) => (
                      <li key={i} className="text-xs text-text-3 flex items-start gap-3 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 shadow-amber" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Summary Block */}
            {result.summary && (
              <div className="glass-card p-8 rounded-2xl border-brand-secondary/20 bg-surface-lowest/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                   <MessageCircle size={80} />
                </div>
                <h3 className="text-[10px] font-black text-brand-secondary mb-4 uppercase tracking-[0.2em] font-mono">AI Neural Summary</h3>
                <p className="text-sm text-text-2 leading-relaxed font-medium relative z-10 max-w-4xl">
                  {result.summary}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
