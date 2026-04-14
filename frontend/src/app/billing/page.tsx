"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Zap, TrendingUp, Crown, ArrowUpRight, AlertCircle,
  Check, BarChart3, RefreshCw, Download
} from "lucide-react";
import Link from "next/link";

interface BillingStatus {
  plan: string;
  credits_used: number;
  credits_total: number;
  credits_pct: number;
  next_billing_date: string | null;
  subscription_id: string | null;
  features: string[];
}

const planDetails: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  free: { color: "#71717a", label: "Free", icon: <Zap size={14} /> },
  pro: { color: "#8b5cf6", label: "Pro", icon: <Crown size={14} /> },
  agency: { color: "#f59e0b", label: "Agency", icon: <BarChart3 size={14} /> },
};

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus>({
    plan: "free",
    credits_used: 47,
    credits_total: 100,
    credits_pct: 47,
    next_billing_date: null,
    subscription_id: null,
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/status")
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const plan = planDetails[status.plan] ?? planDetails.free;
  const usageWarning = status.credits_pct >= 80;

  const lifetimeStats = [
    { label: "Total Tool Runs", value: "1,247", icon: <Zap size={16} className="text-violet-400" /> },
    { label: "AI Tokens Used", value: "284K", icon: <TrendingUp size={16} className="text-emerald-400" /> },
    { label: "Est. Value Generated", value: "$3,420", icon: <Crown size={16} className="text-amber-400" /> },
  ];

  const comparePlans = [
    {
      name: "Free",
      price: "$0/mo",
      highlights: ["5 runs/day", "Basic AI", "7-day archive"],
      current: status.plan === "free",
      accentColor: "#71717a",
    },
    {
      name: "Pro",
      price: "$29/mo",
      highlights: ["Unlimited runs", "All AI models", "Missions + Autopilot"],
      current: status.plan === "pro",
      accentColor: "#8b5cf6",
      highlight: true,
    },
    {
      name: "Agency",
      price: "$99/mo",
      highlights: ["White-label", "10 clients", "API access"],
      current: status.plan === "agency",
      accentColor: "#f59e0b",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1">
          <CreditCard className="text-violet-400" /> Billing & Subscription
        </h1>
        <p className="text-zinc-500 text-sm">Manage your plan, credits, and payment history.</p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2">Current Plan</p>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold"
                style={{ background: `${plan.color}20`, color: plan.color }}
              >
                {plan.icon} {plan.label}
              </div>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">Active</span>
            </div>
            {status.next_billing_date && (
              <p className="text-zinc-500 text-xs mt-2">
                Next billing: {new Date(status.next_billing_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <Link
            href="/pricing"
            id="upgrade-plan-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}
          >
            <ArrowUpRight size={14} /> Upgrade Plan
          </Link>
        </div>

        {/* Credits Usage */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-zinc-400 font-medium">Daily Tool Runs</span>
            <span className="text-white font-bold">
              {status.credits_used} / {status.credits_total === -1 ? "∞" : status.credits_total}
            </span>
          </div>
          <div className="h-2.5 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(status.credits_pct, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: usageWarning
                  ? "linear-gradient(90deg, #ef4444, #f97316)"
                  : "linear-gradient(90deg, #7c3aed, #c026d3)",
              }}
            />
          </div>
          {usageWarning && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-2 text-amber-400 text-xs"
            >
              <AlertCircle size={12} />
              You&apos;re near your daily limit. Upgrade for unlimited runs.
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Lifetime Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        {lifetimeStats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-xs text-zinc-500 uppercase font-bold">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Plan Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4">Compare Plans</h2>
        <div className="grid grid-cols-3 gap-4">
          {comparePlans.map((p, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${
                p.highlight
                  ? "border-violet-500/40 bg-violet-500/5"
                  : "border-white/5 bg-white/3"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">{p.name}</span>
                {p.current && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                    CURRENT
                  </span>
                )}
              </div>
              <p className="font-black mb-3 text-sm" style={{ color: p.accentColor }}>
                {p.price}
              </p>
              <ul className="space-y-1.5 mb-4">
                {p.highlights.map((h, hi) => (
                  <li key={hi} className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check size={10} style={{ color: p.accentColor }} className="shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
              {!p.current && (
                <Link
                  href="/pricing"
                  className="block text-center text-xs font-bold py-2 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-300 transition-colors"
                >
                  Switch →
                </Link>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3 flex-wrap"
      >
        <button
          id="download-invoice"
          className="flex items-center gap-2 px-4 py-2. 5 rounded-xl text-sm font-semibold text-zinc-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Download size={14} /> Download Invoice
        </button>
        <button
          id="refresh-billing"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={14} /> Refresh Status
        </button>
        {status.plan !== "free" && (
          <button
            id="cancel-subscription"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-colors ml-auto"
          >
            Cancel Subscription
          </button>
        )}
      </motion.div>
    </div>
  );
}
