"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard, Loader2, AlertCircle, Film, Palette } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

interface StoryboardScene {
  duration?: string;
  timestamp?: string;
  narration?: string;
  script_segment?: string;
  visual_prompt?: string;
  image_prompt?: string;
  on_screen_text?: string;
}

interface StoryboardResponse {
  scenes?: StoryboardScene[];
}

export default function StoryboarderPage() {
  const { modelPreferences } = useGlobalStore();
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StoryboardResponse | null>(null);

  const handle = async () => {
    if (!script.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<StoryboardResponse>("/api/yt/storyboard", { method: "POST", body: JSON.stringify({ script: script.trim(), model_pref: modelPreferences.youtube }) });
      setResult(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to generate storyboard."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Script-to-Video Storyboarder</h1>
        <p className="text-zinc-500 text-sm">Break your video script into scenes with AI-generated image prompts per scene.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <label className="text-xs font-medium text-zinc-400 mb-2 flex items-center justify-between"><span>Paste Your Video Script</span><span className="text-zinc-600">{script.length} chars</span></label>
        <textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Paste your full video script here..." rows={8} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none mb-4" />
        <button onClick={handle} disabled={loading || !script.trim()} className="bg-gradient-to-br from-red-600 to-pink-600 px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Clapperboard size={16} /> Generate Storyboard</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Generating storyboard scenes...</p></div>}
      {result?.scenes && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {result.scenes.map((scene, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0"><Film size={18} /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-zinc-200">Scene {i + 1}</span>
                    <span className="badge badge-info text-xs">{scene.duration || "30s"}</span>
                    <span className="text-xs text-zinc-600">{scene.timestamp || ""}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{scene.narration || scene.script_segment}</p>
                  <div className="p-3 rounded-xl bg-white/2 border border-amber-500/10">
                    <p className="text-xs text-amber-400 mb-1 flex items-center gap-1"><Palette size={10} /> B-Roll / Image Prompt:</p>
                    <p className="text-sm text-zinc-300 italic">{scene.visual_prompt || scene.image_prompt}</p>
                  </div>
                  {scene.on_screen_text && <p className="text-xs text-cyan-400 mt-2">On-screen: &quot;{scene.on_screen_text}&quot;</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
