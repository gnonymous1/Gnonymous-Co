"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface LinkGap {
  domain?: string;
  da?: string | number;
  type?: string;
  url?: string;
}

interface BacklinkAuditResult {
  your_backlinks?: string | number;
  link_gaps?: LinkGap[];
  easy_wins?: Array<Record<string, unknown>>;
  recommendation?: string;
}

export default function BacklinkAuditorPage() {
  const { modelPreferences } = useGlobalStore();
  const [targetUrl, setTargetUrl] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BacklinkAuditResult | null>(null);

  const handle = async () => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await apiCall<BacklinkAuditResult>("/api/seo/backlink-audit", {
        method: "POST",
        body: JSON.stringify({
          target_url: targetUrl.trim(),
          competitors: competitors.split("\n").filter(Boolean),
          model_pref: modelPreferences.seo,
        }),
      });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Backlink Auditor</h1>
        <p className="text-zinc-500 text-sm">Scan competitor backlink profiles and find link gaps to exploit for ranking advantage.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Your Website URL</label><input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://yoursite.com" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Competitor URLs (one per line)</label><textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder={"https://competitor1.com\nhttps://competitor2.com"} rows={3} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none" /></div>
        </div>
        <button onClick={handle} disabled={loading || !targetUrl.trim()} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Auditing...</> : <><Link2 size={16} /> Audit Backlinks</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Scanning backlink profiles...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ l: "Your Backlinks", v: result.your_backlinks || "N/A", c: "text-violet-400" }, { l: "Link Gaps Found", v: result.link_gaps?.length || 0, c: "text-amber-400" }, { l: "Easy Wins", v: result.easy_wins?.length || 0, c: "text-emerald-400" }].map((s, i) => (
              <div key={i} className="glass-card p-4 rounded-xl text-center"><p className="text-xs text-zinc-500">{s.l}</p><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p></div>
            ))}
          </div>
          {result.link_gaps && <div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-amber-300 mb-3 text-sm">Link Gap Opportunities</h3><div className="space-y-2">{result.link_gaps.map((g: LinkGap, i: number) => (<div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3"><div><p className="text-sm text-zinc-300">{g.domain || g.url || "Unknown link"}</p><p className="text-xs text-zinc-500">{g.da ? `DA: ${g.da}` : ""} {g.type || ""}</p></div><a href={g.url || "#"} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300"><ExternalLink size={14} /></a></div>))}</div></div>}
          {result.recommendation && <div className="glass-card p-5 rounded-2xl border border-violet-500/20"><h3 className="font-semibold text-violet-300 mb-2 text-sm">AI Strategy</h3><p className="text-sm text-zinc-400 leading-relaxed">{result.recommendation}</p></div>}
        </motion.div>
      )}
    </div>
  );
}
