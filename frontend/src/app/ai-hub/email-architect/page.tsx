"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, AlertCircle, Copy, Check, Clock, BarChart3 } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


interface EmailItem {
  subject_line?: string;
  subject_line_b?: string;
  preview_text?: string;
  body?: string;
  cta_text?: string;
  send_day?: string;
  predicted_open_rate?: string;
}

interface EmailSequenceResult {
  sequence_strategy?: string;
  emails?: EmailItem[];
}

export default function EmailArchitectPage() {
  const { modelPreferences } = useGlobalStore();
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [seqLength, setSeqLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EmailSequenceResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeEmail, setActiveEmail] = useState(0);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<EmailSequenceResult>("/api/ai/email-sequence", {
        method: "POST",
        body: JSON.stringify({ goal: goal.trim(), audience: audience.trim() || "general", sequence_length: seqLength, model_pref: modelPreferences.ai_content }),
      });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to build email sequence.");
    } finally { setLoading(false); }
  };

  const copyText = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Email Marketing Architect</h1>
        <p className="text-zinc-500 text-sm">Generate cold email sequences and newsletter funnels with A/B subject line variants.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Campaign Goal</label>
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Convert free trial users to paid plan" className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div className="w-full lg:w-48">
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Target Audience</label>
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., SaaS founders" className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div className="w-full lg:w-32">
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Emails</label>
            <select value={seqLength} onChange={(e) => setSeqLength(Number(e.target.value))} className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none">
              {[3, 5, 7, 10].map((n) => <option key={n} value={n} className="bg-zinc-900">{n} emails</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={loading || !goal.trim()} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2 whitespace-nowrap">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Building...</> : <><Mail size={16} /> Build Sequence</>}
            </button>
          </div>
        </div>
      </motion.div>

      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Architecting email sequence...</p></div>}

      {result?.emails && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {result.sequence_strategy && (
            <div className="glass-card p-4 rounded-xl border border-violet-500/10">
              <p className="text-sm text-zinc-400">{result.sequence_strategy}</p>
            </div>
          )}
          {/* Email Timeline */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {result.emails.map((email, i: number) => (
              <button key={i} onClick={() => setActiveEmail(i)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeEmail === i ? "gradient-bg text-white" : "text-zinc-500 border border-white/8 hover:text-zinc-300"}`}>
                <Clock size={12} /> {email.send_day || `Day ${i + 1}`}
              </button>
            ))}
          </div>
          {/* Active Email */}
          {result.emails[activeEmail] && (
            <motion.div key={activeEmail} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-zinc-200 font-semibold">{result.emails?.[activeEmail]?.subject_line}</h3>
                  <p className="text-xs text-zinc-500 mt-1">A/B: {result.emails?.[activeEmail]?.subject_line_b || "N/A"}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Preview: {result.emails?.[activeEmail]?.preview_text}</p>
                </div>
                <div className="flex items-center gap-2">
                  {result.emails?.[activeEmail]?.predicted_open_rate && <span className="badge badge-easy text-xs"><BarChart3 size={10} className="mr-1" />{result.emails?.[activeEmail]?.predicted_open_rate}</span>}
                  <button onClick={() => copyText(result.emails?.[activeEmail]?.body || "", `email-${activeEmail}`)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                    {copied === `email-${activeEmail}` ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="border-t border-white/5 pt-4">
                <FormattedContent content={result.emails?.[activeEmail]?.body as string} />
              </div>
              {result.emails?.[activeEmail]?.cta_text && (
                <div className="mt-4"><span className="inline-block gradient-bg px-4 py-2 rounded-lg text-sm font-medium text-white">{result.emails?.[activeEmail]?.cta_text}</span></div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
