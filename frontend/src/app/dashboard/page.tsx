"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Rocket, Bot, Building2, Factory, Store, Code2, Gift, Target,
  Search, CirclePlay, Music, PenTool, TrendingUp, Zap, Globe, BarChart3,
  Activity, Users, Crown, Sparkles, ChevronRight, Star, DollarSign,
  RefreshCw, Calendar, Cpu, ShieldCheck, Clock, Lock, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Components ─────────────────────────────────────────── */

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

function MetricCard({ label, val, sub, icon: Icon, color }: any) {
  return (
    <div className="luxe-card p-6 flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg bg-zinc-900 border border-white/5 ${color}`}>
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          +12%
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{val}</div>
        <div className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

const TOOLS = [
  { label: "SEO Intelligence", desc: "SERP analysis & backlink auditing", icon: Search, href: "/seo/serp-analyzer", badge: "Live" },
  { label: "Keyword Lab", desc: "Unlock semantic search opportunities", icon: Target, href: "/seo/keyword-lab", badge: "Pro" },
  { label: "AI Humanizer", desc: "Make AI content indistinguishable", icon: Bot, href: "/ai-hub/humanizer", badge: "Pro" },
  { label: "YouTube Rank", desc: "Track video performance globally", icon: CirclePlay, href: "/youtube/rank-checker", badge: "Free" },
  { label: "Social Trends", desc: "Predict viral content patterns", icon: Music, href: "/tiktok/trend-scout", badge: "New" },
  { label: "Mission Control", desc: "Automated growth workflows", icon: Rocket, href: "/missions", badge: "Pro" },
];

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      
      {/* ── Welcome Hero ─────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="title-section">Dashboard Overview</h1>
          <p className="text-sm text-zinc-400 max-w-lg">
            Welcome back to <span className="text-emerald-400 font-semibold tracking-tight">Apex Content OS</span>. 
            All content pipelines are currently operational and performing at 98.4% efficiency.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary"><Calendar size={14} /> Schedule</button>
          <Link href="/factory/new">
             <button className="btn btn-primary shadow-emerald-900/40"><Plus size={14} /> Create New Asset</button>
          </Link>
        </div>
      </section>

      {/* ── Key Metrics ──────────────────────────────────────── */}
      <motion.section 
        variants={STAGGER} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={ITEM}><MetricCard label="Total Assets" val="1,284" icon={Factory} color="text-zinc-400" /></motion.div>
        <motion.div variants={ITEM}><MetricCard label="AI Generations" val="45.2k" icon={Cpu} color="text-emerald-400" /></motion.div>
        <motion.div variants={ITEM}><MetricCard label="Active Pipelines" val="12" icon={Rocket} color="text-sky-400" /></motion.div>
        <motion.div variants={ITEM}><MetricCard label="Market Reach" val="2.4M" icon={Users} color="text-indigo-400" /></motion.div>
      </motion.section>

      {/* ── Core Tools Grid ──────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Core Intelligence Tools</h2>
          <Link href="/developers" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
            API Documentation <ArrowRight size={10} className="inline ml-1" />
          </Link>
        </div>
        
        <motion.div 
          variants={STAGGER} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TOOLS.map((tool) => (
            <motion.div key={tool.label} variants={ITEM}>
              <Link href={tool.href} className="group">
                <div className="luxe-card p-5 h-full flex flex-col gap-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <tool.icon size={20} />
                    </div>
                    {tool.badge === "Pro" ? (
                      <span className="badge badge-pro">{tool.badge}</span>
                    ) : tool.badge === "New" ? (
                      <span className="badge badge-new">{tool.badge}</span>
                    ) : (
                      <span className="badge badge-success">{tool.badge}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      {tool.label} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-x-0.5 transition-all text-emerald-500" />
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{tool.desc}</p>
                  </div>
                  {/* Subtle background glow on hover */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Recent Activity ──────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between px-1">
             <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Active Pipelines</h2>
             <span className="text-[10px] font-bold text-emerald-500">Live Telemetry</span>
           </div>
           <div className="luxe-card divide-y divide-white/5">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 flex items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                         {i === 1 ? <Search size={16} /> : i === 2 ? <Bot size={16} /> : <CirclePlay size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{i === 1 ? "SERP Intelligence Audit" : i === 2 ? "Neural Humanizer Bulk Gen" : "YouTube SEO Booster"}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest font-mono">Status: {i === 1 ? "Syncing..." : "Optimal"}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="hidden md:block text-right">
                         <div className="text-xs font-bold text-zinc-300">89%</div>
                         <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '89%' }} />
                         </div>
                      </div>
                      <button className="btn btn-secondary w-8 h-8 p-0"><ChevronRight size={14} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Infrastructure Status</h2>
           <div className="luxe-card p-6 space-y-5">
              {[
                { l: "API Connectivity", s: "Operational", c: "text-emerald-400" },
                { l: "AI Context Window", s: "94% Clean", c: "text-emerald-400" },
                { l: "DB Replication", s: "Synchronized", c: "text-emerald-400" },
                { l: "Cloud Latency", s: "14ms", c: "text-sky-400" }
              ].map(st => (
                <div key={st.l} className="flex items-center justify-between">
                   <span className="text-xs text-zinc-400 font-medium">{st.l}</span>
                   <span className={`text-xs font-bold ${st.c}`}>{st.s}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-white/5">
                 <button className="btn btn-secondary w-full text-[11px] h-9">SYSTEM SETTINGS</button>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}

function Plus({ size, className }: any) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
