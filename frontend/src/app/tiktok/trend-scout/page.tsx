"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Loader2, AlertCircle, TrendingUp, Hash, Headphones, Clapperboard, Globe, Copy, Check, RefreshCw, Zap, Clock, Star, ChevronRight } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";

const categories = ["general","comedy","education","fitness","tech","beauty","food","finance","lifestyle","gaming","travel","crypto","pets","motivation"];
const regions = [{ code: "us", name: "🇺🇸 USA" }, { code: "uk", name: "🇬🇧 UK" }, { code: "in", name: "🇮🇳 India" }, { code: "de", name: "🇩🇪 Germany" }, { code: "br", name: "🇧🇷 Brazil" }, { code: "pk", name: "🇵🇰 Pakistan" }];

interface TrendScoutResponse {
  trending_audios?: { name: string; artist: string; usage_count: string | number; trend_velocity: string; ranking_keyword?: string; best_content_type?: string; expiry_estimate?: string }[];
  trending_hashtags?: { tag: string; views: string | number; growth: string; relevance_score?: number; competition?: string }[];
  trending_formats?: { format: string; description: string; ranking_tagline?: string; seo_description?: string; monetization_tier?: string; avg_views?: string; content_ideas?: string[] }[];
  high_traffic_keywords?: string[];
  trending_effects?: { effect: string; usage: string; tutorial_opportunity: boolean }[];
  niche_specific_trends?: { trend: string; urgency: string }[];
  content_calendar_suggestions?: { day: string; trend: string; optimal_time: string }[];
  recommendation?: string;
}

