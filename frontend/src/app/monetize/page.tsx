"use client";
import React from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, BarChart3, Layers, CreditCard, PieChart, Activity, Zap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function MonetizeDashboard() {
  const stats = [
    { label: "Total Estimated Value", value: "$124,500", trend: "+12.5%", color: "emerald" },
    { label: "Avg View RPM", value: "$4.80", trend: "+2.1%", color: "cyan" },
    { label: "Product Conversion", value: "1.24%", trend: "+0.4%", color: "violet" },
    { label: "Active Revenue Streams", value: "4", trend: "-", color: "amber" }
  ];

  const streams = [
    { name: "YouTube AdSense", amount: "$3,240", percentage: 45, color: "bg-red-500" },
    { name: "Affiliate Sales", amount: "$1,850", percentage: 25, color: "bg-emerald-500" },
    { name: "Digital Products", amount: "$1,450", percentage: 20, color: "bg-violet-500" },
    { name: "Sponsorships", amount: "$660", percentage: 10, color: "bg-amber-500" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2 mb-2"><DollarSign className="text-emerald-400" size={32}/> Monetization Brain</h1>
          <p className="text-zinc-500 text-base">Intelligent revenue tracking and prediction across all content streams.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 bg-${s.color}-500 group-hover:opacity-40 transition-opacity`}></div>
            <p className="text-xs font-bold uppercase text-zinc-500 mb-2">{s.label}</p>
            <p className="text-3xl font-black text-zinc-100 flex items-end gap-3">
              {s.value} 
              {s.trend !== "-" && <span className="text-xs font-bold text-emerald-400 flex items-center mb-1"><ArrowUpRight size={12}/>{s.trend}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2"><Activity size={18} className="text-cyan-400"/> Revenue Growth Trajectory</h3>
            <span className="text-xs text-zinc-500 border border-white/10 px-2 py-1 rounded">Last 6 Months</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 55, 45, 75, 60, 90].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-emerald-500/10 rounded-t-lg border-t border-emerald-500/30 relative hover:bg-emerald-500/20 transition-all" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black px-2 py-1 rounded font-bold">${h}k</div>
                </div>
                <span className="text-xs text-zinc-600 font-medium">M{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl">
          <h3 className="font-bold flex items-center gap-2 mb-6"><PieChart size={18} className="text-violet-400"/> Revenue Streams</h3>
          <div className="space-y-4">
            {streams.map((stream, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300 font-medium">{stream.name}</span>
                  <span className="text-zinc-100 font-bold">{stream.amount}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/5">
                  <div className={`h-full rounded-full ${stream.color}`} style={{ width: `${stream.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Niche Finder", desc: "Discover untapped, highly profitable content niches.", icon: <TrendingUp size={20} className="text-amber-400"/>, link: "/monetize/niche-finder" },
          { title: "Content ROI", desc: "Calculate the true monetary value of your traffic.", icon: <BarChart3 size={20} className="text-emerald-400"/>, link: "/monetize/content-roi" },
          { title: "Affiliate Hub", desc: "Build affiliate content and find high-converting offers.", icon: <Layers size={20} className="text-cyan-400"/>, link: "/monetize/affiliate" }
        ].map((tool, i) => (
          <Link href={tool.link} key={i}>
            <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-3xl h-full border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{tool.title}</h3>
              <p className="text-sm text-zinc-500">{tool.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
