"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Loader2, AlertCircle, Copy, Check, Eye, Globe, Zap, Settings2, Sparkles } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";

interface HumanizerResult {
  humanized_text?: string;
  ai_score?: string;
  readability?: string;
  uniqueness?: string;
  model_used?: string;
}

const tones = [
  { value: "professional", label: "Prof." },
  { value: "casual", label: "Casual" },
  { value: "conversational", label: "Conv." },
  { value: "persuasive", label: "Pers." },
];

const intensities = ["low", "medium", "high"];
const languages = ["English", "Spanish", "French", "German", "Japanese"];

export default function HumanizerPage() {
  const { modelPreferences } = useGlobalStore();
  const [content, setContent] = useState("AI content has revolutionized how we think about productivity. It allows for the rapid generation of text, images, and data analysis. However, there are concerns that AI-generated text can feel sterile and mechanical, lacking the nuanced emotional depth which is characteristic of human writing.");
  const [tone, setTone] = useState("professional");
  const [intensity, setIntensity] = useState("medium");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = React.useState<HumanizerResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleHumanize = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiCall<HumanizerResult>("/api/ai/humanize", {
        method: "POST",
        body: JSON.stringify({
          content: content.trim(),
          tone,
          intensity,
          language,
          model_pref: modelPreferences.ai_content,
          open_router_model: modelPreferences.openRouterModel,
        }),
      });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Humanization failed.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleHumanize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyResult = () => {
    if (result?.humanized_text) {
      navigator.clipboard.writeText(result.humanized_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Configuration & Input Panel */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div id="grid-overlay" className="absolute inset-0" />
        </div>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <PenTool size={12} className="text-emerald-500" />
                Content for Refinement
              </label>
              <span className="text-[10px] text-zinc-500 uppercase opacity-50">{content.length} characters</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your AI-generated content here..."
              rows={12}
              className="luxe-input w-full px-5 py-4 rounded-xl text-sm resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Right: Controls */}
          <div className="space-y-8 p-6 bg-surface-lowest/40 rounded-2xl border border-white/5 shadow-inner">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={12} className="text-amber-400" />
                Rewrite Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((t) => (
                  <button key={t.value} onClick={() => setTone(t.value)} className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tone === t.value ? "bg-emerald-500 text-white shadow-emerald-900/40" : "text-zinc-500 hover:text-white border border-white/5 bg-white/2"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Settings2 size={12} className="text-sky-400" />
                Rewrite Intensity
              </label>
              <div className="flex gap-1.5 p-1 bg-zinc-900/30 rounded-xl border border-white/5">
                {intensities.map((i) => (
                  <button key={i} onClick={() => setIntensity(i)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${intensity === i ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-200"}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe size={12} className="text-sky-500" />
                Output Language
              </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="luxe-input w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                {languages.map((l) => (<option key={l} value={l} className="bg-zinc-900 text-white">{l.toUpperCase()}</option>))}
              </select>
            </div>

            <button onClick={handleHumanize} disabled={loading || !content.trim()} className="btn btn-primary w-full h-12 text-xs font-bold tracking-[0.2em] uppercase shadow-emerald-900/40">
              {loading ? <><Loader2 size={18} className="animate-spin" /> PROCESSING...</> : <><Sparkles size={18} /> HUMANIZE CONTENT</>}
            </button>
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
          <p className="text-text-3 text-sm font-mono uppercase tracking-[0.2em] animate-pulse">Filtering Synthetic Noise...</p>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-xs font-black text-text-1 flex items-center gap-3 uppercase tracking-[0.2em] font-mono"><Sparkles size={18} className="text-brand-primary" /> Filtered Intelligence Matrix</h3>
             {(result as any).cached && (
               <div className="badge badge-live animate-pulse scale-90">
                  <Zap size={10} fill="currentColor" className="mr-1.5" /> CACHE ACCELERATED
               </div>
             )}
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "AI Detection Score", value: result.ai_score || "8%", color: "text-emerald-500", desc: "Estimated probability" },
              { label: "Readability Score", value: result.readability || "Grade 9", color: "text-sky-400", desc: "Target literacy level" },
              { label: "Uniqueness Score", value: result.uniqueness || "96%", color: "text-indigo-400", desc: "Originality vs Source" },
              { label: "Processing Model", value: result.model_used || "Flash", color: "text-amber-400", desc: "Neural pipeline" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="luxe-card p-5 border-white/5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-zinc-500 uppercase opacity-50 mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Comparison */}
            <div className="luxe-card p-6 border-white/5 relative bg-zinc-950/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Original AI Content</h3>
              </div>
              <div className="text-zinc-400 text-sm leading-relaxed max-h-[350px] overflow-y-auto pr-2 custom-scrollbar font-medium opacity-60">
                <FormattedContent content={content} />
              </div>
            </div>
            
            {/* Result Comparison */}
            <div className="luxe-card p-6 border-emerald-500/20 relative bg-zinc-950/60 shadow-2xl">
              <div className="absolute top-6 right-6">
                <button onClick={copyResult} className="btn btn-secondary scale-75 origin-top-right text-xs font-bold uppercase tracking-widest px-4 h-9">
                  {copied ? <><Check size={12} className="mr-2" /> COPIED</> : <><Copy size={12} className="mr-2" /> COPY RESULT</>}
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Humanized Content</h3>
              </div>
              <div className="text-white text-sm leading-relaxed max-h-[350px] overflow-y-auto pr-2 custom-scrollbar font-semibold">
                <FormattedContent content={result.humanized_text || "" as string} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
