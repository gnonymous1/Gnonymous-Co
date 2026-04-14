"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader2, AlertCircle, Copy, Check, Star, Target } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

const platforms = ["TikTok","Instagram Reels","YouTube Shorts","LinkedIn"];
const niches = ["general","fitness","finance","tech","beauty","business","crypto"];
const audiences = ["Gen Z","Millennials","Founders","Creators","Students"];
const hookStyles = ["question","shock","story","challenge","controversy","curiosity"];

interface Hook { text: string; style: string; estimated_retention: string; why_it_works: string; visual_pairing?: string; a_b_variant?: string; }
interface HookResponse { hooks?: Hook[]; hook_formulas?: { formula: string; example: string; best_for: string }[]; opening_lines_bank?: string[]; pattern_interrupts?: string[]; power_words?: string[]; }

export default function HookGeneratorPage() {
  const { modelPreferences } = useGlobalStore();
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [niche, setNiche] = useState("finance");
  const [audience, setAudience] = useState("Millennials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<HookResponse | null>(null);
  const [activeTab, setActiveTab] = useState("hooks");
  const [copied, setCopied] = useState<string|null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [filterStyle, setFilterStyle] = useState<string|null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<HookResponse>("/api/tt/hooks", { method: "POST", body: JSON.stringify({ topic, platform, niche, target_audience: audience, model_pref: modelPreferences.tiktok }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed."); } finally { setLoading(false); }
  };

  React.useEffect(() => { setTopic("How to make $1000 online in 30 days"); handleGenerate(); }, []);

  const copy = (t: string, id: string) => { navigator.clipboard.writeText(t); setCopied(id); setTimeout(()=>setCopied(null),1500); };
  const toggleSave = (i: number) => setSaved(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);

  const filteredHooks = result?.hooks?.filter(h => !filterStyle || h.style === filterStyle) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1">Hook Generator <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 rounded-full border border-amber-500/20">LIVE</span></h1>
          <p className="text-zinc-500 text-sm">Scroll-stopping first 3 seconds — engineered for maximum retention.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl space-y-5">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Target size={10}/>Topic</label>
          <div className="flex gap-3">
            <input type="text" value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleGenerate()} className="glass-input flex-1 px-4 py-3 rounded-xl text-sm"/>
            <button onClick={handleGenerate} disabled={loading||!topic.trim()} className="gradient-bg px-6 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40">{loading?<Loader2 size={16} className="animate-spin"/>:<Zap size={16}/>}</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase">Platform</label><select value={platform} onChange={e=>setPlatform(e.target.value)} className="glass-input w-full p-2 rounded-xl text-sm">{platforms.map(p=><option key={p} className="bg-zinc-900">{p}</option>)}</select></div>
          <div><label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase">Niche</label><select value={niche} onChange={e=>setNiche(e.target.value)} className="glass-input w-full p-2 rounded-xl text-sm">{niches.map(n=><option key={n} className="bg-zinc-900 capitalize">{n}</option>)}</select></div>
          <div><label className="block text-[10px] text-zinc-500 font-bold mb-2 uppercase">Audience</label><select value={audience} onChange={e=>setAudience(e.target.value)} className="glass-input w-full p-2 rounded-xl text-sm">{audiences.map(a=><option key={a} className="bg-zinc-900">{a}</option>)}</select></div>
        </div>
      </motion.div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 text-rose-300 text-sm">{error}</div>}
      {loading && <div className="flex flex-col items-center py-20"><div className="loading-orb mb-6"/><p className="text-zinc-400 text-sm animate-pulse">Engineering hooks...</p></div>}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex gap-2 p-1 glass-card rounded-xl w-fit">
            {["hooks","formulas","bank","words"].map(t=>(
              <button key={t} onClick={()=>setActiveTab(t)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize ${activeTab===t?"gradient-bg-cyan text-white":"text-zinc-400"}`}>{t}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab==="hooks" && (
              <motion.div key="hooks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={()=>setFilterStyle(null)} className={`px-3 py-1 rounded-xl text-xs ${!filterStyle?"bg-white/10":"border border-white/5"}`}>All</button>
                  {hookStyles.map(s=>(
                    <button key={s} onClick={()=>setFilterStyle(filterStyle===s?null:s)} className={`px-3 py-1 rounded-xl text-xs capitalize ${filterStyle===s?"bg-amber-500/20 text-amber-300 border border-amber-500/30":"border border-white/5 text-zinc-400"}`}>{s}</button>
                  ))}
                </div>
                {filteredHooks.map((h, i) => (
                  <div key={i} className="glass-card p-5 rounded-2xl flex gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 rounded-lg text-[10px] border border-white/10 uppercase font-black">{h.style}</span>
                        <span className="px-2 py-1 rounded-lg text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">{h.estimated_retention} ret</span>
                      </div>
                      <p className="text-xl font-black text-zinc-100 mb-2">"{h.text}"</p>
                      <p className="text-xs text-zinc-500"><b className="text-zinc-400">Why:</b> {h.why_it_works}</p>
                      {h.visual_pairing && <p className="text-xs text-zinc-500 mt-1"><b className="text-cyan-400">Visual:</b> {h.visual_pairing}</p>}
                      {h.a_b_variant && <p className="text-xs mt-2 text-amber-300 italic text-[10px]">A/B: "{h.a_b_variant}"</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={()=>copy(h.text, `h${i}`)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10">{copied===`h${i}`?<Check size={14} className="text-emerald-400"/>:<Copy size={14}/>}</button>
                      <button onClick={()=>toggleSave(i)} className={`p-2 rounded-lg ${saved.includes(i)?"bg-amber-500/20 text-amber-400":"bg-white/5 hover:bg-white/10"}`}><Star size={14} fill={saved.includes(i)?"currentColor":"none"}/></button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab==="formulas" && (
              <motion.div key="formulas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.hook_formulas?.map((f,i)=>(
                  <div key={i} className="glass-card p-5 rounded-2xl">
                    <p className="font-bold text-zinc-200 mb-2">{f.formula}</p>
                    <p className="text-sm text-zinc-500 italic mb-2">"{f.example}"</p>
                    <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-1 rounded-md">Best for: {f.best_for}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab==="bank" && (
              <motion.div key="bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass-card p-5 rounded-2xl space-y-2">
                  <h3 className="font-bold text-zinc-300 mb-3 block">Opening Lines</h3>
                  {result.opening_lines_bank?.map((x,i)=><div key={i} className="p-3 border border-white/5 rounded-xl text-sm">"{x}"</div>)}
                </div>
                <div className="glass-card p-5 rounded-2xl">
                  <h3 className="font-bold text-zinc-300 mb-3 block">Pattern Interrupts</h3>
                  <div className="flex flex-wrap gap-2">{result.pattern_interrupts?.map((x,i)=><span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-300 rounded-xl text-xs">{x}</span>)}</div>
                </div>
              </motion.div>
            )}

            {activeTab==="words" && (
              <motion.div key="words" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl">
                <div className="flex flex-wrap gap-2">{result.power_words?.map((w,i)=><span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-xl text-sm font-bold">{w}</span>)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
