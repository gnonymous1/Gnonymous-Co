"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertCircle, Copy, Check, Clock } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface ScriptItem {
  hook?: string;
  script?: string;
  text?: string;
  duration?: string;
  word_count?: string | number;
}

export default function ScriptConverterPage() {
  const { modelPreferences } = useGlobalStore();
  const [longContent, setLongContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!longContent.trim()) return;
    setLoading(true); setError(""); setScripts([]);
    try {
      const data = await apiCall<{ scripts?: ScriptItem[] }>("/api/tt/convert-script", {
        method: "POST",
        body: JSON.stringify({ long_content: longContent.trim(), platform: "tiktok", model_pref: modelPreferences.tiktok }),
      });
      setScripts(data.scripts || []);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to convert script."); } finally { setLoading(false); }
  };

  const copyText = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Script-to-Shorts Converter</h1>
        <p className="text-zinc-500 text-sm">Convert long blogs or video scripts into 5 × 60-second short-form scripts.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <label className="text-xs font-medium text-zinc-400 mb-2 flex items-center justify-between">
          <span>Paste Long Content (Blog, Script, Article)</span>
          <span className="text-zinc-600">{longContent.length} chars</span>
        </label>
        <textarea value={longContent} onChange={(e) => setLongContent(e.target.value)} placeholder="Paste your long-form content here..." rows={8} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none mb-4" />
        <button onClick={handleConvert} disabled={loading || !longContent.trim()} className="gradient-bg-cyan px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Converting...</> : <><FileText size={16} /> Convert to 5 Shorts</>}
        </button>
      </motion.div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Converting to short-form scripts...</p></div>}

      {scripts.length > 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {scripts.map((script, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold gradient-text">Short #{i + 1}</span>
                  <span className="badge badge-info text-xs flex items-center gap-1"><Clock size={10} /> ~{script.duration || "60s"}</span>
                  <span className="text-xs text-zinc-600">{script.word_count || "~150"} words</span>
                </div>
                <button onClick={() => copyText(script.script || script.text || "", `s-${i}`)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all">
                  {copied === `s-${i}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              {script.hook && <p className="text-xs text-amber-400 mb-2 font-medium">Hook: &quot;{script.hook}&quot;</p>}
              <FormattedContent content={script.script || script.text || "" as string} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
