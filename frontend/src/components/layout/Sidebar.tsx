"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "@/stores/useGlobalStore";
import {
  LayoutDashboard, Search, FlaskConical, Link2, LineChart, BarChart3,
  Settings, Key, SlidersHorizontal, UserCog, CirclePlay, Music,
  PenTool, Video, FileText, Bot, Building2, Store, Code2,
  ChevronDown, PanelLeftClose, PanelLeft, Plus, Rocket, Crown,
  DollarSign, Factory, Users, Lightbulb, Zap, Globe, Sparkles,
  ShieldCheck, HelpCircle
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  tier?: "free" | "pro";
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Content Hub", href: "/ai-hub/humanizer", icon: PenTool },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "SEO Analyzer", href: "/seo/serp-analyzer", icon: Search },
      { label: "Keyword Lab", href: "/seo/keyword-lab", icon: FlaskConical },
      { label: "YouTube Intel", href: "/youtube/rank-checker", icon: CirclePlay },
      { label: "Social Signals", href: "/tiktok/trend-scout", icon: Music },
    ],
  },
  {
    label: "Strategy",
    items: [
      { label: "Guided Missions", href: "/missions", icon: Rocket, tier: "pro" },
      { label: "Autopilot", href: "/autopilot", icon: Bot, tier: "pro" },
      { label: "Marketplace", href: "/marketplace", icon: Store },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "API Vault", href: "/settings/api-keys", icon: Key },
      { label: "System Models", href: "/settings/model-selection", icon: SlidersHorizontal },
      { label: "Developer API", href: "/developers", icon: Code2, tier: "pro" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useGlobalStore();
  
  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex flex-col z-50 overflow-hidden flex-shrink-0 bg-surface-1 border-r border-white/5 shadow-xl"
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-5 flex-shrink-0 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Zap size={18} className="text-white fill-white" />
        </div>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="ml-3 flex-1 min-w-0"
            >
              <div className="text-sm font-bold text-white tracking-tight">APEX</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Content OS</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white"
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Primary Action */}
      {!sidebarCollapsed && (
        <div className="px-4 py-4">
          <Link href="/factory/new">
            <button className="btn btn-primary w-full shadow-emerald-900/40">
              <Plus size={16} /> New Asset
            </button>
          </Link>
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {group.label}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative
                      ${active 
                        ? "bg-emerald-500/10 text-emerald-400" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}
                  >
                    <item.icon size={18} className={active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"} />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {item.tier === "pro" && !sidebarCollapsed && (
                      <span className="badge badge-pro scale-90">PRO</span>
                    )}
                    {active && sidebarCollapsed && (
                      <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/5 bg-zinc-950/30">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : 'px-1'}`}>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
            JD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">John Doe</div>
              <div className="text-[10px] text-zinc-500 truncate">Enterprise Plan</div>
            </div>
          )}
          {!sidebarCollapsed && (
             <Link href="/settings/workspace">
                <Settings size={14} className="text-zinc-500 hover:text-white transition-colors cursor-pointer" />
             </Link>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
