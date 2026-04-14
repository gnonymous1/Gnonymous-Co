"use client";

import React from "react";
import CommandPalette from "@/components/ui/CommandPalette";
import { motion } from "framer-motion";

export default function UIDemoPage() {
  return (
    <div className="min-h-screen bg-[--canvas] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[--text-1] mb-8"
        >
          GNONYMOUS UI Demo
        </motion.h1>

        <div className="grid gap-6">
          {/* Command Palette Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-[--text-1] mb-4">Command Palette</h2>
            <p className="text-[--text-2] mb-4">
              Press <kbd className="px-2 py-1 bg-[--glass-fill] border border-[--glass-border] rounded text-[--text-3]">Cmd+K</kbd> to open the command palette
            </p>
            <div className="flex items-center gap-2">
              <CommandPalette />
            </div>
          </motion.div>

          {/* Design Tokens Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-[--text-1] mb-4">Design Tokens</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[--brand-primary]"></div>
                <span className="text-[--text-1]">Brand Primary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[--brand-secondary]"></div>
                <span className="text-[--text-1]">Brand Secondary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[--brand-tertiary]"></div>
                <span className="text-[--text-1]">Brand Tertiary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[--brand-accent]"></div>
                <span className="text-[--text-1]">Brand Accent</span>
              </div>
            </div>
          </motion.div>

          {/* Typography Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-[--text-1] mb-4">Typography</h2>
            <div className="space-y-3">
              <p className="t-display g-text">Display Text</p>
              <p className="t-hero">Hero Text</p>
              <p className="t-title">Title Text</p>
              <p className="t-subtitle">Subtitle Text</p>
              <p className="t-mono">Mono Text</p>
              <p className="t-label">Label Text</p>
            </div>
          </motion.div>

          {/* Buttons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-[--text-1] mb-4">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-danger">Danger</button>
              <button className="btn-icon">
                <span className="text-[--text-3]">🔍</span>
              </button>
            </div>
          </motion.div>

          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-[--text-1] mb-4">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-[--text-2]">Standard Card</p>
              </div>
              <div className="glass-card-elevated p-4 text-center">
                <p className="text-[--text-2]">Elevated Card</p>
              </div>
              <div className="glass-card-ultra p-4 text-center">
                <p className="text-[--text-2]">Ultra Card</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}