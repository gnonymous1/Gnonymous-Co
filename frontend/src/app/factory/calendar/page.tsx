"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, PlayCircle, Hash, FileText,
  AtSign, MessageSquare, Briefcase, Trash2, Edit3, Zap
} from "lucide-react";

type Platform = "youtube" | "tiktok" | "twitter" | "linkedin" | "blog";
type ContentStatus = "draft" | "scheduled" | "published";

interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  day: number;
  type: string;
}

const PLATFORM_CONFIG: Record<Platform, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  youtube: { icon: <PlayCircle size={12} />, color: "text-rose-400", bg: "bg-rose-500/20", label: "YouTube" },
  tiktok: { icon: <Hash size={12} />, color: "text-cyan-400", bg: "bg-cyan-500/20", label: "TikTok" },
  twitter: { icon: <AtSign size={12} />, color: "text-blue-400", bg: "bg-blue-500/20", label: "Twitter/X" },
  linkedin: { icon: <Briefcase size={12} />, color: "text-sky-400", bg: "bg-sky-500/20", label: "LinkedIn" },
  blog: { icon: <FileText size={12} />, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Blog" },
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: "text-zinc-400 bg-zinc-500/20",
  scheduled: "text-amber-400 bg-amber-500/20",
  published: "text-emerald-400 bg-emerald-500/20",
};

const INITIAL_CONTENT: ContentItem[] = [
  { id: "1", title: "The 5 AI Tools That Print Money", platform: "youtube", status: "published", day: 1, type: "Tutorial" },
  { id: "2", title: "AI vs Human Writer 🤯", platform: "tiktok", status: "published", day: 2, type: "Short" },
  { id: "3", title: "10 ChatGPT prompts for creators", platform: "twitter", status: "scheduled", day: 3, type: "Thread" },
  { id: "4", title: "How I Automate My Entire Content Stack", platform: "linkedin", status: "scheduled", day: 5, type: "Article" },
  { id: "5", title: "Ultimate SEO Guide for 2026", platform: "blog", status: "draft", day: 7, type: "Long-form" },
  { id: "6", title: "YouTube Algorithm Exposed", platform: "youtube", status: "scheduled", day: 8, type: "Tutorial" },
  { id: "7", title: "TikTok Shop vs YouTube Shopping", platform: "tiktok", status: "draft", day: 10, type: "Comparison" },
  { id: "8", title: "My 90-Day Monetization Results", platform: "youtube", status: "draft", day: 14, type: "Vlog" },
  { id: "9", title: "Build an Audience With $0", platform: "twitter", status: "draft", day: 16, type: "Thread" },
  { id: "10", title: "Affiliate Marketing Deep Dive", platform: "blog", status: "draft", day: 21, type: "Long-form" },
];

const DAYS_IN_VIEW = 30;

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [showAdd, setShowAdd] = useState(false);
  const [month] = useState("April 2026");
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<Platform>("youtube");
  const [newDay, setNewDay] = useState(1);

  const addItem = () => {
    if (!newTitle.trim()) return;
    setItems(prev => [...prev, {
      id: Date.now().toString(), title: newTitle, platform: newPlatform,
      status: "draft", day: newDay, type: "Content"
    }]);
    setNewTitle(""); setShowAdd(false);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const weeks = [1, 2, 3, 4].map(w => ({
    label: `Week ${w}`,
    days: Array.from({ length: 7 }, (_, d) => ({ day: (w - 1) * 7 + d + 1, items: items.filter(i => i.day === (w - 1) * 7 + d + 1) }))
  }));

  const stats = {
    total: items.length,
    published: items.filter(i => i.status === "published").length,
    scheduled: items.filter(i => i.status === "scheduled").length,
    draft: items.filter(i => i.status === "draft").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
            <CalendarDays size={20} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">Content Calendar</h1>
            <p className="text-zinc-500 text-sm">30-day omnichannel content plan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={16} className="text-zinc-500" />
            <span className="text-sm text-zinc-300 font-bold">{month}</span>
            <ChevronRight size={16} className="text-zinc-500" />
          </div>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-pink-300 font-bold text-sm flex items-center gap-2">
            <Plus size={16} /> Add Content
          </button>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-4 flex-wrap">
        {[
          { label: "Total Pieces", value: stats.total, color: "text-zinc-300" },
          { label: "Published", value: stats.published, color: "text-emerald-400" },
          { label: "Scheduled", value: stats.scheduled, color: "text-amber-400" },
          { label: "Draft", value: stats.draft, color: "text-zinc-500" },
        ].map((s, i) => (
          <div key={i} className="glass-card px-5 py-3 rounded-xl flex items-center gap-2">
            <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </div>
        ))}
        <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-2 ml-auto">
          <Zap size={14} className="text-violet-400" />
          <span className="text-xs text-zinc-400">Freq: <strong className="text-zinc-200">~{(stats.total / 4).toFixed(1)}/wk</strong></span>
        </div>
      </motion.div>

      {/* Add form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 rounded-2xl border border-pink-500/20">
          <div className="flex gap-3 flex-wrap">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Content title"
              className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-pink-500 text-sm" />
            <select value={newPlatform} onChange={e => setNewPlatform(e.target.value as Platform)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-zinc-200 focus:outline-none text-sm">
              {(Object.keys(PLATFORM_CONFIG) as Platform[]).map(p => <option key={p} value={p} className="bg-zinc-900">{PLATFORM_CONFIG[p].label}</option>)}
            </select>
            <input type="number" value={newDay} onChange={e => setNewDay(Number(e.target.value))} min={1} max={30} placeholder="Day"
              className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-zinc-200 focus:outline-none text-sm" />
            <button onClick={addItem} className="px-5 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 rounded-xl text-pink-300 font-bold text-sm">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Calendar grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-4">
        {weeks.map((week, wi) => (
          <div key={wi} className="glass-card rounded-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-white/5 bg-white/3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{week.label}</span>
            </div>
            <div className="grid grid-cols-7 divide-x divide-white/5">
              {week.days.map(({ day, items: dayItems }) => (
                <div key={day} className={`p-2 min-h-[90px] ${dayItems.length > 0 ? "" : "opacity-40"}`}>
                  <p className="text-[10px] text-zinc-600 font-bold mb-1.5">Apr {day}</p>
                  <div className="space-y-1">
                    {dayItems.map(item => {
                      const pc = PLATFORM_CONFIG[item.platform];
                      return (
                        <div key={item.id}
                          className={`${pc.bg} rounded p-1 group relative cursor-pointer`}>
                          <div className={`flex items-center gap-1 ${pc.color}`}>
                            {pc.icon}
                            <span className="text-[9px] font-bold uppercase">{item.platform}</span>
                          </div>
                          <p className="text-[9px] text-zinc-300 leading-tight mt-0.5 line-clamp-2">{item.title}</p>
                          <span className={`text-[8px] font-bold px-1 rounded mt-0.5 inline-block ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                          <button onClick={() => removeItem(item.id)}
                            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={8} className="text-rose-400" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Platform legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG[Platform]][]).map(([key, cfg]) => (
          <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 ${cfg.bg} rounded-full`}>
            <span className={cfg.color}>{cfg.icon}</span>
            <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
