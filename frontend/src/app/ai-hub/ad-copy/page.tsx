"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface AdVariant {
  headline?: string;
  primary_text?: string;
  description?: string;
  cta?: string;
  headline_1?: string;
  headline_2?: string;
  display_url?: string;
  caption?: string;
  hashtags?: string;
}

interface AdCopyResult {
  facebook?: AdVariant[];
  google?: AdVariant[];
  instagram?: AdVariant[];
}

export default function AdCopyPage() {
  const { modelPreferences } = useGlobalStore();
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AdCopyResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("facebook");

  const handleGenerate = async () => {
    if (!product.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<AdCopyResult>("/api/ai/ad-copy", {
        method: "POST",
        body: JSON.stringify({ product: product.trim(), audience: audience.trim() || "general", platform: "all", model_pref: modelPreferences.ai_content }),
      });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Multi-Platform Ad Copy</h1>
        <p className="text-zinc-500 text-sm">Generate high-converting ad copies for Facebook, Google, and Instagram campaigns.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Product / Service</label>
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()} placeholder="e.g., AI-powered SEO tool for agencies" className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div className="w-full lg:w-48">
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Target Audience</label>
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., marketers" className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={loading || !product.trim()} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2 whitespace-nowrap">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Megaphone size={16} /> Generate Ads</>}
            </button>
          </div>
        </div>
      </motion.div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Crafting ad copies...</p></div>}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
            {["facebook", "google", "instagram"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === t ? "gradient-bg text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{t}</button>
            ))}
          </div>
          <div className="space-y-3">
            {(result[activeTab as keyof AdCopyResult] || []).map((ad, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl group">
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-info text-xs">Variant {i + 1}</span>
                  <button onClick={() => copyText(JSON.stringify(ad, null, 2), `ad-${activeTab}-${i}`)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-all">
                    {copied === `ad-${activeTab}-${i}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                {activeTab === "facebook" && (<>
                  <h3 className="text-zinc-200 font-semibold mb-1">{ad.headline}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{ad.primary_text}</p>
                  <p className="text-xs text-zinc-500">{ad.description}</p>
                  <span className="badge badge-easy text-xs mt-2 inline-block">{ad.cta}</span>
                </>)}
                {activeTab === "google" && (<>
                  <h3 className="text-cyan-300 font-semibold text-sm">{ad.headline_1} | {ad.headline_2}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{ad.description}</p>
                  <p className="text-xs text-emerald-500 mt-1">{ad.display_url}</p>
                </>)}
                {activeTab === "instagram" && (<>
                  <FormattedContent content={ad.caption as string} />
                  <p className="text-xs text-cyan-400">{ad.hashtags}</p>
                  <span className="badge badge-easy text-xs mt-2 inline-block">{ad.cta}</span>
                </>)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
