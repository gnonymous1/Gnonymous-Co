"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "@/stores/useGlobalStore";
import {
  Activity, Search, FlaskConical, Link2, LineChart, BarChart3,
  Settings, Key, SlidersHorizontal, UserCog, CirclePlay, Music,
  PenTool, Video, FileText, Bot, Building2, Store, Code2,
  ChevronDown, PanelLeftClose, PanelLeft, Plus, Rocket, Crown,
  DollarSign, Factory, Users, Lightbulb, Zap, Globe, Sparkles
} from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  tier?: "free" | "pro";
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Dashboard",
    icon: <Activity size={16} />,
    items: [
      { label: "Overview", href: "/dashboard", icon: <Activity size={14} /> },
    ],
  },
  {
    label: "Intelligence",
    icon: <Globe size={16} />,
    items: [
      { label: "SEO Analysis", href: "/seo/serp-analyzer", icon: <Search size={14} />, tier: "free" },
      { label: "Keyword Lab", href: "/seo/keyword-lab", icon: <FlaskConical size={14} />, tier: "free" },
      { label: "Backlink Audit", href: "/seo/backlink-auditor", icon: <Link2 size={14} />, tier: "pro" },
      { label: "Rank Tracker", href: "/seo/rank-tracker", icon: <LineChart size={14} />, tier: "pro" },
    ],
  },
  {
    label: "Content OS",
    icon: <PenTool size={16} />,
    items: [
      { label: "AI Writer", href: "/seo/ai-writer", icon: <FileText size={14} />, tier: "free" },
      { label: "Thumbnail Studio", href: "/ai-hub/thumbnail-studio", icon: <Video size={14} />, tier: "pro" },
      { label: "Script Generator", href: "/youtube/script-generator", icon: <CirclePlay size={14} />, tier: "pro" },
    ],
  },
  {
    label: "Analytics",
    icon: <BarChart3 size={16} />,
    items: [
      { label: "YouTube Analytics", href: "/youtube/rank-checker", icon: <CirclePlay size={14} />, tier: "pro" },
      { label: "TikTok Analytics", href: "/tiktok/trend-scout", icon: <Music size={14} />, tier: "pro" },
      { label: "Content ROI", href: "/monetize/content-roi", icon: <DollarSign size={14} />, tier: "pro" },
    ],
  },
  {
    label: "Enterprise",
    icon: <Building2 size={16} />,
    items: [
      { label: "Autopilot", href: "/autopilot", icon: <Bot size={14} />, tier: "pro" },
      { label: "Missions", href: "/missions", icon: <Rocket size={14} />, tier: "pro" },
      { label: "Agency Portal", href: "/agency", icon: <Building2 size={14} />, tier: "pro" },
    ],
  },
  {
    label: "Settings",
    icon: <Settings size={16} />,
    items: [
      { label: "API Keys", href: "/settings/api-keys", icon: <Key size={14} /> },
      { label: "AI Models", href: "/settings/model-selection", icon: <SlidersHorizontal size={14} /> },
      { label: "Workspace", href: "/settings/workspace", icon: <UserCog size={14} /> },
    ],
  },
];

export default function SidebarProfessional() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useGlobalStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Dashboard": true,
    "Intelligence": false,
    "Content OS": false,
    "Analytics": false,
    "Enterprise": false,
    "Settings": false,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen flex flex-col z-50 overflow-hidden flex-shrink-0 glass-sidebar"
    >
      {/* Logo Section */ }
      <div className="flex items-center h-16 px-4 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0" >
          <div className="w-4 h-4 rounded-sm bg-brand-primary shadow-brand" > </div>
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
              <div className="text-sm font-bold text-text-1">GNONYMOUS</div>
              <div className="text-xs text-text-3 font-medium mt-0.5">Enterprise AI</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-1 transition-colors text-text-3 hover:text-text-1 flex-shrink-0"
        >
          {sidebarCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* New Pipeline CTA - Only visible when expanded */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 flex-shrink-0"
          >
            <Link
              href="/factory/new"
              className="btn btn-primary w-full gap-2 px-3 py-2"
            >
              <Plus size={14} />
              New Pipeline
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {NAV_GROUPS.map((group) => {
          const isAnyActive = group.items.some(item => pathname === item.href);
          const isOpen = openGroups[group.label];

          return (
            <div key={group.label} className="mb-1">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.label)}
                title={sidebarCollapsed ? group.label : undefined}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 group
                  ${isAnyActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-text-2 hover:text-text-1 hover:bg-surface-1"}`}
              >
                <span className="flex-shrink-0">
                  {group.icon}
                </span>

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 text-left text-sm font-medium truncate"
                    >
                      {group.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!sidebarCollapsed && (
                  <motion.span
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.18 }}
                    className="flex-shrink-0 text-text-3"
                  >
                    <ChevronDown size={12} />
                  </motion.span>
                )}

                {isAnyActive && sidebarCollapsed && (
                  <span
                    className="absolute left-0 w-0.5 h-6 rounded-full"
                    style={{ backgroundColor: isAnyActive ? "#0ea5e9" : undefined }}
                  />
                )}
              </button>

              {/* Group Items */}
              <AnimatePresence>
                {isOpen && !sidebarCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-2 pr-1 pb-1 space-y-0.5">
                      {group.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            <Link
                              href={item.href}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 group/item
                                ${active
                                  ? "bg-brand-secondary/10 text-brand-secondary nav-active"
                                  : "text-text-2 hover:text-text-1 hover:bg-surface-1"}`}
                            >
                              <span className={`flex-shrink-0 ${active ? "text-brand-secondary" : "text-text-3 group-hover/item:text-text-2"}`}>
                                {item.icon}
                              </span>
                              <span className="truncate flex-1">{item.label}</span>
                              {item.tier === "pro" && (
                                <span className="badge badge-pro">PRO</span>
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer with Theme Switcher - Only visible when expanded */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-glass-border flex-shrink-0"
          >
            <div className="rounded-md bg-surface-1/50 border border-glass-border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-2">Mission Parameters</span>
                <ThemeSwitcher />
              </div>
              <div className="text-[10px] text-text-4 font-mono uppercase tracking-widest">Sovereign Control Active</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}