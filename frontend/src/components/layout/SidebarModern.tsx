"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "@/stores/useGlobalStore";
import {
  Search, FlaskConical, Link2, LineChart, Gauge, MapPin, Target, Network,
  FileText, GitBranch, CirclePlay, Eye, Clapperboard, Image as Img, Tags,
  MessageCircle, Video, Tv2, Music, Zap, BarChart3, Trophy, Calendar,
  Captions, PenTool, Megaphone, BookOpen, Mail, Users, Lightbulb,
  RefreshCw, FileEdit, Mic2, User, Key, SlidersHorizontal, UserCog,
  Wallet, Archive, Crown, DollarSign, TrendingUp, Factory, Layers,
  Globe, Sparkles, Settings, Rocket, Bot, Building2, Store, Code2, Gift,
  ChevronDown, PanelLeftClose, PanelLeft, Plus, Activity,
} from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

interface NavItem { label: string; href: string; icon: React.ReactNode; badge?: string; }
interface NavGroup { label: string; icon: React.ReactNode; color: string; items: NavItem[]; }

const NAV: NavGroup[] = [
  {
    label: "Dashboard", icon: <Activity size={16} />, color: "var(--brand-primary)",
    items: [
      { label: "Overview", href: "/dashboard", icon: <Activity size={14} /> },
    ],
  },
  {
    label: "SEO & Search", icon: <Search size={16} />, color: "var(--brand-primary)",
    items: [
      { label: "SERP Analyzer",    href: "/seo/serp-analyzer",    icon: <Search size={14} /> },
      { label: "Keyword Lab",      href: "/seo/keyword-lab",      icon: <FlaskConical size={14} /> },
      { label: "Backlink Auditor", href: "/seo/backlink-auditor", icon: <Link2 size={14} /> },
      { label: "Rank Tracker",     href: "/seo/rank-tracker",     icon: <LineChart size={14} /> },
    ],
  },
  {
    label: "Content Creation", icon: <PenTool size={16} />, color: "var(--brand-secondary)",
    items: [
      { label: "AI Writer",        href: "/seo/ai-writer",        icon: <FileText size={14} /> },
      { label: "Thumbnail Studio", href: "/ai-hub/thumbnail-studio", icon: <Img size={14} /> },
      { label: "Script Generator",  href: "/youtube/script-generator", icon: <Video size={14} /> },
    ],
  },
  {
    label: "Analytics", icon: <BarChart3 size={16} />, color: "var(--brand-tertiary)",
    items: [
      { label: "YouTube Analytics", href: "/youtube/rank-checker", icon: <CirclePlay size={14} /> },
      { label: "TikTok Analytics",  href: "/tiktok/trend-scout",  icon: <Music size={14} /> },
      { label: "Content ROI",       href: "/monetize/content-roi", icon: <DollarSign size={14} /> },
    ],
  },
  {
    label: "Settings", icon: <Settings size={16} />, color: "var(--text-3)",
    items: [
      { label: "API Keys",        href: "/settings/api-keys",         icon: <Key size={14} /> },
      { label: "AI Models",       href: "/settings/model-selection",  icon: <SlidersHorizontal size={14} /> },
      { label: "Workspace",       href: "/settings/workspace",        icon: <UserCog size={14} /> },
    ],
  },
];

const defaultOpen: Record<string, boolean> = {
  "Dashboard": true,
  "SEO & Search": false,
  "Content Creation": false,
  "Analytics": false,
  "Settings": false,
};

export default function SidebarModern() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useGlobalStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpen);

  const toggle = (label: string) =>
    setOpenGroups(p => ({ ...p, [label]: !p[label] }));

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen sticky top-0 flex flex-col z-50 overflow-hidden flex-shrink-0 border-r border-[--border-light] bg-[--surface-0]"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 border-b border-[--border-light] flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-[--brand-primary]/10 border border-[--brand-primary]/20 flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 rounded bg-[--brand-primary]"></div>
        </div>

        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="ml-2.5 flex-1 min-w-0"
            >
              <div className="text-[13px] font-black tracking-tight leading-none text-[--brand-primary] font-mono">GNONYMOUS</div>
              <div className="text-[9px] text-[--text-3] font-medium mt-0.5 uppercase tracking-tighter">Modern AI</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[--surface-1] transition-colors text-[--text-3] hover:text-[--text-1] flex-shrink-0"
        >
          {sidebarCollapsed
            ? <PanelLeft size={14} />
            : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* New Pipeline CTA */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pt-3 pb-1 flex-shrink-0"
          >
            <Link href="/factory/new" className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-[--brand-primary] text-white text-[12px] font-bold hover:bg-[--brand-mid] transition-colors">
              <Plus size={13} />
              New Pipeline
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV.map((group) => {
          const isAnyActive = group.items.some(i => pathname === i.href);
          const isOpen = openGroups[group.label];

          return (
            <div key={group.label}>
              <button
                onClick={() => toggle(group.label)}
                title={sidebarCollapsed ? group.label : undefined}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-150 group
                  ${isAnyActive
                    ? "bg-[--brand-primary]/10 text-[--brand-primary]"
                    : "text-[--text-2] hover:text-[--text-1] hover:bg-[--surface-1]"
                  }`}
              >
                <span
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isAnyActive ? group.color : undefined }}
                >
                  {group.icon}
                </span>

                <AnimatePresence initial={false}>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex-1 text-left text-[11px] font-700 uppercase tracking-wider font-bold truncate"
                    >
                      {group.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!sidebarCollapsed && (
                  <motion.span
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.18 }}
                    className="flex-shrink-0 text-[--text-3]"
                  >
                    <ChevronDown size={12} />
                  </motion.span>
                )}

                {isAnyActive && sidebarCollapsed && (
                  <span
                    className="absolute left-0 w-0.5 h-5 rounded-full"
                    style={{ background: group.color }}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && !sidebarCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-2 pr-1 pb-1 space-y-0.5 mt-0.5">
                      {group.items.map((item, idx) => {
                        const active = pathname === item.href;
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.025, duration: 0.18 }}
                          >
                            <Link
                              href={item.href}
                              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all duration-150 group/item
                                ${active
                                  ? "bg-[--brand-primary]/20 text-[--brand-primary]"
                                  : "text-[--text-2] hover:text-[--text-1] hover:bg-[--surface-1]"
                                }`}
                            >
                              <span className={`nav-icon flex-shrink-0 ${active ? "" : "text-[--text-3] group-hover/item:text-[--text-2]"`
                                } style={active ? { color: group.color } : {}}>
                                {item.icon}
                              </span>
                              <span className="nav-text truncate flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="badge badge-primary text-[9px] shrink-0">{item.badge}</span>
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

      {/* Footer with Theme Switcher */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 border-t border-[--border-light] flex-shrink-0"
          >
            <div className="rounded-lg bg-[--surface-1] border border-[--border-light] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[--text-2]">Theme</span>
                <ThemeSwitcher />
              </div>
              <div className="text-[10px] text-[--text-3]">Customize your experience</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}