"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldX, Loader2, Eye, EyeOff, Save, Zap } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface ProviderConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  gradient: string;
  placeholder: string;
  description: string;
}

const providers: ProviderConfig[] = [
  {
    key: "gemini",
    label: "Google Gemini",
    icon: "✦",
    color: "#8b5cf6",
    gradient: "from-violet-600 to-purple-600",
    placeholder: "AIzaSy...",
    description: "Primary AI model for SERP analysis, content generation, and SEO insights.",
  },
  {
    key: "openrouter",
    label: "OpenRouter",
    icon: "⚡",
    color: "#06b6d4",
    gradient: "from-cyan-600 to-blue-600",
    placeholder: "sk-or-v1-...",
    description: "Multi-model gateway — access Llama, Mixtral, Claude and more.",
  },
  {
    key: "nvidia",
    label: "NVIDIA NIM",
    icon: "◆",
    color: "#10b981",
    gradient: "from-emerald-600 to-green-600",
    placeholder: "nvapi-...",
    description: "High-performance inference for heavy workloads like eBook generation.",
  },
  {
    key: "serper",
    label: "Serper.dev",
    icon: "🔍",
    color: "#f59e0b",
    gradient: "from-amber-600 to-orange-600",
    placeholder: "Your Serper.dev API key...",
    description: "Google SERP data — required for all SEO tools, keyword research, and rank tracking.",
  },
  {
    key: "youtube",
    label: "YouTube Data API",
    icon: "▶",
    color: "#ef4444",
    gradient: "from-red-600 to-pink-600",
    placeholder: "AIzaSy...",
    description: "YouTube channel analytics, video data, and comment sentiment analysis.",
  },
];

export default function ApiKeysPage() {
  const { apiKeys, setApiKey } = useGlobalStore();
  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testingKey, setTestingKey] = useState("");
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      Object.entries(localKeys).forEach(([provider, key]) => {
        setApiKey(provider as keyof typeof apiKeys, key);
      });
      await apiCall("/api/settings/api-keys", {
        method: "PUT",
        body: JSON.stringify(localKeys),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (provider: string) => {
    setTestingKey(provider);
    setTestResults((prev) => ({ ...prev, [provider]: null }));

    try {
      await apiCall("/api/settings/api-keys", {
        method: "PUT",
        body: JSON.stringify({ [provider]: localKeys[provider as keyof typeof localKeys] }),
      });

      const result = await apiCall<{ is_valid: boolean }>(
        `/api/settings/api-keys/test/${provider}`,
        { method: "POST" }
      );
      setTestResults((prev) => ({ ...prev, [provider]: result.is_valid }));
    } catch {
      setTestResults((prev) => ({ ...prev, [provider]: false }));
    } finally {
      setTestingKey("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-black text-brand-secondary uppercase tracking-[0.3em] font-mono mb-2">Vault // Terminal Access</h2>
          <p className="text-[10px] text-text-4 font-mono uppercase opacity-70 leading-relaxed">Secure credentials for neural linkage and data ingestion.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary px-8 h-11 text-xs font-black tracking-widest uppercase shadow-brand"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <ShieldCheck size={16} />
          ) : (
            <Save size={16} />
          )}
          {saved ? "COMMITTED" : "COMMIT CHANGES"}
        </button>
      </motion.div>

      {/* Connectivity Status Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 rounded-xl flex items-center gap-8 border-white/5 bg-surface-lowest/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-brand" />
          <span className="text-[10px] font-black text-text-3 uppercase tracking-widest font-mono">Linkage Status</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {providers.map((p) => (
            <div key={p.key} className="flex items-center gap-2">
              <div
                className={`w-1 h-1 rounded-full ${
                  localKeys[p.key as keyof typeof localKeys]
                    ? "bg-brand-primary animate-pulse"
                    : "bg-surface-lowest-2 border border-white/10"
                }`}
              />
              <span className="text-[10px] font-mono text-text-4 uppercase opacity-60 tracking-wider font-bold">{p.label.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Entry Points */}
      <div className="grid grid-cols-1 gap-4">
        {providers.map((provider, i) => {
          const value = localKeys[provider.key as keyof typeof localKeys] || "";
          const testResult = testResults[provider.key];

          return (
            <motion.div
              key={provider.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card p-6 rounded-2xl border-white/5 group hover:border-brand-secondary/20 transition-all shadow-xl bg-surface-lowest/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5 flex-1 max-w-xl">
                  <div
                    className={`w-12 h-12 rounded-xl bg-surface-lowest border border-white/5 flex items-center justify-center text-xl text-text-1 group-hover:text-brand-secondary transition-colors shadow-inner`}
                  >
                    {provider.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-1 uppercase tracking-widest font-mono">{provider.label}</h3>
                    <p className="text-[10px] text-text-4 mt-1 leading-relaxed opacity-70">{provider.description}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 w-full">
                    <input
                      type={showKeys[provider.key] ? "text" : "password"}
                      value={value}
                      onChange={(e) =>
                        setLocalKeys((prev) => ({ ...prev, [provider.key]: e.target.value }))
                      }
                      placeholder={`ENTER ${provider.label.toUpperCase()} SECRET...`}
                      className="glass-input w-full px-4 py-3 rounded-xl text-xs pr-12 font-mono"
                    />
                    <button
                      onClick={() => toggleShowKey(provider.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-4 hover:text-text-1 transition-colors"
                    >
                      {showKeys[provider.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTest(provider.key)}
                      disabled={!value || testingKey === provider.key}
                      className="btn btn-secondary px-5 h-[42px] text-[10px] font-black uppercase font-mono tracking-widest whitespace-nowrap"
                    >
                      {testingKey === provider.key ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Zap size={12} className="text-brand-primary" />
                      )}
                      {testingKey === provider.key ? "VERIFYING" : "TEST"}
                    </button>

                    <AnimatePresence>
                      {testResult !== undefined && testResult !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            testResult ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary shadow-brand-inner" : "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-rose-inner"
                          }`}
                        >
                          {testResult ? <ShieldCheck size={18} /> : <ShieldX size={18} />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