export default function TrendScoutPage() {
  const { modelPreferences } = useGlobalStore();
  const [category, setCategory] = useState("general");
  const [region, setRegion] = useState("us");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrendScoutResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"formats"|"audios"|"hashtags"|"calendar"|"strategy">("formats");
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const handleScout = useCallback(async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<TrendScoutResponse>("/api/tt/trends", { method: "POST", body: JSON.stringify({ category, country: region, model_pref: modelPreferences.tiktok }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed."); } finally { setLoading(false); }
  }, [category, region, modelPreferences.tiktok]);

  React.useEffect(() => { handleScout(); }, []);

  const copy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1500); };
  const toggleSave = (t: string) => setSaved(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const tabs = [
    { id: "formats" as const, label: "Formats", icon: <Clapperboard size={13} /> },
    { id: "audios" as const, label: "Audio", icon: <Headphones size={13} /> },
    { id: "hashtags" as const, label: "Hashtags", icon: <Hash size={13} /> },
    { id: "calendar" as const, label: "Calendar", icon: <Clock size={13} /> },
    { id: "strategy" as const, label: "Strategy", icon: <Zap size={13} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1">Viral Trend Engine <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 rounded-full border border-cyan-500/20">LIVE</span></h1>
          <p className="text-zinc-500 text-sm">Real-time TikTok algorithmic intelligence — {category} · {region.toUpperCase()}</p>
        </div>
        <div className="flex gap-3 items-center">
          {saved.length > 0 && <div className="flex items-center gap-1.5 px-3 py-2 glass-card rounded-xl"><Star size={13} className="text-amber-400" /><span className="text-xs text-amber-400 font-bold">{saved.length} saved</span></div>}
          <button onClick={handleScout} disabled={loading} className="gradient-bg-cyan px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={15} className="animate-spin" />Scanning...</> : <><RefreshCw size={15} />Re-Scout</>}
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 rounded-2xl space-y-4">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Niche Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${category === c ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-zinc-600 hover:text-zinc-400 border border-white/5"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe size={14} className="text-zinc-500" />
          <div className="flex gap-2 flex-wrap">
            {regions.map(r => (
              <button key={r.code} onClick={() => setRegion(r.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${region === r.code ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "text-zinc-600 hover:text-zinc-400 border border-white/5"}`}>{r.name}</button>
            ))}
          </div>
        </div>
      </motion.div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}

      {loading && (
        <div className="flex flex-col items-center py-24">
          <div className="loading-orb mb-6" />
          <p className="text-zinc-400 text-sm animate-pulse">Scanning viral trajectories in {region.toUpperCase()}...</p>
          <div className="flex gap-6 mt-4 text-xs text-zinc-600"><span>• Analyzing audios</span><span>• Mapping hashtags</span><span>• Detecting formats</span></div>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {result.high_traffic_keywords && (
            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Keyword Cloud</h3>
                <button onClick={() => copy(result.high_traffic_keywords!.join(", "), "all-kw")} className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1">
                  {copied === "all-kw" ? <><Check size={10} className="text-emerald-400" />Copied</> : <><Copy size={10} />Copy All</>}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.high_traffic_keywords.map((kw, i) => (
                  <button key={i} onClick={() => copy(kw, `kw-${i}`)}
                    className="px-3 py-1.5 rounded-xl bg-violet-500/5 border border-violet-500/10 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors flex items-center gap-1.5">
                    {kw}{copied === `kw-${i}` ? <Check size={9} className="text-emerald-400" /> : <Copy size={9} className="opacity-0 hover:opacity-100" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.niche_specific_trends && result.niche_specific_trends.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.niche_specific_trends.slice(0,3).map((t, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2"><Zap size={13} className="text-amber-400" /><span className="text-[10px] font-black text-amber-400 uppercase">{t.urgency}</span></div>
                  <p className="text-sm font-semibold text-zinc-200">{t.trend}</p>
                  <button onClick={() => toggleSave(t.trend)} className={`mt-2 text-[10px] flex items-center gap-1 ${saved.includes(t.trend) ? "text-amber-400" : "text-zinc-600"}`}>
                    <Star size={9} fill={saved.includes(t.trend) ? "currentColor" : "none"} />{saved.includes(t.trend) ? "Saved" : "Save"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "gradient-bg-cyan text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "formats" && (
              <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-white/5"><h3 className="text-xs font-bold flex items-center gap-2"><Clapperboard size={13} className="text-amber-400" />Viral Format Architecture</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-zinc-950/50">
                      {["Format","Hook","SEO Description","Views","Revenue","Ideas"].map(h => <th key={h} className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {result.trending_formats?.map((f, i) => (
                        <tr key={i} className="hover:bg-white/1 group">
                          <td className="px-5 py-4"><p className="text-sm font-bold text-amber-300">{f.format}</p><p className="text-[10px] text-zinc-600 mt-1">{f.description}</p></td>
                          <td className="px-5 py-4">
                            <div className="p-2 rounded-xl bg-zinc-950 border border-white/5 group-hover:border-amber-500/20 max-w-[200px]">
                              <p className="text-[11px] italic text-zinc-200">"{f.ranking_tagline}"</p>
                              <button onClick={() => copy(f.ranking_tagline||"", `tag-${i}`)} className="mt-1 text-[9px] text-zinc-600 hover:text-emerald-400 flex items-center gap-1">
                                {copied===`tag-${i}` ? <><Check size={8}/>Copied</> : <><Copy size={8}/>Copy</>}
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-4 max-w-[140px]"><p className="text-[10px] text-zinc-400 font-mono">{f.seo_description}</p></td>
                          <td className="px-5 py-4"><span className="text-sm font-bold text-cyan-400">{f.avg_views||"100K+"}</span></td>
                          <td className="px-5 py-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${f.monetization_tier==="High"?"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20":"bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"}`}>{f.monetization_tier||"Mid"}</span></td>
                          <td className="px-5 py-4"><div className="space-y-1">{f.content_ideas?.slice(0,2).map((idea,j)=><p key={j} className="text-[10px] text-zinc-500 flex items-center gap-1"><ChevronRight size={8}/>{idea}</p>)}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "audios" && (
              <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 rounded-3xl">
                <h3 className="font-bold text-cyan-300 mb-4 text-xs flex items-center gap-2 uppercase"><Headphones size={13}/>Trending Audio Intelligence</h3>
                <div className="space-y-3">
                  {result.trending_audios?.map((audio, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/3 border border-white/4 group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-black text-cyan-400">#{i+1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{audio.name}</p>
                          <p className="text-[10px] text-zinc-500">{audio.artist} · {audio.usage_count} uses</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {audio.ranking_keyword && <span className="text-[9px] text-cyan-400 font-bold">🔑 {audio.ranking_keyword}</span>}
                            {audio.best_content_type && <span className="text-[9px] text-violet-400">📹 {audio.best_content_type}</span>}
                            {audio.expiry_estimate && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">⏱ {audio.expiry_estimate}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${audio.trend_velocity==="Rising"?"bg-emerald-500 text-white":audio.trend_velocity==="Declining"?"bg-rose-500/20 text-rose-400":"bg-zinc-800 text-zinc-400"}`}>{audio.trend_velocity}</span>
                        <button onClick={() => toggleSave(audio.name)} className={`text-[9px] flex items-center gap-1 ${saved.includes(audio.name)?"text-amber-400":"text-zinc-600"}`}>
                          <Star size={9} fill={saved.includes(audio.name)?"currentColor":"none"}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "hashtags" && (
              <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-bold flex items-center gap-2"><Hash size={13} className="text-violet-400"/>Hashtag Matrix</h3>
                  <button onClick={() => copy(result.trending_hashtags?.map(h=>h.tag).join(" ")||"", "all-ht")} className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1">
                    {copied==="all-ht"?<><Check size={10} className="text-emerald-400"/>Copied!</>:<><Copy size={10}/>Copy All</>}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.trending_hashtags?.map((ht, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-violet-500/20 transition-all group">
                      <div>
                        <p className="text-sm font-bold text-violet-300">{ht.tag}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[10px] text-zinc-500">{ht.views} views</span>
                          <span className="text-[10px] text-emerald-400">{ht.growth}</span>
                          {ht.competition && <span className={`text-[10px] ${ht.competition==="Low"?"text-emerald-400":ht.competition==="High"?"text-rose-400":"text-amber-400"}`}>{ht.competition}</span>}
                        </div>
                        {ht.relevance_score && <div className="mt-2 w-full h-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-violet-500" style={{width:`${ht.relevance_score}%`}}/></div>}
                      </div>
                      <button onClick={() => copy(ht.tag, `ht-${i}`)} className="opacity-0 group-hover:opacity-100 transition-all text-zinc-600 hover:text-white ml-2">
                        {copied===`ht-${i}`?<Check size={12} className="text-emerald-400"/>:<Copy size={12}/>}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "calendar" && (
              <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-3xl">
                <h3 className="text-xs font-bold mb-5 flex items-center gap-2"><Clock size={13} className="text-amber-400"/>Content Calendar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.content_calendar_suggestions?.map((cal, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-zinc-300">{cal.day}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{cal.optimal_time}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{cal.trend}</p>
                    </div>
                  ))}
                </div>
                {result.trending_effects && (
                  <div className="mt-6">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Trending Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.trending_effects.map((eff, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/5">
                          <span className="text-sm font-bold text-zinc-200">{eff.effect}</span>
                          <span className="text-[10px] text-zinc-500">{eff.usage}</span>
                          {eff.tutorial_opportunity && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Tutorial ✨</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "strategy" && (
              <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-3xl border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
                <h3 className="font-bold text-cyan-300 mb-4 text-xs flex items-center gap-2 uppercase"><Zap size={13}/>AI Dominance Strategy</h3>
                <div className="prose prose-invert prose-sm"><FormattedContent content={result.recommendation||""}/></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
