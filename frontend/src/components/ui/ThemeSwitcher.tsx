"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);

  // Use effect to handle client-side only logic
  useEffect(() => {
    setMounted(true);

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeToApply: string) => {
    // Remove all theme classes first
    document.documentElement.classList.remove("light", "dark");

    if (themeToApply === "light") {
      document.documentElement.classList.add("light");
    } else if (themeToApply === "dark") {
      document.documentElement.classList.add("dark");
    }
    // "system" will use the default (no class) or respect OS preference

    // Save preference
    localStorage.setItem("theme", themeToApply);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Light Theme Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded-lg transition-all ${
          theme === "light"
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Light theme"
      >
        <Sun size={16} />
      </motion.button>

      {/* Dark Theme Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded-lg transition-all ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Dark theme"
      >
        <Moon size={16} />
      </motion.button>

      {/* System Theme Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded-lg transition-all ${
          theme === "system"
            ? "bg-purple-100 text-purple-600"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="System theme"
      >
        <Monitor size={16} />
      </motion.button>
    </div>
  );
}