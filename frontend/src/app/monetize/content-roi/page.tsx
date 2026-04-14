"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useGlobalStore } from "@/stores/useGlobalStore";
import { apiCall } from "@/lib/utils";

export default function ContentROIPage() {
  const [views, setViews] = useState(100000);
  const [rpm, setRpm] = useState(5.50);
  const [conversionRate, setConversionRate] = useState(1.0);
  const [productPrice, setProductPrice] = useState(49);
  
  const adRevenue = (views / 1000) * rpm;
  const conversions = views * (conversionRate / 100);
  const productRevenue = conversions * productPrice;
  const totalRevenue = adRevenue + productRevenue;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1"><BarChart3 className="text-emerald-400"/> Content ROI Simulator</h1>
          <p className="text-zinc-500 text-sm">Calculate the true monetary value of your traffic.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-zinc-200 flex items-center gap-2"><Calculator size={16}/> Simulator Variables</h3>
            
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase block mb-2">Monthly Views</label>
              <input type="number" value={views} onChange={e=>setViews(Number(e.target.value))} className="glass-input w-full px-3 py-2 rounded-xl text-sm"/>
              <input type="range" min={1000} max={10000000} step={1000} value={views} onChange={e=>setViews(Number(e.target.value))} className="w-full mt-2 accent-emerald-500"/>
            </div>

            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase block mb-2">Ad RPM ($)</label>
              <input type="number" value={rpm} onChange={e=>setRpm(Number(e.target.value))} className="glass-input w-full px-3 py-2 rounded-xl text-sm"/>
              <input type="range" min={0.1} max={50} step={0.1} value={rpm} onChange={e=>setRpm(Number(e.target.value))} className="w-full mt-2 accent-emerald-500"/>
            </div>

            <div className="h-px bg-white/10 w-full my-4"></div>

            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase block mb-2">Conv. Rate (%)</label>
              <input type="number" value={conversionRate} onChange={e=>setConversionRate(Number(e.target.value))} className="glass-input w-full px-3 py-2 rounded-xl text-sm"/>
              <input type="range" min={0.01} max={10} step={0.01} value={conversionRate} onChange={e=>setConversionRate(Number(e.target.value))} className="w-full mt-2 accent-emerald-500"/>
            </div>

            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase block mb-2">Product Price ($)</label>
              <input type="number" value={productPrice} onChange={e=>setProductPrice(Number(e.target.value))} className="glass-input w-full px-3 py-2 rounded-xl text-sm"/>
            </div>

          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/20">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest text-center mb-2">Total Monthly Revenue</h3>
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-center mb-8">
              ${totalRevenue.toLocaleString(undefined, {maximumFractionDigits:0})}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <DollarSign size={24} className="text-amber-400 mx-auto mb-2"/>
                <p className="text-xs text-zinc-500 uppercase mb-1">Ad Revenue</p>
                <p className="text-2xl font-bold text-amber-400">${adRevenue.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                <p className="text-[10px] text-zinc-600 mt-2">from {views.toLocaleString()} views</p>
              </div>
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center">
                <TrendingUp size={24} className="text-violet-400 mx-auto mb-2"/>
                <p className="text-xs text-zinc-500 uppercase mb-1">Product Sales</p>
                <p className="text-2xl font-bold text-violet-400">${productRevenue.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                <p className="text-[10px] text-zinc-600 mt-2">from {conversions.toLocaleString()} sales</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center border-amber-500/10 bg-amber-500/5">
            <p className="text-zinc-300">If you increased your conversion rate by just <strong className="text-amber-400">0.5%</strong>, you would make <strong className="text-amber-400">${((views * ((conversionRate + 0.5) / 100)) * productPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</strong> extra per month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
