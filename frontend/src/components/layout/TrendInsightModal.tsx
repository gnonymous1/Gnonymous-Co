"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, DollarSign, Target, Hash, FileText, Loader2 } from "lucide-react";

interface TrendIntel {
  monetization?: string;
  rank_difficulty?: number;
  keywords?: string[];
  tags?: string[];
  description?: string;
  format?: string;
}

export default function TrendInsightModal({ trend, onClose }: { trend: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TrendIntel | null>(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/general/trend-intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trend, model_pref: "gemini" }),
        });
        const d = await res.json();
        setData(d);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, [trend]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-50"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{trend}</h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Global Trend Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-violet-500" size={32} />
              <p className="text-sm text-zinc-500">Decrypting market trends and viral patterns...</p>
            </div>
          ) : data ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Analytics Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2 text-violet-400">
                    <Target size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Rank Difficulty</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-zinc-100">{data.rank_difficulty}/100</span>
                    <span className="text-xs text-zinc-500 mb-1">Competitive</span>
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <FileText size={14} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Top Format</span>
                  </div>
                  <div className="text-lg font-bold text-zinc-100 leading-tight">
                    {data.format}
                  </div>
                </div>
              </div>

              {/* Monetization */}
              <div className="glass-card p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  Monetization Blueprint
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {data.monetization}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-cyan-400" />
                  Strategic Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs rounded-xl">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
                  <Hash size={16} className="text-violet-400" />
                  Viral Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs rounded-xl">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-5 rounded-2xl bg-zinc-900/50">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Optimized Content Hook
                </h3>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  "{data.description}"
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-zinc-500">Failed to analyze trend data.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Close Analyst
          </button>
        </div>
      </motion.div>
    </div>
  );
}
