"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Loader2, AlertCircle } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type AuditIssue = {
  title?: string;
  description?: string;
  severity?: "high" | "medium" | "low" | string;
} | string;

type TechnicalAuditResponse = {
  scores?: {
    performance?: number;
    seo?: number;
    accessibility?: number;
    best_practices?: number;
  };
  issues?: AuditIssue[];
  recommendation?: string;
};

export default function TechnicalAuditPage() {
  const { modelPreferences } = useGlobalStore();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TechnicalAuditResponse | null>(null);

  const handle = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<TechnicalAuditResponse>("/api/seo/tech-audit", { method: "POST", body: JSON.stringify({ url: url.trim(), model_pref: modelPreferences.seo }) });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run audit");
    } finally { setLoading(false); }
  };

  const ScoreRing = ({ score, label, color }: { score: number; label: string; color: string }) => (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80"><circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" /><circle cx="40" cy="40" r="35" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${score * 2.2} ${220 - score * 2.2}`} strokeLinecap="round" /></svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold" style={{ color }}>{score}</span>
      </div>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Technical SEO Audit</h1>
        <p className="text-zinc-500 text-sm">Analyze site speed, mobile-friendliness, schema markup, and Core Web Vitals.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex-1"><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handle()} placeholder="https://yoursite.com" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <button onClick={handle} disabled={loading} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Auditing...</> : <><Gauge size={16} /> Run Audit</>}
          </button>
        </div>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Running technical audit...</p></div>}
      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-6 rounded-2xl flex justify-around">
            <ScoreRing score={result.scores?.performance || 75} label="Performance" color="#10b981" />
            <ScoreRing score={result.scores?.seo || 85} label="SEO" color="#8b5cf6" />
            <ScoreRing score={result.scores?.accessibility || 90} label="Accessibility" color="#06b6d4" />
            <ScoreRing score={result.scores?.best_practices || 80} label="Best Practices" color="#f59e0b" />
          </div>
          {result.issues && (<div className="glass-card p-5 rounded-2xl"><h3 className="font-semibold text-rose-300 mb-3 text-sm">Issues Found</h3><div className="space-y-2">{result.issues.map((issue, i: number) => {
            const severity = typeof issue === "string" ? "medium" : issue.severity;
            const title = typeof issue === "string" ? issue : issue.title || "Untitled issue";
            const description = typeof issue === "string" ? "" : issue.description || "";
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3">
                <span className={`badge text-xs mt-0.5 ${severity === "high" ? "badge-hard" : severity === "medium" ? "badge-medium" : "badge-easy"}`}>{severity}</span>
                <div><p className="text-sm text-zinc-300">{title}</p><p className="text-xs text-zinc-500 mt-0.5">{description}</p></div>
              </div>
            );
          })}</div></div>)}
          {result.recommendation && <div className="glass-card p-5 rounded-2xl border border-violet-500/20"><h3 className="font-semibold text-violet-300 mb-2 text-sm">AI Recommendations</h3><p className="text-sm text-zinc-400 leading-relaxed">{result.recommendation}</p></div>}
        </motion.div>
      )}
    </div>
  );
}
