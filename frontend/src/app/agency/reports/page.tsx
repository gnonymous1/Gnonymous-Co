"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, Users, BarChart3, Loader2, CheckCircle2, Building2 } from "lucide-react";

const CLIENTS = ["TechFlow Media", "Bloom Fitness", "FinEdge Academy", "NomadBrand Co."];
const REPORT_TYPES = [
  { id: "monthly", label: "Monthly Performance", description: "KPIs, content output, SEO rankings, channel growth", icon: <BarChart3 size={18} />, color: "text-violet-400" },
  { id: "competitor", label: "Competitor Audit", description: "Gap analysis vs. top 5 competitors across all platforms", icon: <Users size={18} />, color: "text-cyan-400" },
  { id: "seo", label: "SEO Health Report", description: "Keyword rankings, backlinks, page speed, technical audit", icon: <FileText size={18} />, color: "text-emerald-400" },
  { id: "content", label: "Content Calendar Summary", description: "30-day published content with engagement metrics", icon: <Calendar size={18} />, color: "text-amber-400" },
];

const GENERATED_REPORTS = [
  { client: "TechFlow Media", type: "Monthly Performance", date: "Apr 1, 2026", size: "2.4 MB", pages: 18 },
  { client: "Bloom Fitness", type: "SEO Health Report", date: "Mar 28, 2026", size: "1.8 MB", pages: 14 },
  { client: "NomadBrand Co.", type: "Competitor Audit", date: "Mar 15, 2026", size: "3.1 MB", pages: 22 },
];

export default function AgencyReportsPage() {
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [selectedType, setSelectedType] = useState("monthly");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [recentReports, setRecentReports] = useState(GENERATED_REPORTS);

  const generate = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 2800));
    setGenerating(false);
    setGenerated(true);
    const type = REPORT_TYPES.find(t => t.id === selectedType);
    setRecentReports(prev => [
      { client: selectedClient, type: type?.label || "Report", date: "Apr 13, 2026", size: "2.1 MB", pages: 16 },
      ...prev,
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
          <FileText size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-100">White-Label Reports</h1>
          <p className="text-zinc-500 text-sm">Generate branded PDF reports for your clients</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl space-y-5">
          <h2 className="font-bold text-zinc-200">Generate Report</h2>

          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest block mb-2">Client</label>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-amber-500 text-sm">
              {CLIENTS.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest block mb-2">Report Type</label>
            <div className="space-y-2">
              {REPORT_TYPES.map(rt => (
                <button key={rt.id} onClick={() => setSelectedType(rt.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    selectedType === rt.id ? "border-amber-500/40 bg-amber-500/5" : "border-white/10 bg-white/3 hover:bg-white/5"
                  }`}>
                  <span className={rt.color}>{rt.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{rt.label}</p>
                    <p className="text-xs text-zinc-500">{rt.description}</p>
                  </div>
                  {selectedType === rt.id && <CheckCircle2 size={16} className="text-amber-400 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={generating}
            className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 rounded-xl text-amber-300 font-bold flex items-center justify-center gap-2 transition-colors">
            {generating ? <><Loader2 size={16} className="animate-spin" /> Generating Report…</> :
             generated ? <><CheckCircle2 size={16} /> Generate New Report</> :
             <><FileText size={16} /> Generate PDF Report</>}
          </button>

          {generated && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-300">Report Ready</p>
                <p className="text-xs text-zinc-500">{selectedClient} · ~16 pages · 2.1 MB</p>
              </div>
              <button className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-300 text-sm font-bold flex items-center gap-2">
                <Download size={14} /> Download
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Recent reports */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl">
          <h2 className="font-bold text-zinc-200 mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {recentReports.map((r, i) => (
              <div key={i} className="p-4 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{r.client}</p>
                    <p className="text-xs text-zinc-500">{r.type} · {r.date}</p>
                    <p className="text-[10px] text-zinc-600">{r.pages} pages · {r.size}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg">
                  <Download size={14} className="text-amber-400" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
