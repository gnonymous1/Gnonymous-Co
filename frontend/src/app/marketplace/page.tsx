"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Store, Search, Star, Download, Eye, Zap, TrendingUp, DollarSign,
  Plus, X, Heart, ChevronRight, Sparkles
} from "lucide-react";

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  preview: string;
  price: number;
  rating: number;
  sales: number;
  author: string;
  tags: string[];
  isFree: boolean;
  isOwned?: boolean;
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: "p1", title: "10x YouTube Hook Generator", category: "YouTube",
    description: "Generate 10 high-retention hooks for any video topic using proven psychological triggers.",
    preview: "Act as a viral YouTube hook expert. For the topic '[TOPIC]', generate 10 hooks that use...",
    price: 0, rating: 4.9, sales: 1240, author: "ContentOS", tags: ["youtube", "hooks", "viral"], isFree: true, isOwned: true,
  },
  {
    id: "p2", title: "SEO Article Dominator", category: "SEO",
    description: "Full 2,500-word SEO-optimized article with headings, LSI keywords, and meta included.",
    preview: "You are an expert SEO writer. Write a comprehensive 2,500-word article about '[KEYWORD]' that...",
    price: 9, rating: 4.8, sales: 876, author: "RankMaster", tags: ["seo", "writing", "blog"],  isFree: false,
  },
  {
    id: "p3", title: "TikTok Viral Script System", category: "TikTok",
    description: "3-part script system: hook, value loop, and CTA — fine-tuned for FYP performance.",
    preview: "You are a TikTok content strategist with 10M+ views. Create a viral short-form script for...",
    price: 15, rating: 4.7, sales: 534, author: "TokElite", tags: ["tiktok", "viral", "script"], isFree: false,
  },
  {
    id: "p4", title: "Affiliate Review Prompt Bundle", category: "Monetize",
    description: "Write high-converting affiliate product reviews that rank and drive clicks.",
    preview: "Act as a professional product reviewer and affiliate marketer. Review '[PRODUCT]' to drive...",
    price: 19, rating: 4.9, sales: 423, author: "MoneyPen", tags: ["affiliate", "review", "monetize"], isFree: false,
  },
  {
    id: "p5", title: "Twitter Thread Viral Engine", category: "Social",
    description: "Craft viral Twitter/X threads with the proven 1-3-5-7 engagement structure.",
    preview: "You are a Twitter/X growth expert. Create a viral thread about '[TOPIC]' using the hook...",
    price: 0, rating: 4.6, sales: 2100, author: "ContentOS", tags: ["twitter", "viral", "social"], isFree: true, isOwned: true,
  },
  {
    id: "p6", title: "Niche Authority Cluster Builder", category: "SEO",
    description: "Build a complete topical authority cluster with pillar + 10 supporting article briefs.",
    preview: "You are an SEO strategist. For the niche '[NICHE]', build a topical authority cluster with...",
    price: 29, rating: 4.9, sales: 312, author: "ClusterKing", tags: ["seo", "authority", "cluster"], isFree: false,
  },
];

const CATEGORIES = ["All", "YouTube", "SEO", "TikTok", "Social", "Monetize"];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [owned, setOwned] = useState<string[]>(["p1", "p5"]);
  const [preview, setPreview] = useState<PromptTemplate | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  const filtered = TEMPLATES.filter(t =>
    (cat === "All" || t.category === cat) &&
    (query === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.tags.some(tg => tg.includes(query.toLowerCase())))
  );

  const purchase = (id: string) => setOwned(prev => [...prev, id]);
  const toggleLike = (id: string) => setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const totalSales = TEMPLATES.reduce((sum, t) => sum + t.sales, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Store size={20} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">Prompt Marketplace</h1>
            <p className="text-zinc-500 text-sm">Buy, sell, and share premium AI prompt templates</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl text-orange-300 font-bold text-sm flex items-center gap-2">
          <Plus size={16} /> Sell Your Prompt
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label: "Templates", value: TEMPLATES.length, icon: <Sparkles size={16} />, color: "text-orange-400" },
          { label: "Total Downloads", value: totalSales.toLocaleString(), icon: <Download size={16} />, color: "text-violet-400" },
          { label: "You Own", value: owned.length, icon: <Zap size={16} />, color: "text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <span className={s.color}>{s.icon}</span>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search prompts…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${cat === c ? "bg-orange-500/20 text-orange-300" : "bg-white/5 text-zinc-500 hover:bg-white/10"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-zinc-500 uppercase border border-white/10">{t.category}</span>
                <div className="flex items-center gap-2">
                  {t.isFree && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold uppercase">Free</span>}
                  {owned.includes(t.id) && <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-[10px] font-bold uppercase">Owned</span>}
                </div>
              </div>
              <h3 className="font-black text-zinc-100 mb-1">{t.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">{t.description}</p>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                <p className="text-[10px] text-zinc-600 font-mono line-clamp-2">{t.preview}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {t.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] text-zinc-600">#{tag}</span>
                ))}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{t.rating}</span>
                <span className="flex items-center gap-1"><Download size={11} />{t.sales}</span>
                <button onClick={() => toggleLike(t.id)}>
                  <Heart size={11} className={liked.includes(t.id) ? "text-rose-400 fill-rose-400" : "text-zinc-600"} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreview(t)} className="p-1.5 text-zinc-500 hover:text-zinc-300"><Eye size={14} /></button>
                {owned.includes(t.id) ? (
                  <button className="px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Download size={12} /> Use
                  </button>
                ) : (
                  <button onClick={() => purchase(t.id)}
                    className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg text-xs font-bold flex items-center gap-1">
                    <DollarSign size={12} />{t.price === 0 ? "Free" : `$${t.price}`}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
            className="bg-zinc-900 border border-orange-500/30 rounded-3xl p-8 max-w-xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs text-orange-400 font-bold uppercase">{preview.category}</span>
                <h2 className="text-xl font-black text-white mt-1">{preview.title}</h2>
                <p className="text-zinc-500 text-sm mt-1">by {preview.author}</p>
              </div>
              <button onClick={() => setPreview(null)} className="p-2 hover:bg-white/10 rounded-xl">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>
            <div className="p-4 bg-black/60 rounded-xl border border-white/10 mb-6 font-mono">
              <p className="text-sm text-zinc-300 leading-relaxed">{preview.preview}</p>
              <p className="text-zinc-600 mt-2">[Full prompt: ~500 words with variables, examples, and output format]</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPreview(null)} className="flex-1 py-3 bg-white/5 rounded-xl text-zinc-400 font-bold">Close</button>
              {!owned.includes(preview.id) && (
                <button onClick={() => { purchase(preview.id); setPreview(null); }}
                  className="flex-1 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl text-orange-300 font-bold flex items-center justify-center gap-2">
                  <DollarSign size={16} />{preview.price === 0 ? "Get Free" : `Buy $${preview.price}`}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
