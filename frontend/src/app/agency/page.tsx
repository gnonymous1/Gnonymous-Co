"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Plus, Users, BarChart3, FileText, Trash2,
  Edit3, ExternalLink, CheckCircle2, Clock, TrendingUp, DollarSign
} from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  niche: string;
  plan: "starter" | "growth" | "enterprise";
  monthlyValue: number;
  tasksCompleted: number;
  tasksTotal: number;
  status: "active" | "paused" | "onboarding";
  since: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "TechFlow Media", niche: "SaaS Marketing", plan: "enterprise", monthlyValue: 2500, tasksCompleted: 47, tasksTotal: 50, status: "active", since: "Jan 2026" },
  { id: "c2", name: "Bloom Fitness", niche: "Health & Wellness", plan: "growth", monthlyValue: 1200, tasksCompleted: 23, tasksTotal: 30, status: "active", since: "Feb 2026" },
  { id: "c3", name: "FinEdge Academy", niche: "Finance Education", plan: "starter", monthlyValue: 600, tasksCompleted: 8, tasksTotal: 20, status: "onboarding", since: "Apr 2026" },
  { id: "c4", name: "NomadBrand Co.", niche: "Travel & Lifestyle", plan: "growth", monthlyValue: 1200, tasksCompleted: 30, tasksTotal: 30, status: "active", since: "Mar 2026" },
];

const PLAN_COLORS = {
  starter: "bg-zinc-500/20 text-zinc-300",
  growth: "bg-violet-500/20 text-violet-300",
  enterprise: "bg-amber-500/20 text-amber-300",
};

const STATUS_COLORS = {
  active: "bg-emerald-500/20 text-emerald-400",
  paused: "bg-amber-500/20 text-amber-400",
  onboarding: "bg-blue-500/20 text-blue-400",
};

export default function AgencyPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNiche, setNewNiche] = useState("");

  const totalMRR = clients.reduce((sum, c) => sum + c.monthlyValue, 0);
  const activeClients = clients.filter(c => c.status === "active").length;
  const avgCompletion = Math.round(clients.reduce((sum, c) => sum + (c.tasksCompleted / c.tasksTotal) * 100, 0) / clients.length);

  const addClient = () => {
    if (!newName.trim()) return;
    const newClient: Client = {
      id: `c${Date.now()}`, name: newName, niche: newNiche || "General", plan: "starter",
      monthlyValue: 600, tasksCompleted: 0, tasksTotal: 20, status: "onboarding", since: "Apr 2026"
    };
    setClients(prev => [...prev, newClient]);
    setNewName(""); setNewNiche(""); setShowAdd(false);
  };

  const removeClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-100">Agency Dashboard</h1>
            <p className="text-zinc-500 text-sm">Manage client workspaces, reports, and white-label delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/agency/reports" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-sm flex items-center gap-2 border border-white/10">
            <FileText size={16} /> Reports
          </Link>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 font-bold text-sm flex items-center gap-2">
            <Plus size={16} /> Add Client
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly MRR", value: `$${totalMRR.toLocaleString()}`, icon: <DollarSign size={18} />, color: "text-emerald-400" },
          { label: "Active Clients", value: String(activeClients), icon: <Users size={18} />, color: "text-violet-400" },
          { label: "Avg Completion", value: `${avgCompletion}%`, icon: <BarChart3 size={18} />, color: "text-cyan-400" },
          { label: "Annual ARR", value: `$${(totalMRR * 12).toLocaleString()}`, icon: <TrendingUp size={18} />, color: "text-amber-400" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl">
            <div className={`${kpi.color} mb-2`}>{kpi.icon}</div>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Add client form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border border-amber-500/20">
          <h3 className="text-sm font-bold text-zinc-300 mb-4">New Client Workspace</h3>
          <div className="flex gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Client name"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm" />
            <input value={newNiche} onChange={e => setNewNiche(e.target.value)} placeholder="Niche (optional)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors text-sm" />
            <button onClick={addClient} className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-300 font-bold text-sm">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 font-bold text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Client table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Client Workspaces</h2>
        </div>
        <div className="divide-y divide-white/5">
          {clients.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="px-6 py-5 flex items-center gap-6 hover:bg-white/3 transition-colors group">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-zinc-400 shrink-0">
                {client.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-zinc-200">{client.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PLAN_COLORS[client.plan]}`}>{client.plan}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLORS[client.status]}`}>{client.status}</span>
                </div>
                <p className="text-xs text-zinc-500">{client.niche} · since {client.since}</p>
              </div>
              <div className="w-32 hidden md:block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Tasks</span>
                  <span className="text-zinc-300 font-bold">{client.tasksCompleted}/{client.tasksTotal}</span>
                </div>
                <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(client.tasksCompleted / client.tasksTotal) * 100}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-emerald-400 font-black">${client.monthlyValue}/mo</p>
                <p className="text-xs text-zinc-600">${(client.monthlyValue * 12).toLocaleString()}/yr</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/10 rounded-lg"><Edit3 size={14} className="text-zinc-400" /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg"><ExternalLink size={14} className="text-zinc-400" /></button>
                <button onClick={() => removeClient(client.id)} className="p-2 hover:bg-rose-500/20 rounded-lg"><Trash2 size={14} className="text-rose-400" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
