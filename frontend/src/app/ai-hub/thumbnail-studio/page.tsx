"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2, AlertCircle, Sparkles, Layout, Palette, Type, MousePointer2 } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface ThumbnailAsset {
  visual_prompt: string;
  layout_strategy: string;
  colors: { primary: string; secondary: string; accent: string };
  text_options: { text: string; position: string; font_style: string }[];
  psychology: string;
  dimension_template: string;
  sample_image_url: string;
}

export default function ThumbnailStudioPage() {
  const { modelPreferences } = useGlobalStore();
  const [title, setTitle] = useState("How to Build a SaaS in 24 Hours");
  const [style, setStyle] = useState("cinematic");
  const [platform, setPlatform] = useState("YouTube");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ThumbnailAsset | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiCall<ThumbnailAsset>("/api/ai/thumbnail-studio", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          style,
          platform,
          model_pref: modelPreferences.ai_content,
          open_router_model: modelPreferences.openRouterModel,
        }),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Blueprint generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-zinc-100 mb-2 italic">Thumbnail AI Studio <span className="text-xs bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 uppercase tracking-widest ml-4">PRO-LAB</span></h1>
        <p className="text-zinc-500 text-base">Architect high-CTR visual assets with psychological triggers and AI-generated blueprints.</p>
      </motion.div>

      {/* Control Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card glass-card-premium p-8 rounded-3xl border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-3xl -mr-32 -mt-32" />
        
        <div className="relative space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Type size={12} className="text-violet-400" /> Main Video/Content Hook</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()} placeholder="What is the video about?" className="glass-input w-full px-6 py-4 rounded-2xl text-base border-white/10 focus:border-violet-500/30 transition-all font-semibold" />
            </div>

            <div className="lg:col-span-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Palette size={12} className="text-cyan-400" /> Designer Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="glass-input w-full px-6 py-4 rounded-2xl text-sm border-white/10 appearance-none">
                <option value="cinematic">Cinematic Story</option>
                <option value="neon_bold">Neon & Bold</option>
                <option value="minimalist">Clean Minimal</option>
                <option value="mrbeast">High-Contrast (MrBeast Style)</option>
                <option value="dark_mystery">Dark & Mysterious</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex items-end">
              <button onClick={handleGenerate} disabled={loading || !title.trim()} className="w-full h-[60px] gradient-bg text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-2xl shadow-violet-500/20">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Architecting...</> : <><ImageIcon size={20} /> Generate Studio Asset</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center py-20">
          <div className="loading-orb mb-8 border-violet-500/20" />
          <p className="text-zinc-400 text-lg font-bold animate-pulse uppercase tracking-[0.2em]">Deconstructing Visual Psychology...</p>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/* Main Visual Asset */}
          <div className="lg:col-span-8 space-y-6">
             <div className="glass-card glass-card-premium rounded-[40px] border-white/5 overflow-hidden shadow-2xl relative group">
                <div className="aspect-video relative overflow-hidden">
                   <img src={result.sample_image_url} alt="Generated Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                   
                   {/* Layout Overlay Simulation */}
                   <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex justify-between items-start">
                         <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/20 uppercase">Layout: {result.dimension_template}</div>
                         <div className="px-3 py-1 bg-violet-600/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">{style} Mode</div>
                      </div>
                      <div className="space-y-4">
                         {result.text_options.map((t, i) => (
                           <div key={i} className="flex flex-col gap-2">
                              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">TEXT PEG {i+1}: {t.position}</span>
                              <h2 className="text-4xl font-black text-white italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] uppercase">"{t.text}"</h2>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-8 border-t border-white/5 bg-zinc-950/40">
                  <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-2 mb-4 uppercase italic tracking-widest"><ImageIcon size={14} className="text-violet-400" /> Production Image Prompt</h3>
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 relative">
                     <p className="text-sm text-zinc-400 leading-relaxed italic">{result.visual_prompt}</p>
                     <button className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"><MousePointer2 size={16} /></button>
                  </div>
                </div>
             </div>
          </div>

          {/* Asset Strategy Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="glass-card p-7 rounded-[32px] border-white/5">
               <h3 className="text-[10px] font-bold text-zinc-500 flex items-center gap-2 mb-6 uppercase tracking-[0.2em]"><Palette size={14} className="text-cyan-400" /> Color Architecture</h3>
               <div className="grid grid-cols-3 gap-3">
                  {Object.entries(result.colors).map(([key, val]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                       <div className="w-full aspect-square rounded-2xl shadow-xl shadow-black/50" style={{ backgroundColor: val }} />
                       <span className="text-[9px] font-black font-mono text-zinc-500 uppercase">{val}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-7 rounded-[32px] border-white/5 bg-gradient-to-br from-violet-500/5 to-transparent">
               <h3 className="text-[10px] font-bold text-zinc-500 flex items-center gap-2 mb-4 uppercase tracking-[0.2em]"><Sparkles size={14} className="text-amber-400" /> Click Psychology</h3>
               <p className="text-xs text-zinc-400 leading-relaxed tracking-wide">{result.psychology}</p>
            </div>

            <div className="glass-card p-7 rounded-[32px] border-white/5">
               <h3 className="text-[10px] font-bold text-zinc-500 flex items-center gap-2 mb-4 uppercase tracking-[0.2em]"><Layout size={14} className="text-emerald-400" /> Layout Composition</h3>
               <p className="text-xs text-zinc-400 leading-relaxed font-mono">{result.layout_strategy}</p>
            </div>

            <button className="w-full py-5 rounded-[24px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-100 flex items-center justify-center gap-2 group">
               Download Blueprint Package <ImageIcon size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
