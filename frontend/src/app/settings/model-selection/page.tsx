"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Check } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";

const models = [
  {
    id: "gemini" as const,
    name: "Google Gemini",
    model: "gemini-flash-latest",
    icon: "✦",
    color: "#8b5cf6",
    gradient: "from-violet-600 to-purple-600",
    description: "Best for SEO analysis, content generation, and structured JSON outputs.",
    strengths: ["Structured Output", "Long Context", "Fast"],
    costPer1k: "$0.00125",
  },
  {
    id: "openrouter" as const,
    name: "OpenRouter",
    model: "Free Model Fallback",
    icon: "⚡",
    color: "#06b6d4",
    gradient: "from-cyan-600 to-blue-600",
    description: "Multi-model gateway using intelligent fallback across high-quality free endpoints.",
    strengths: ["100% Free", "Auto Fallback", "Reliable"],
    costPer1k: "$0.000",
  },
  {
    id: "nvidia" as const,
    name: "NVIDIA NIM",
    model: "llama-3.1-70b",
    icon: "◆",
    color: "#10b981",
    gradient: "from-emerald-600 to-green-600",
    description: "High-performance inference engine for heavy processing tasks.",
    strengths: ["Speed", "Throughput", "Enterprise"],
    costPer1k: "$0.001",
  },
  {
    id: "mistral" as const,
    name: "Mistral AI",
    model: "mistral-large-latest",
    icon: "✧",
    color: "#f59e0b",
    gradient: "from-amber-600 to-orange-600",
    description: "Cutting-edge language models with exceptional reasoning capabilities.",
    strengths: ["Advanced Reasoning", "Multilingual", "High Quality"],
    costPer1k: "$0.0015",
  },
  {
    id: "huggingface" as const,
    name: "Hugging Face",
    model: "zephyr-7b-beta",
    icon: "🤗",
    color: "#f97316",
    gradient: "from-orange-600 to-red-600",
    description: "Open-source models with strong community support and customization options.",
    strengths: ["Open Source", "Customizable", "Community"],
    costPer1k: "$0.001",
  },
  {
    id: "codestral" as const,
    name: "Codestral",
    model: "codestral-latest",
    icon: "💻",
    color: "#3b82f6",
    gradient: "from-blue-600 to-indigo-600",
    description: "Specialized code generation and analysis model for developers.",
    strengths: ["Code Generation", "Debugging", "Technical"],
    costPer1k: "$0.0012",
  },
];

const categories = [
  { key: "seo" as const, label: "SEO & Search Tools", description: "SERP Analyzer, Keyword Lab, Rank Tracker, etc.", icon: "🔍", modules: 8 },
  { key: "youtube" as const, label: "YouTube Tools", description: "Rank Checker, Competitor Spy, Tags Optimizer, etc.", icon: "▶️", modules: 6 },
  { key: "tiktok" as const, label: "TikTok & Reels Tools", description: "Trend Scout, Hook Generator, Script Converter, etc.", icon: "🎵", modules: 5 },
  { key: "ai_content" as const, label: "AI Content Hub", description: "Humanizer, Ad Copy, eBook Builder, Email Architect, etc.", icon: "✍️", modules: 6 },
];

