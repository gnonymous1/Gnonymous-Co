"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Archive, Search, Clock, Download, Trash2, RotateCw } from "lucide-react";

interface HistoryItem { id: number; tool: string; query: string; timestamp: string; model: string; category: string; }

const mockHistory: HistoryItem[] = [
  { id: 1, tool: "SERP Analyzer", query: "best AI writing tools", timestamp: "2 min ago", model: "gemini", category: "SEO" },
  { id: 2, tool: "Hook Generator", query: "how to make money online", timestamp: "15 min ago", model: "openrouter", category: "TikTok" },
  { id: 3, tool: "Humanizer", query: "AI-generated article rewrite", timestamp: "1 hr ago", model: "gemini", category: "AI Hub" },
  { id: 4, tool: "Keyword Lab", query: "SaaS marketing keywords", timestamp: "2 hrs ago", model: "gemini", category: "SEO" },
  { id: 5, tool: "Competitor Spy", query: "@MrBeast channel", timestamp: "3 hrs ago", model: "openrouter", category: "YouTube" },
];

const catColors: Record<string, string> = { SEO: "badge-info", TikTok: "badge-medium", "AI Hub": "badge-easy", YouTube: "badge-hard" };

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [history, setHistory] = useState(mockHistory);

  const filtered = history.filter((h) => (filter === "all" || h.category === filter) && (search === "" || h.query.toLowerCase().includes(search.toLowerCase()) || h.tool.toLowerCase().includes(search.toLowerCase())));

  const clearAll = () => setHistory([]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Project Archive</h1>
        <p className="text-zinc-500 text-sm">Full history of all tool runs — search, filter, re-run, and export past analyses.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 rounded-2xl flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search history..." className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" /></div>
        <div className="flex gap-2">
          {["all", "SEO", "YouTube", "TikTok", "AI Hub"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "gradient-bg text-white" : "text-zinc-500 border border-white/8 hover:text-zinc-300"}`}>{f}</button>
          ))}
          <button onClick={clearAll} className="px-3 py-2 rounded-lg text-xs text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-colors flex items-center gap-1"><Trash2 size={12} /> Clear</button>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-16"><Archive size={40} className="mx-auto text-zinc-700 mb-3" /><p className="text-zinc-500 text-sm">No history found.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 rounded-xl flex items-center gap-4 group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-zinc-200 font-medium">{item.tool}</span>
                  <span className={`badge text-[10px] ${catColors[item.category] || "badge-info"}`}>{item.category}</span>
                </div>
                <p className="text-xs text-zinc-500">&quot;{item.query}&quot;</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-600 flex items-center gap-1"><Clock size={10} /> {item.timestamp}</p>
                <p className="text-[10px] text-zinc-700 capitalize">{item.model}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-300" title="Re-run"><RotateCw size={12} /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-zinc-300" title="Download"><Download size={12} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
