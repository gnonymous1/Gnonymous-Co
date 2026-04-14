"use client";
import React from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  category: string;
  color: string;
  icon: React.ReactNode;
}

export default function ModulePlaceholder({ title, description, category, color, icon }: PlaceholderProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </motion.div>
        <h1 className="text-2xl font-bold text-zinc-200 mb-2">{title}</h1>
        <p className="text-zinc-500 text-sm max-w-md mb-6">{description}</p>
        <div className="glass-card px-5 py-3 rounded-xl flex items-center gap-2">
          <Construction size={16} className="text-amber-500" />
          <span className="text-sm text-zinc-400">
            Module under construction — Phase 2+ deployment
          </span>
        </div>
        <div className="mt-4 badge badge-info text-xs">{category}</div>
      </motion.div>
    </div>
  );
}