export default function ModelSelectionPage() {
  const { modelPreferences, setModelPreference, setOpenRouterModel, apiKeys } = useGlobalStore();

  const orModels = [
    { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5", provider: "Alibaba" },
    { id: "stepfun/step-3.5-flash:free", name: "Step-3.5", provider: "Stepfun" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity", provider: "Arcee" },
    { id: "z-ai/glm-4.5-air:free", name: "GLM-4.5", provider: "Zhipu" },
    { id: "minimax/minimax-m2.5:free", name: "Minimax", provider: "Minimax" },
    { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0", provider: "Google" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">AI Model Selection</h1>
        <p className="text-zinc-500 text-sm">
          Choose which AI model powers each category of tools. Switch models anytime based on speed, cost, or quality needs.
        </p>
      </motion.div>

      {/* Available Models Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Core Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model, i) => {
            const hasKey = !!apiKeys[model.id];
            return (
              <motion.div key={model.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-5 rounded-2xl ${!hasKey ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center text-lg`}>{model.icon}</div>
                  <div>
                    <h3 className="font-semibold text-zinc-200 text-sm">{model.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{model.model}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mb-3">{model.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                   {model.strengths.map((s) => (<span key={s} className="badge badge-info text-[10px]">{s}</span>))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">~{model.costPer1k} / 1K</span>
                  <span className={`text-xs font-medium ${hasKey ? "text-emerald-400" : "text-zinc-600"}`}>{hasKey ? "✓ Active" : "✗ Inactive"}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* OpenRouter Model Toggle */}
      {apiKeys.openrouter && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 rounded-3xl border-cyan-500/20 bg-cyan-500/2">
           <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest italic">OpenRouter Specific Model Selection</h3>
                <p className="text-xs text-zinc-500">Pick which specific model powers the OpenRouter gateway.</p>
              </div>
              <span className="px-3 py-1 bg-zinc-950 rounded-lg text-[10px] text-cyan-400 font-mono border border-cyan-500/20">LIVE FALLBACK ACTIVE</span>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {orModels.map((m) => {
                 const isSelected = modelPreferences.openRouterModel === m.id;
                 return (
                   <button key={m.id} onClick={() => setOpenRouterModel(m.id)} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isSelected ? "bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20" : "bg-zinc-950 border-white/5 hover:border-white/10"}`}>
                      <div className="text-left">
                         <p className={`text-xs font-bold ${isSelected ? "text-cyan-300" : "text-zinc-400"}`}>{m.name}</p>
                         <p className="text-[9px] text-zinc-600 uppercase">{m.provider}</p>
                      </div>
                      {isSelected && <Check size={14} className="text-cyan-400" />}
                   </button>
                 );
              })}
           </div>
        </motion.div>
      )}

      {/* Category Assignments */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Pipeline Assignments</h2>
        <div className="space-y-4">
          {categories.map((cat, i) => {
            const currentModel = modelPreferences[cat.key];
            return (
              <motion.div key={cat.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.2 }} className="glass-card p-6 rounded-3xl border-white/5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl p-3 bg-white/3 rounded-2xl border border-white/5">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-base">{cat.label}</h3>
                      <p className="text-sm text-zinc-500">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 p-1.5 bg-zinc-950 rounded-2xl border border-white/5">
                    {models.map((model) => {
                      const isSelected = currentModel === model.id;
                      const hasKey = !!apiKeys[model.id];
                      return (
                        <button key={model.id} onClick={() => setModelPreference(cat.key, model.id)} disabled={!hasKey} className={`relative px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${isSelected ? `bg-gradient-to-br ${model.gradient} text-white shadow-lg` : hasKey ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/5" : "text-zinc-800 cursor-not-allowed opacity-30"}`}>
                          <span>{model.icon}</span>
                          <span>{model.name.split(" ").pop()}</span>
                          {isSelected && <Check size={12} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Summary Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-3xl border-violet-500/10 bg-gradient-to-r from-violet-500/5 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <Cpu size={18} className="text-violet-400" />
          <h3 className="font-bold text-zinc-300 text-sm uppercase tracking-widest">Active Intelligence Profile</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const modelId = modelPreferences[cat.key];
            const model = models.find((m) => m.id === modelId);
            return (
              <div key={cat.key} className="flex flex-col gap-1 p-3 rounded-2xl bg-zinc-950 border border-white/5">
                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter">{cat.label}</p>
                <p className="text-xs font-bold truncate" style={{ color: model?.color || "#a1a1aa" }}>{model?.name || "Offline"}</p>
                {modelId === "openrouter" && (
                   <p className="text-[8px] text-cyan-500 font-mono truncate">{modelPreferences.openRouterModel?.split("/")[1] || "default"}</p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
