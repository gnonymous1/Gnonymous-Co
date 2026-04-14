"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, BarChart3, Cpu } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";

export default function UsageTrackerPage() {
  const { usage, modelPreferences } = useGlobalStore();

  const modelColors: Record<string, string> = {
    gemini: "#8b5cf6",
    openrouter: "#06b6d4",
    nvidia: "#10b981",
  };

  const totalCalls = Object.values(usage.callsByModel).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Usage & Wallet Tracker</h1>
        <p className="text-zinc-500 text-sm">Track API costs, token usage, and spending across models in real-time.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Tokens", value: usage.totalTokens.toLocaleString(), icon: <Cpu size={18} />, color: "text-violet-400" },
          { label: "Total Cost", value: `$${usage.totalCost.toFixed(4)}`, icon: <Wallet size={18} />, color: "text-emerald-400" },
          { label: "Total API Calls", value: totalCalls.toString(), icon: <BarChart3 size={18} />, color: "text-cyan-400" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl">
            <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-xs text-zinc-500">{s.label}</span></div>
            <p className="text-3xl font-bold text-zinc-200">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Usage by Model */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
        <h3 className="font-semibold text-zinc-300 mb-4 text-sm">Calls by Model</h3>
        {totalCalls === 0 ? (
          <p className="text-zinc-600 text-sm">No API calls made yet. Use any tool to start tracking.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(usage.callsByModel).map(([model, calls]) => {
              const pct = totalCalls > 0 ? (calls / totalCalls) * 100 : 0;
              return (
                <div key={model}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300 capitalize font-medium">{model}</span>
                    <span className="text-sm text-zinc-500">{calls} calls ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: modelColors[model] || "#8b5cf6" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Current Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl">
        <h3 className="font-semibold text-zinc-300 mb-4 text-sm">Active Model Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(modelPreferences).map(([cat, model]) => (
            <div key={cat} className="text-center p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">{cat.replace("_", " ")}</p>
              <p className="text-sm font-semibold capitalize" style={{ color: modelColors[model] || "#a1a1aa" }}>{model}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
