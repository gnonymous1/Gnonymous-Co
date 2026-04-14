"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame } from "lucide-react";
import TrendInsightModal from "./TrendInsightModal";

export default function TrendingTicker() {
  const [trends, setTrends] = useState<string[]>([]);
  const [activeTrend, setActiveTrend] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/general/global-trends");
        const data = await res.json();
        if (data.trends) setTrends(data.trends);
      } catch (err) {
        setTrends(["AI Content Era", "Creator Economy", "Digital Transformation"]);
      }
    };
    fetchTrends();
  }, []);

  if (trends.length === 0) return null;

  return (
    <>
      <div className="h-9 bg-zinc-950 border-b border-white/5 flex items-center overflow-hidden cursor-default group">
        <div className="flex items-center gap-2 px-4 bg-zinc-900 h-full z-10 border-r border-white/10 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">Global Trends</span>
        </div>
        
        <div className="flex-1 relative overflow-hidden h-full flex items-center">
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 whitespace-nowrap px-4"
          >
            {[...trends, ...trends, ...trends, ...trends].map((trend, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTrend(trend)}
                className="flex items-center gap-2 group/item hover:bg-white/5 px-3 py-1 rounded-full transition-all"
              >
                <Flame size={12} className="text-amber-500 group-hover/item:animate-bounce" />
                <span className="text-xs text-zinc-400 group-hover/item:text-white transition-colors">{trend}</span>
              </button>
            ))}
          </motion.div>
        </div>
        
        <div className="px-4 text-[10px] text-zinc-600 font-mono hidden md:block border-l border-white/10 h-full flex items-center bg-zinc-900">
          LIVE | 2026.0.4.0.3
        </div>
      </div>

      <AnimatePresence>
        {activeTrend && (
          <TrendInsightModal 
            trend={activeTrend} 
            onClose={() => setActiveTrend(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

