"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Loader2, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface RankRow {
  keyword: string;
  position: number | null;
  change: number;
  top_competitor: string;
}

interface RankTrackerResult {
  rankings?: RankRow[];
}

export default function RankTrackerPage() {
  const { modelPreferences } = useGlobalStore();
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RankTrackerResult | null>(null);

  const handle = async () => {
    if (!domain.trim() || !keywords.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await apiCall<RankTrackerResult>("/api/seo/track-rank", {
        method: "POST",
        body: JSON.stringify({
          domain: domain.trim(),
          keywords: keywords.split("\n").filter(Boolean),
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
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Live Page Rank Tracker</h1>
        <p className="text-zinc-500 text-sm">Track your website position for specific keywords with real-time ranking data.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Domain</label><input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="yoursite.com" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div><label className="text-xs font-medium text-zinc-400 mb-2 block">Keywords (one per line)</label><textarea value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={"best AI tools\nSEO software\ncontent marketing"} rows={3} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none" /></div>
        </div>
        <button onClick={handle} disabled={loading} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Tracking...</> : <><LineChart size={16} /> Check Rankings</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Checking rankings...</p></div>}
      {result?.rankings && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="data-table"><thead><tr><th>Keyword</th><th>Position</th><th>Change</th><th>Top Competitor</th></tr></thead>
              <tbody>{result.rankings.map((r: RankRow, i: number) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="text-zinc-300 font-medium">{r.keyword}</td>
                  <td><span className={`text-lg font-bold ${r.position != null && r.position <= 3 ? "text-emerald-400" : r.position != null && r.position <= 10 ? "text-amber-400" : "text-rose-400"}`}>{r.position || "50+"}</span></td>
                  <td>{r.change > 0 ? <span className="text-emerald-400 flex items-center gap-1"><TrendingUp size={14} />+{r.change}</span> : r.change < 0 ? <span className="text-rose-400 flex items-center gap-1"><TrendingDown size={14} />{r.change}</span> : <span className="text-zinc-500 flex items-center gap-1"><Minus size={14} />0</span>}</td>
                  <td className="text-xs text-zinc-500">{r.top_competitor || "N/A"}</td>
                </motion.tr>
              ))}</tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
