"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, AlertCircle, Copy, Check, FileText, DollarSign } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface EbookChapter {
  title?: string;
  summary?: string;
  key_points?: string[];
  content?: string;
}

interface EbookResult {
  title?: string;
  subtitle?: string;
  price_suggestion?: string;
  chapters_list?: EbookChapter[];
  sales_page_copy?: string;
}

export default function EbookBuilderPage() {
  const { modelPreferences } = useGlobalStore();
  const [topic, setTopic] = useState("");
  const [chapters, setChapters] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EbookResult | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<EbookResult>("/api/ai/ebook-outline", { method: "POST", body: JSON.stringify({ topic: topic.trim(), chapters, model_pref: modelPreferences.ai_content }) });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to build eBook outline.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">eBook & Digital Product Builder</h1>
        <p className="text-zinc-500 text-sm">Generate chapter-wise outlines, content, and sales page copy for digital products.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1"><label className="text-xs font-medium text-zinc-400 mb-2 block">eBook Topic</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. The Ultimate Guide to AI Content Marketing" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div className="w-32"><label className="text-xs font-medium text-zinc-400 mb-2 block">Chapters</label><select value={chapters} onChange={(e) => setChapters(Number(e.target.value))} className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none">{[5, 7, 10, 12, 15].map((n) => <option key={n} value={n} className="bg-zinc-900">{n}</option>)}</select></div>
        </div>
        <button onClick={handle} disabled={loading || !topic.trim()} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Building...</> : <><BookOpen size={16} /> Build eBook Outline</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Building eBook outline...</p></div>}
      {result?.chapters_list && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {result.title && <div className="glass-card p-5 rounded-2xl"><h2 className="text-lg font-bold gradient-text">{result.title}</h2><p className="text-sm text-zinc-400 mt-1">{result.subtitle || ""}</p>{result.price_suggestion && <span className="badge badge-easy text-xs mt-2 inline-flex items-center gap-1"><DollarSign size={10} />{result.price_suggestion}</span>}</div>}
          <div className="flex gap-2 overflow-x-auto pb-2">{result.chapters_list.map((_, i: number) => (
            <button key={i} onClick={() => setActiveChapter(i)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeChapter === i ? "gradient-bg text-white" : "text-zinc-500 border border-white/8 hover:text-zinc-300"}`}>Ch. {i + 1}</button>
          ))}</div>
          {result.chapters_list[activeChapter] && (
            <motion.div key={activeChapter} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between mb-3"><h3 className="text-zinc-200 font-semibold">{result.chapters_list?.[activeChapter]?.title}</h3><button onClick={() => { navigator.clipboard.writeText(result.chapters_list?.[activeChapter]?.content || ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-zinc-500 hover:text-zinc-300">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button></div>
              <p className="text-sm text-zinc-400 mb-3">{result.chapters_list?.[activeChapter]?.summary}</p>
              {result.chapters_list?.[activeChapter]?.key_points && <ul className="space-y-1 mb-3">{result.chapters_list?.[activeChapter]?.key_points.map((p: string, i: number) => (<li key={i} className="text-sm text-zinc-500 flex items-start gap-2"><FileText size={12} className="text-violet-400 mt-1 flex-shrink-0" />{p}</li>))}</ul>}
              {result.chapters_list?.[activeChapter]?.content && <div className="p-3 rounded-xl bg-white/2 border border-white/5 mt-3"><FormattedContent content={result.chapters_list?.[activeChapter]?.content as string} /></div>}
            </motion.div>
          )}
          {result.sales_page_copy && <div className="glass-card p-5 rounded-2xl border border-emerald-500/20"><h3 className="font-semibold text-emerald-300 mb-2 text-sm">Sales Page Copy</h3><FormattedContent content={result.sales_page_copy as string} /></div>}
        </motion.div>
      )}
    </div>
  );
}
