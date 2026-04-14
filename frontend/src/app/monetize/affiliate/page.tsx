"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Loader2, Sparkles, Filter, Check, ArrowRight } from "lucide-react";

export default function AffiliateHubPage() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);

  // Mocked state for visuals
  const networks = ["Amazon Associates", "ClickBank", "ShareASale", "CJ Affiliate", "Impact"];
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1"><Layers className="text-cyan-400"/> Affiliate Intelligence Hub</h1>
          <p className="text-zinc-500 text-sm">Find high-converting offers and generate promotional strategies.</p>
        </div>
      </motion.div>

      <div className="glass-card p-6 rounded-3xl flex gap-4 bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/20">
        <input type="text" value={niche} onChange={e=>setNiche(e.target.value)} placeholder="Enter niche (e.g., Dog Training, SaaS, Fitness)" className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"/>
        <button className="gradient-bg-cyan px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2" onClick={() => setLoading(!loading)}>
          {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
          Find Offers
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-xl rounded-full"></div>
          <p className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-widest flex items-center gap-2"><Filter size={14}/> Top Networks</p>
          <div className="space-y-3">
            {networks.map(n => (
              <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors cursor-pointer">
                <span className="text-sm font-bold text-zinc-300">{n}</span>
                <ArrowRight size={14} className="text-zinc-500"/>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 glass-card p-6 rounded-2xl border-white/5 h-[400px] flex items-center justify-center text-center">
          <div>
            <Sparkles size={48} className="text-cyan-400/20 mx-auto mb-4"/>
            <h3 className="text-lg font-bold text-zinc-300 mb-2">Offer Database Interface</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">Connect your API keys or enter a niche above to pull real-time, high-converting affiliate offers and generate custom promotional content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
