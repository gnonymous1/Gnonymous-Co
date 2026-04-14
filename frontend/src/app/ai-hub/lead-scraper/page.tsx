"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, AlertCircle, Globe, Mail, ExternalLink } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";


type LeadItem = {
  site_name?: string;
  domain?: string;
  url?: string;
  da?: string | number;
  contact_email?: string;
  outreach_template?: string;
};

type LeadScrapeResponse = {
  leads?: LeadItem[];
};

export default function LeadScraperPage() {
  const { modelPreferences } = useGlobalStore();
  const [niche, setNiche] = useState("");
  const [purpose, setPurpose] = useState("guest_post");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LeadScrapeResponse | null>(null);

  const handle = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiCall<LeadScrapeResponse>("/api/ai/lead-scrape", { method: "POST", body: JSON.stringify({ niche: niche.trim(), purpose, model_pref: modelPreferences.ai_content }) });
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to scrape leads.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">GBOB Lead Scraper</h1>
        <p className="text-zinc-500 text-sm">Find guest posting targets, audit their SEO, and generate outreach email templates.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1"><label className="text-xs font-medium text-zinc-400 mb-2 block">Niche / Industry</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., AI tools, digital marketing, SaaS" className="glass-input w-full px-4 py-3 rounded-xl text-sm" /></div>
          <div className="w-48"><label className="text-xs font-medium text-zinc-400 mb-2 block">Purpose</label><select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none"><option value="guest_post" className="bg-zinc-900">Guest Posting</option><option value="link_building" className="bg-zinc-900">Link Building</option><option value="partnerships" className="bg-zinc-900">Partnerships</option></select></div>
        </div>
        <button onClick={handle} disabled={loading || !niche.trim()} className="gradient-bg px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Scraping...</> : <><Users size={16} /> Find Leads</>}
        </button>
      </motion.div>
      {error && <div className="glass-card p-4 rounded-xl border border-rose-500/20 flex items-center gap-3"><AlertCircle size={18} className="text-rose-400" /><span className="text-sm text-rose-300">{error}</span></div>}
      {loading && <div className="flex flex-col items-center py-16"><div className="loading-orb mb-6" /><p className="text-zinc-400 text-sm">Finding guest post leads...</p></div>}
      {result?.leads && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{result.leads.length} Leads Found</h2>
          {result.leads.map((lead, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-5 rounded-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-zinc-200 font-semibold flex items-center gap-2">{lead.site_name || lead.domain} {lead.da && <span className="badge badge-info text-xs">DA: {lead.da}</span>}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><Globe size={10} /> {lead.url || lead.domain}</p>
                  {lead.contact_email && <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1"><Mail size={10} /> {lead.contact_email}</p>}
                </div>
                <a href={lead.url || "#"} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300"><ExternalLink size={14} /></a>
              </div>
              {lead.outreach_template && <div className="mt-3 p-3 rounded-xl bg-white/2 border border-emerald-500/10"><p className="text-xs text-emerald-400 mb-1">Outreach Template:</p><p className="text-sm text-zinc-400">{lead.outreach_template}</p></div>}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
