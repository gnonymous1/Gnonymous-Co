"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2, AlertCircle, ThumbsUp, Palette, Type } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface ThumbnailSuggestion {
  concept?: string;
  title?: string;
  description?: string;
  colors?: string[];
  text_overlay?: string;
}

interface ThumbnailResponse {
  predicted_ctr?: string;
  emotion_score?: string;
  curiosity_score?: string;
  suggestions?: ThumbnailSuggestion[];
}

export default function ThumbnailPredictorPage() {
  const { modelPreferences } = useGlobalStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ThumbnailResponse | null>(null);

  const handle = async () => {
    if (!title.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<ThumbnailResponse>("/api/yt/thumbnail-predict", { method: "POST", body: JSON.stringify({ title: title.trim(), description: description.trim(), model_pref: modelPreferences.youtube }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to predict thumbnail."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Viral Thumbnail Predictor</h1>
        <p className="text-zinc-500 text-sm">AI predicts your thumbnail&apos;s CTR potential and suggests high-performing designs.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="space-y-4 mb-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Video Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., I Made $100K in 30 Days Using AI" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Video Description (optional)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief video description for context..." rows={3} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none" /></div>
        </div>
        <button onClick={handle} disabled={loading || !title.trim()} className="bg-gradient-to-br from-red-600 to-pink-600 px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Predicting...</> : <><ImageIcon size={16} /> Predict & Suggest</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Analyzing thumbnail strategies...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ l: "Predicted CTR", v: result.predicted_ctr || "8-12%", c: "text-emerald-400" }, { l: "Emotion Score", v: result.emotion_score || "High", c: "text-amber-400" }, { l: "Curiosity Gap", v: result.curiosity_score || "Strong", c: "text-violet-400" }].map((s, i) => (
              <div key={i} className="glass-card p-4 rounded-xl text-center"><p className="text-xs text-zinc-500">{s.l}</p><p className={`text-xl font-bold ${s.c}`}>{s.v}</p></div>
            ))}
          </div>
          {result.suggestions && <div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-red-300 mb-3 text-sm">Thumbnail Design Suggestions</h3><div className="space-y-3">{result.suggestions.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 hover:border-red-500/20 transition-colors">
              <h4 className="text-sm text-zinc-200 font-medium flex items-center gap-2">{i === 0 ? <ThumbsUp size={14} className="text-emerald-400" /> : i === 1 ? <Palette size={14} className="text-amber-400" /> : <Type size={14} className="text-violet-400" />} {s.concept || s.title}</h4>
              <p className="text-xs text-zinc-500 mt-1">{s.description}</p>
              {s.colors && <div className="flex gap-2 mt-2">{s.colors.map((c: string, ci: number) => <div key={ci} className="w-6 h-6 rounded-lg border border-white/10" style={{ backgroundColor: c }} title={c} />)}</div>}
              {s.text_overlay && <p className="text-xs text-cyan-400 mt-1">Text: &quot;{s.text_overlay}&quot;</p>}
            </div>
          ))}</div></div>}
        </motion.div>
      )}
    </div>
  );
}
