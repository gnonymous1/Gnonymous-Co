"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Network, Loader2, AlertCircle, ArrowRight, Link2 } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type InternalLinkSuggestion = {
  source?: string;
  target?: string;
  from_page?: string;
  to_page?: string;
  anchor_text?: string;
  reason?: string;
  impact?: "High" | "Medium" | string;
  relevance?: string;
};

type InternalLinkResponse = {
  suggestions?: InternalLinkSuggestion[];
};

export default function InternalLinkingPage() {
  const { modelPreferences } = useGlobalStore();
  const [sitemapUrl, setSitemap] = useState("");
  const [targetPage, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InternalLinkResponse | null>(null);

  const handle = async () => {
    if (!sitemapUrl.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<InternalLinkResponse>("/api/seo/internal-links", { method: "POST", body: JSON.stringify({ sitemap_url: sitemapUrl.trim(), target_page: targetPage.trim(), model_pref: modelPreferences.seo }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to analyze links"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Internal Linking Architect</h1>
        <p className="text-zinc-500 text-sm">AI suggests which pages to interlink for maximum topical authority and rank boost.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Sitemap URL or Domain</label><input type="text" value={sitemapUrl} onChange={(e) => setSitemap(e.target.value)} placeholder="https://yoursite.com/sitemap.xml" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Target Page (optional)</label><input type="text" value={targetPage} onChange={(e) => setTarget(e.target.value)} placeholder="https://yoursite.com/target-post" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
        </div>
        <button onClick={handle} disabled={loading} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Network size={16} /> Analyze Links</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Analyzing internal link structure...</p></div>}
      {result?.suggestions && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Link Suggestions ({result.suggestions.length})</h2>
          {result.suggestions.map((s, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Link2 size={16} className="text-violet-400" />
                <span className="text-sm text-zinc-300 font-medium">{s.from_page || s.source}</span>
                <ArrowRight size={14} className="text-zinc-600" />
                <span className="text-sm text-cyan-400 font-medium">{s.to_page || s.target}</span>
              </div>
              <p className="text-xs text-zinc-500 ml-7">{s.anchor_text && <>Anchor: &quot;<span className="text-amber-400">{s.anchor_text}</span>&quot; — </>}{s.reason}</p>
              <div className="flex gap-2 mt-2 ml-7">
                <span className={`badge text-xs ${s.impact === "High" ? "badge-easy" : "badge-medium"}`}>{s.impact || "Medium"} Impact</span>
                <span className="badge badge-info text-xs">{s.relevance || "Topical"}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
