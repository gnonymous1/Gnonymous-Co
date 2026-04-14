"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CirclePlay, Search, TrendingUp, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface RankResult {
  keyword: string;
  video_url: string;
  position: number | null;
  total_results: number;
  top_results: Array<{
    title?: string;
    link?: string;
    snippet?: string;
    channel?: string;
    views?: string;
  }>;
}

export default function RankCheckerPage() {
  const { modelPreferences } = useGlobalStore();
  const [keyword, setKeyword] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RankResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !videoUrl.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiCall<RankResult>("/api/yt/rank-check", {
        method: "POST",
        body: JSON.stringify({
          keyword: keyword.trim(),
          video_url: videoUrl.trim(),
          model_pref: modelPreferences.youtube,
        }),
      });
      setResult(data);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "detail" in err) {
        setError(String((err as { detail?: unknown }).detail || "Failed to check rank. Please try again."));
      } else if (err instanceof Error) {
        setError(err.message || "Failed to check rank. Please try again.");
      } else {
        setError("Failed to check rank. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const positionColor = (pos: number | null) => {
    if (!pos) return "text-zinc-400";
    if (pos <= 3) return "text-emerald-400";
    if (pos <= 10) return "text-cyan-400";
    if (pos <= 20) return "text-amber-400";
    return "text-zinc-400";
  };

  const getPositionBadge = (pos: number | null) => {
    if (!pos) return { bg: "bg-zinc-500/20", text: "Not Found in Top 50", color: "text-zinc-400" };
    if (pos === 1) return { bg: "bg-amber-500/20", text: `#1`, color: "text-amber-400" };
    if (pos === 2) return { bg: "bg-slate-400/20", text: `#2`, color: "text-slate-300" };
    if (pos === 3) return { bg: "bg-orange-500/20", text: `#3`, color: "text-orange-400" };
    return { bg: "bg-violet-500/20", text: `#${pos}`, color: "text-violet-400" };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <CirclePlay size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">YouTube Video Rank Checker</h1>
            <p className="text-zinc-500 text-sm">Check your video&apos;s position for specific keywords alongside competitor results.</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="luxe-card p-8"
      >
        <form onSubmit={handleCheck} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                <Search size={14} className="inline mr-1" /> Target Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., best AI tools 2026"
                className="luxe-input w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                <CirclePlay size={14} className="inline mr-1" /> Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="luxe-input w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !keyword.trim() || !videoUrl.trim()}
            className="btn btn-primary px-10 h-12 shadow-emerald-900/40"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
            {loading ? "CHECKING RANK..." : "ANALYZE POSITION"}
          </button>
        </form>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 rounded-xl border border-red-500/20 flex items-center gap-3"
        >
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Position Summary */}
          <div className="luxe-card p-8 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Ranking Context</p>
              <p className="text-xl font-bold text-white tracking-tight">&quot;{result.keyword}&quot;</p>
            </div>
            <div className="text-center px-8 py-6 rounded-2xl bg-zinc-900 border border-white/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Video Rank</p>
              <p className={`text-4xl font-bold tracking-tighter ${positionColor(result.position)}`}>
                {getPositionBadge(result.position).text}
              </p>
              {result.position && (
                <p className="text-[10px] text-zinc-500 font-medium mt-2 uppercase tracking-wider">Out of {result.total_results} results</p>
              )}
            </div>
            <div className="text-center px-8 py-6 rounded-2xl bg-zinc-900 border border-white/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Market Vol</p>
              <p className="text-2xl font-bold text-white tracking-tight">{result.total_results}</p>
            </div>
          </div>

          {/* Top Competing Videos */}
          {result.top_results && result.top_results.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Top {result.top_results.length} Competing Videos
              </h3>
              <div className="space-y-2">
                {result.top_results.map((video, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                      video.link?.includes(result.video_url) || result.video_url.includes(video.link || "")
                        ? "border-red-500/40 bg-red-500/5"
                        : "border-white/5 bg-white/3 hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? "bg-amber-500/20 text-amber-400" :
                      i === 1 ? "bg-slate-400/20 text-slate-300" :
                      i === 2 ? "bg-orange-500/20 text-orange-400" :
                      "bg-white/5 text-zinc-500"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 font-medium truncate">{video.title || "Untitled"}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{video.channel || video.link || ""}</p>
                      {video.snippet && (
                        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{video.snippet}</p>
                      )}
                    </div>
                    {video.link && (
                      <a
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {result.position && result.position > 10 && (
            <div className="glass-card p-5 rounded-2xl border border-violet-500/20">
              <p className="text-sm text-zinc-300 mb-2 font-medium">💡 Tips to Improve Your Rank</p>
              <ul className="text-xs text-zinc-500 space-y-1">
                <li>• Add your target keyword in the first 50 characters of your title</li>
                <li>• Include keywords naturally in your video description (first 2 lines are most important)</li>
                <li>• Use tags that include your main keyword and related variations</li>
                <li>• Encourage engagement (comments, likes) in your video</li>
                <li>• Consider updating your thumbnail with keyword-relevant imagery</li>
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
