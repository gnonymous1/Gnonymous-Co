"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Users, Copy, Check, ChevronRight, TrendingUp, DollarSign, Zap, Share2, AtSign, Briefcase, Link as LinkIcon, Trophy } from "lucide-react";

const REFERRAL_STATS = [
  { label: "Total Referrals", value: "12", icon: <Users size={18} />, color: "text-violet-400" },
  { label: "Converted", value: "7", icon: <TrendingUp size={18} />, color: "text-emerald-400" },
  { label: "Pending Reward", value: "$140", icon: <DollarSign size={18} />, color: "text-amber-400" },
  { label: "Total Earned", value: "$420", icon: <Gift size={18} />, color: "text-rose-400" },
];

const REWARDS = [
  { milestone: 1, label: "First referral", reward: "1 month Pro free", achieved: true },
  { milestone: 5, label: "5 referrals", reward: "$50 cash + Agency 30 days", achieved: true },
  { milestone: 10, label: "10 referrals", reward: "$200 cash", achieved: false, current: true },
  { milestone: 25, label: "25 referrals", reward: "$500 cash + lifetime Pro", achieved: false },
  { milestone: 50, label: "50 referrals", reward: "$1,000 cash + revenue share", achieved: false },
];

const REFERRAL_HISTORY = [
  { name: "Alex M.", date: "Apr 10, 2026", plan: "Pro", status: "converted", reward: "$20" },
  { name: "Priya K.", date: "Apr 8, 2026", plan: "Pro", status: "converted", reward: "$20" },
  { name: "Sam L.", date: "Apr 5, 2026", plan: "Agency", status: "converted", reward: "$40" },
  { name: "Jordan T.", date: "Apr 12, 2026", plan: "—", status: "pending", reward: "$0" },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://apexcontentos.com?ref=user123";

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCount = 12;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
          <Gift size={20} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-100">Referral Program</h1>
          <p className="text-zinc-500 text-sm">Share Apex Content OS, earn cash and free upgrades</p>
        </div>
        <div className="ml-auto px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-1.5">
          <Trophy size={12} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-300">12 Referrals Done</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {REFERRAL_STATS.map((s, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral link */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="glass-card p-6 rounded-2xl">
            <h2 className="font-bold text-zinc-200 mb-4 flex items-center gap-2"><LinkIcon size={14} /> Your Referral Link</h2>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                {referralLink}
              </div>
              <button onClick={copy} className="px-4 py-3 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl text-rose-300 font-bold text-sm flex items-center gap-2 shrink-0">
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mb-4">You earn <strong className="text-rose-400">$20</strong> for every Pro referral, <strong className="text-amber-400">$40</strong> for Agency.</p>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Twitter/X", icon: <AtSign size={14} />, color: "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" },
                { label: "LinkedIn", icon: <Briefcase size={14} />, color: "text-sky-400 bg-sky-500/10 hover:bg-sky-500/20" },
                { label: "Copy Link", icon: <Share2 size={14} />, color: "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20" },
              ].map(btn => (
                <button key={btn.label} onClick={copy}
                  className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${btn.color} transition-colors`}>
                  {btn.icon}{btn.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Earnings breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="glass-card p-6 rounded-2xl">
            <h2 className="font-bold text-zinc-200 mb-4 flex items-center gap-2"><DollarSign size={14} /> Commission Rates</h2>
            <div className="space-y-3">
              {[
                { plan: "Starter", commission: "$10/referral", type: "one-time" },
                { plan: "Pro", commission: "$20/referral", type: "one-time" },
                { plan: "Agency", commission: "$40/referral", type: "one-time" },
                { plan: "Pro Annual", commission: "20% recurring", type: "monthly" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 bg-white/3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-sm font-bold text-zinc-200">{r.plan}</span>
                    <span className="ml-2 text-[10px] text-zinc-600 uppercase">{r.type}</span>
                  </div>
                  <span className="text-emerald-400 font-black">{r.commission}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Milestones + History */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-6 rounded-2xl">
            <h2 className="font-bold text-zinc-200 mb-4 flex items-center gap-2"><Trophy size={14} /> Milestones</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-4 pl-10">
                {REWARDS.map((r, i) => (
                  <div key={i} className={`relative ${r.current ? "scale-[1.02]" : ""}`}>
                    <div className={`absolute -left-[26px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                      r.achieved ? "bg-emerald-500 text-white" :
                      r.current ? "bg-violet-500 text-white animate-pulse" : "bg-white/10 text-zinc-600"
                    }`}>{r.achieved ? "✓" : r.milestone}</div>
                    <div className={`p-3 rounded-xl border ${
                      r.achieved ? "bg-emerald-500/5 border-emerald-500/20" :
                      r.current ? "bg-violet-500/10 border-violet-500/30" : "bg-white/3 border-white/5"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-200">{r.label}</span>
                        {r.current && <span className="text-[10px] text-violet-300 font-bold bg-violet-500/20 px-2 py-0.5 rounded-full">{currentCount}/10</span>}
                      </div>
                      <span className={`text-xs ${r.achieved ? "text-emerald-400" : r.current ? "text-violet-300" : "text-zinc-500"}`}>{r.reward}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="font-bold text-zinc-200 text-sm">Recent Referrals</h2>
            </div>
            <div className="divide-y divide-white/5">
              {REFERRAL_HISTORY.map((r, i) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-xs font-black text-zinc-400 shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-200">{r.name}</p>
                    <p className="text-xs text-zinc-600">{r.date} · {r.plan}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.status === "converted" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {r.status}
                  </span>
                  <span className="text-sm font-black text-emerald-400 w-12 text-right">{r.reward}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
