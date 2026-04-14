"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, AlertCircle, TrendingUp, Clock, Eye, Heart } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface TopPerformingItem {
  theme?: string;
  performance?: string;
}

interface EngagementAnalyticsResult {
  avg_views?: string;
  avg_likes?: string;
  engagement_rate?: string;
  best_time?: string;
  top_performing?: TopPerformingItem[];
  recommendations?: string[];
}

export default function EngagementAnalyticsPage() {
  const { modelPreferences } = useGlobalStore();
  const [profileUrl, setProfileUrl] = useState("@khaby.lame");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = React.useState<EngagementAnalyticsResult | null>(null);

  const handle = async () => {
    if (!profileUrl.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<EngagementAnalyticsResult>("/api/tt/engagement", { method: "POST", body: JSON.stringify({ profile_url: profileUrl.trim(), model_pref: modelPreferences.tiktok }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to analyze engagement."); } finally { setLoading(false); }
  };

  React.useEffect(() => {
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Engagement Analytics</h1>
        <p className="text-zinc-500 text-sm">Deep analysis of reach, shares, watch-time, and engagement patterns for TikTok posts.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1"><input type="text" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="TikTok profile URL or username (e.g., @username)" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <button onClick={handle} disabled={loading} className="gradient-bg-cyan px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><BarChart3 size={16} /> Analyze</>}
          </button>
        </div>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Analyzing engagement metrics...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ l: "Avg Views", v: result.avg_views || "N/A", icon: <Eye size={16} />, c: "text-cyan-400" }, { l: "Avg Likes", v: result.avg_likes || "N/A", icon: <Heart size={16} />, c: "text-rose-400" }, { l: "Engagement Rate", v: result.engagement_rate || "N/A", icon: <TrendingUp size={16} />, c: "text-emerald-400" }, { l: "Best Time", v: result.best_time || "N/A", icon: <Clock size={16} />, c: "text-amber-400" }].map((s, i) => (
              <div key={i} className="glass-card p-4 rounded-xl"><div className={`flex items-center gap-2 mb-1 ${s.c}`}>{s.icon}<span className="text-xs text-zinc-500">{s.l}</span></div><p className="text-xl font-bold text-zinc-200">{s.v}</p></div>
            ))}
          </div>
          {result.top_performing && <div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-cyan-300 mb-3 text-sm">Top Performing Content Themes</h3><div className="space-y-2">{result.top_performing.map((t, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3"><span className="text-sm text-zinc-300">{t.theme || "Untitled theme"}</span><span className="badge badge-easy text-xs">{t.performance || "High"}</span></div>))}</div></div>}
          {result.recommendations && <div className="glass-card p-5 rounded-2xl border border-violet-500/20"><h3 className="font-semibold text-violet-300 mb-2 text-sm">Growth Recommendations</h3><ul className="space-y-1">{result.recommendations.map((r: string, i: number) => (<li key={i} className="text-sm text-zinc-400">• {r}</li>))}</ul></div>}
        </motion.div>
      )}
    </div>
  );
}
