"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, Zap, Clock, Star, Settings, HelpCircle, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  category: "navigation" | "tools" | "recent" | "settings" | "help";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  popular?: boolean;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const paletteRef = useRef<HTMLDivElement>(null);

  // Command definitions
  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Dashboard",
      category: "navigation",
      icon: <ArrowRight size={16} />,
      shortcut: "⌘D",
      action: () => router.push("/dashboard"),
      popular: true
    },
    {
      id: "nav-seo",
      title: "SEO & Search",
      category: "navigation",
      icon: <Search size={16} />,
      action: () => router.push("/seo/serp-analyzer")
    },
    {
      id: "nav-youtube",
      title: "YouTube Tools",
      category: "navigation",
      icon: <Zap size={16} />,
      action: () => router.push("/youtube/rank-checker")
    },
    {
      id: "nav-tiktok",
      title: "TikTok & Reels",
      category: "navigation",
      icon: <Zap size={16} />,
      action: () => router.push("/tiktok/trend-scout")
    },
    {
      id: "nav-ai-hub",
      title: "AI Content Hub",
      category: "navigation",
      icon: <Star size={16} />,
      action: () => router.push("/ai-hub/thumbnail-studio")
    },

    // Tools
    {
      id: "tool-serp",
      title: "SERP Analyzer",
      category: "tools",
      icon: <Search size={16} />,
      action: () => router.push("/seo/serp-analyzer"),
      popular: true
    },
    {
      id: "tool-keyword",
      title: "Keyword Lab",
      category: "tools",
      icon: <Zap size={16} />,
      action: () => router.push("/seo/keyword-lab")
    },
    {
      id: "tool-rank-checker",
      title: "YouTube Rank Checker",
      category: "tools",
      icon: <ArrowRight size={16} />,
      action: () => router.push("/youtube/rank-checker")
    },
    {
      id: "tool-thumbnail",
      title: "Thumbnail Studio",
      category: "tools",
      icon: <Star size={16} />,
      action: () => router.push("/ai-hub/thumbnail-studio")
    },

    // Recent (would be populated dynamically in real app)
    {
      id: "recent-serp",
      title: "SERP Analyzer (Recent)",
      category: "recent",
      icon: <Clock size={16} />,
      action: () => router.push("/seo/serp-analyzer")
    },
    {
      id: "recent-keyword",
      title: "Keyword Lab (Recent)",
      category: "recent",
      icon: <Clock size={16} />,
      action: () => router.push("/seo/keyword-lab")
    },

    // Settings
    {
      id: "settings-theme",
      title: "Toggle Theme",
      category: "settings",
      icon: <Moon size={16} />,
      action: () => toggleTheme()
    },
    {
      id: "settings-models",
      title: "AI Models",
      category: "settings",
      icon: <Settings size={16} />,
      action: () => router.push("/settings/model-selection")
    },

    // Help
    {
      id: "help-docs",
      title: "Documentation",
      category: "help",
      icon: <HelpCircle size={16} />,
      action: () => window.open("https://docs.gnonymous.ai", "_blank")
    },
    {
      id: "help-support",
      title: "Support Center",
      category: "help",
      icon: <HelpCircle size={16} />,
      action: () => window.open("https://support.gnonymous.ai", "_blank")
    }
  ];

  // Filter commands based on search query
  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.category.includes(searchQuery.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open/close palette
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setSearchQuery("");
          setSelectedIndex(0);
        }
      }

      // Close palette
      if (isOpen && e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }

      // Navigate commands
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && filteredCommands.length > 0) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Close palette when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle theme function
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    // In a real app, you would also save this preference
    console.log("Theme toggled");
  };

  // Get category display names
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      navigation: "Navigation",
      tools: "Tools",
      recent: "Recent",
      settings: "Settings",
      help: "Help"
    };
    return names[category] || category;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      navigation: <ArrowRight size={14} />,
      tools: <Zap size={14} />,
      recent: <Clock size={14} />,
      settings: <Settings size={14} />,
      help: <HelpCircle size={14} />
    };
    return icons[category] || <ArrowRight size={14} />;
  };

  return (
    <>
      {/* Command Palette Trigger (always visible in top bar) */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSearchQuery("");
          setSelectedIndex(0);
        }}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[--text-3] hover:text-[--text-2] transition-all"
        style={{ background: "var(--glass-fill)", border: "1px solid var(--glass-border)" }}
      >
        <Search size={12} />
        <span>Search</span>
        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md text-[--text-4]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Command size={9} />K
        </span>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16"
          >
            <motion.div
              ref={paletteRef}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[--surface-1] rounded-2xl shadow-2xl border border-[--glass-border] overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-[--glass-border]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-3]" size={16} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search commands, tools, and navigation..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-[--glass-fill] border border-[--glass-border] rounded-lg text-[--text-1] placeholder-[--text-3] focus:outline-none focus:border-[--brand-hi] focus:ring-1 focus:ring-[--brand-glow]"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-2 py-1 bg-[--glass-fill-md] border border-[--glass-border] rounded text-[--text-4]">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Command Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                  <div key={category} className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[--text-4] uppercase tracking-wider">
                      {getCategoryIcon(category)}
                      <span>{getCategoryName(category)}</span>
                    </div>

                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                            isSelected
                              ? "bg-[--brand-glow] border border-[--brand-hi]"
                              : "hover:bg-[--glass-fill] text-[--text-2]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[--text-3] ${isSelected ? "text-[--brand-hi]" : ""}`}>
                              {command.icon}
                            </span>
                            <span className={isSelected ? "text-[--text-1] font-medium" : "text-[--text-2]"}>
                              {command.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {command.popular && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">
                                Popular
                              </span>
                            )}
                            {command.shortcut && (
                              <kbd className="text-[10px] px-1.5 py-0.5 bg-[--glass-fill-md] border border-[--glass-border] rounded text-[--text-4]">
                                {command.shortcut}
                              </kbd>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Empty state */}
                {filteredCommands.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-[--glass-fill] rounded-full flex items-center justify-center">
                      <Search size={24} className="text-[--text-3]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[--text-2] mb-2">No results found</h3>
                    <p className="text-sm text-[--text-3]">Try searching for something else</p>
                  </div>
                )}
              </div>

              {/* Footer with shortcuts */}
              <div className="p-3 border-t border-[--glass-border] bg-[--surface-2]">
                <div className="flex items-center justify-between text-[11px] text-[--text-3]">
                  <div className="flex items-center gap-4">
                    <kbd className="flex items-center gap-1 px-2 py-1 bg-[--glass-fill] border border-[--glass-border] rounded">
                      <Command size={10} /> K
                    </kbd>
                    <span>Search</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="flex items-center gap-1 px-2 py-1 bg-[--glass-fill] border border-[--glass-border] rounded">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="flex items-center gap-1 px-2 py-1 bg-[--glass-fill] border border-[--glass-border] rounded">
                      Enter
                    </kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <kbd className="flex items-center gap-1 px-2 py-1 bg-[--glass-fill] border border-[--glass-border] rounded">
                      ESC
                    </kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}