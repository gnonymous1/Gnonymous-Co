"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, AlertCircle, Star, Phone } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type LocalBusinessResult = {
  name?: string;
  title?: string;
  address?: string;
  snippet?: string;
  rating?: number | string;
  reviews?: number | string;
  phone?: string;
};

type LocalSeoResponse = {
  local_results?: LocalBusinessResult[];
  insights?: string;
};

export default function LocalSeoPage() {
  const { modelPreferences } = useGlobalStore();
  const [businessName, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LocalSeoResponse | null>(null);

  const handle = async () => {
    if (!businessName.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<LocalSeoResponse>("/api/seo/local-seo", { method: "POST", body: JSON.stringify({ business_name: businessName.trim(), location: location.trim(), model_pref: modelPreferences.seo }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to analyze local SEO"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Google Maps Local SEO</h1>
        <p className="text-zinc-500 text-sm">Analyze local business rankings, GMB profiles, and review sentiment in your area.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1"><label className="text-xs font-medium text-zinc-400 mb-2 block">Business / Category</label><input type="text" value={businessName} onChange={(e) => setBusiness(e.target.value)} placeholder="e.g., Best pizza restaurants" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div className="flex-1"><label className="text-xs font-medium text-zinc-400 mb-2 block">Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., New York, NY" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
        </div>
        <button onClick={handle} disabled={loading} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><MapPin size={16} /> Analyze Local SEO</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Analyzing local results...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {result.local_results && <div className="space-y-3">{result.local_results.map((biz, i: number) => (
            <div key={i} className="glass-card p-5 rounded-2xl flex items-start gap-4">
              <span className="text-2xl font-bold text-zinc-700 font-mono">#{i + 1}</span>
              <div className="flex-1">
                <h3 className="text-zinc-200 font-semibold">{biz.name || biz.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{biz.address || biz.snippet}</p>
                <div className="flex items-center gap-3 mt-2">
                  {biz.rating && <span className="flex items-center gap-1 text-amber-400 text-sm"><Star size={12} fill="currentColor" /> {biz.rating}</span>}
                  {biz.reviews && <span className="text-xs text-zinc-500">({biz.reviews} reviews)</span>}
                  {biz.phone && <span className="flex items-center gap-1 text-xs text-zinc-500"><Phone size={10} /> {biz.phone}</span>}
                </div>
              </div>
            </div>
          ))}</div>}
          {result.insights && <div className="glass-card p-5 rounded-2xl border border-violet-500/20"><h3 className="font-semibold text-violet-300 mb-2 text-sm">Local SEO Insights</h3><p className="text-sm text-zinc-400 leading-relaxed">{result.insights}</p></div>}
        </motion.div>
      )}
    </div>
  );
}
