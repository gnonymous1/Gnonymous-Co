"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Loader2, AlertCircle, BarChart3, TrendingUp, Users, Video, Clock } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface ChannelStat {
  subscribers?: string | number;
  total_videos?: string | number;
  avg_views?: string | number;
  upload_frequency?: string | number;
}

interface TopVideo {
  title?: string;
  views?: string | number;
  date?: string;
  engagement?: string;
  viral_blueprint?: {
    optimized_title: string;
    ranking_tagline: string;
    high_ranked_description: string;
    retention_hook: string;
    thumbnail_strategy: string;
    tags: string[];
  };
}

interface CompetitorSpyResult {
  channel_stats?: ChannelStat;
  top_videos?: TopVideo[];
  trending_topics?: string[];
  ai_analysis?: string;
}

export default function CompetitorSpyPage() {
  const { modelPreferences } = useGlobalStore();
  const [channelUrl, setChannelUrl] = useState("MrBeast");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = React.useState<CompetitorSpyResult | null>(null);

  const handleSpy = async () => {
    if (!channelUrl.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<CompetitorSpyResult>("/api/yt/competitor-spy", { method: "POST", body: JSON.stringify({ channel_url: channelUrl.trim(), model_pref: modelPreferences.youtube }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Analysis failed."); } finally { setLoading(false); }
  };

  React.useEffect(() => { handleSpy(); }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-1 flex items-center gap-2 italic">Strategic Competitor Intel <span className="text-[10px] bg-red-500/10 text-red-400 px-2 rounded-full border border-red-500/20">LIVE-SPY</span></h1>
          <p className="text-zinc-500 text-sm">Real-time breakdown of any YouTube channel's ranking secrets.</p>
        </div>
        <button onClick={handleSpy} disabled={loading} className="bg-gradient-to-br from-red-600 to-pink-600 px-8 py-3 rounded-2xl text-white font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-40 flex items-center gap-2 shadow-xl shadow-red-500/10">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Extracting...</> : <><Eye size={16} /> Re-Spy Intelligence</>}
        </button>
      </motion.div>

      <div className="glass-card p-4 rounded-3xl border-white/5 bg-zinc-900/50">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users size={12} className="text-red-400" /> Target Channel Identifier</label>
        <div className="flex gap-4">
          <input type="text" value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSpy()} placeholder="e.g., MrBeast or @MrBeast" className="glass-input flex-1 px-5 py-3 rounded-2xl text-sm border-white/5 focus:border-red-500/20 transition-all font-medium" />
        </div>
      </div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-24"><div className="loading-orb mb-6 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]" /><p className="text-zinc-400 text-sm font-medium animate-pulse">Decompiling channel architecture...</p></div>}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Channel Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Subscribers", value: result.channel_stats?.subscribers || "N/A", icon: <Users size={14} />, color: "text-red-400" },
              { label: "Total Videos", value: result.channel_stats?.total_videos || "N/A", icon: <Video size={14} />, color: "text-cyan-400" },
              { label: "Avg Views", value: result.channel_stats?.avg_views || "N/A", icon: <BarChart3 size={14} />, color: "text-emerald-400" },
              { label: "Upload Schedule", value: result.channel_stats?.upload_frequency || "N/A", icon: <Clock size={14} />, color: "text-amber-400" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-3xl border-white/5 bg-gradient-to-br from-white/2 to-transparent">
                <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{s.label}</span></div>
                <p className="text-xl font-black text-zinc-100">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Viral Assets Table */}
              <div className="glass-card rounded-3xl border-white/5 overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-red-500/10 to-transparent">
                  <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-2 italic uppercase"><TrendingUp size={14} className="text-red-400" /> Viral Blueprints (How to Outrank)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/80">
                        <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Original Content</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Optimized Assets (Rank #1)</th>
                        <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Engagement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {result.top_videos?.map((video, i) => (
                        <tr key={i} className="hover:bg-white/1 transition-all group">
                          <td className="px-5 py-5 max-w-[200px]">
                            <p className="text-[11px] font-bold text-zinc-400 mb-1 group-hover:text-zinc-200 transition-colors">{video.title}</p>
                            <p className="text-[10px] text-zinc-600">{video.views} Views • {video.date}</p>
                          </td>
                          <td className="px-5 py-5">
                            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 group-hover:border-red-500/20 transition-all space-y-3">
                               <p className="text-[11px] font-black text-red-100 italic leading-snug">&quot;{video.viral_blueprint?.optimized_title}&quot;</p>
                               
                               <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest shrink-0">Hook:</span>
                                     <span className="text-[10px] text-zinc-300 italic">{video.viral_blueprint?.retention_hook || "Analyzing retention..."}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest shrink-0">Thumb AI:</span>
                                     <span className="text-[9px] text-zinc-400 leading-tight">{video.viral_blueprint?.thumbnail_strategy}</span>
                                  </div>
                               </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                             <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-red-500/10 text-red-400 border border-red-500/20">{video.engagement}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Topic Heatmap */}
              <div className="glass-card p-6 rounded-3xl border-cyan-500/10">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-4 italic">Topic Heatmap</h3>
                <div className="flex flex-wrap gap-2">
                  {result.trending_topics?.map((topic, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/10 transition-colors cursor-default">
                      {topic.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategy Card */}
              <div className="glass-card p-6 rounded-3xl border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
                <h3 className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-4 italic">Dominance Strategy</h3>
                <div className="prose prose-invert prose-sm">
                  <FormattedContent content={result.ai_analysis || ""} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

