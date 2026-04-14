"use client";

import React from "react";
import { motion } from "framer-motion";
import { apexTheme } from "@/styles/theme";
import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  category?: keyof typeof apexTheme.categories;
  icon?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  category,
  icon
}) => {
  const categoryColor = category ? apexTheme.categories[category] : null;
  const color = categoryColor || apexTheme.colors;

  return (
    <div className="glass-card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{
                   background: categoryColor?.glow || apexTheme.colors.brandGlow,
                   boxShadow: `0 0 8px -2px ${categoryColor?.glow || apexTheme.colors.brandGlow}`
                 }}>
              {React.cloneElement(icon as React.ReactElement, {
                size: 16,
                className: "text-white"
              })}
            </div>
          )}
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {title}
          </h3>
        </div>
      </div>
      <div className="h-48">
        {children}
      </div>
    </div>
  );
};

interface MetricDisplayProps {
  value: string | number;
  label: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  category?: keyof typeof apexTheme.categories;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  label,
  trend,
  trendValue,
  category
}) => {
  const categoryColor = category ? apexTheme.categories[category] : null;

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-black text-white mb-1"
      >
        {value}
      </motion.div>
      <div className="text-xs text-[--text-3] uppercase tracking-wider mb-2">
        {label}
      </div>
      {trend && trendValue && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          trend === "up" ? "bg-emerald-900/50 text-emerald-400" :
          trend === "down" ? "bg-rose-900/50 text-rose-400" :
          "bg-gray-700/50 text-gray-400"
        }`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </div>
      )}
    </div>
  );
};

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  category?: keyof typeof apexTheme.categories;
  showValue?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 60,
  strokeWidth = 6,
  category,
  showValue = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (progress / max) * circumference;

  const categoryColor = category ? apexTheme.categories[category] : null;
  const color = categoryColor || apexTheme.colors;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={categoryColor?.primary || apexTheme.colors.brand}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

interface AIStatusIndicatorProps {
  status: "idle" | "processing" | "completed" | "error";
  label: string;
  size?: "sm" | "md" | "lg";
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  status,
  label,
  size = "md"
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const getStatusStyles = () => {
    switch (status) {
      case "processing":
        return {
          color: "bg-yellow-400",
          pulse: "animate-pulse",
          glow: "shadow-0 0 8px rgba(245,158,11,0.7)"
        };
      case "completed":
        return {
          color: "bg-green-400",
          pulse: "",
          glow: "shadow-0 0 8px rgba(16,185,129,0.7)"
        };
      case "error":
        return {
          color: "bg-red-400",
          pulse: "",
          glow: "shadow-0 0 6px rgba(244,63,94,0.6)"
        };
      default: // idle
        return {
          color: "bg-gray-500",
          pulse: "",
          glow: ""
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full ${styles.color} ${styles.pulse} ${styles.glow}`}
      />
      <span className="text-xs font-medium text-[--text-2]">
        {label}
      </span>
    </div>
  );
};

interface ToolCategoryBadgeProps {
  category: keyof typeof apexTheme.categories;
  count: number;
  icon: React.ReactNode;
}

export const ToolCategoryBadge: React.FC<ToolCategoryBadgeProps> = ({
  category,
  count,
  icon
}) => {
  const categoryColor = apexTheme.categories[category];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 p-3 rounded-xl"
      style={{
        background: categoryColor.glow,
        border: `1px solid ${categoryColor.primary}`
      }}
    >
      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
           style={{ background: categoryColor.primary }}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 14,
          className: "text-white"
        })}
      </div>
      <div>
        <div className="text-xs font-bold text-white uppercase">
          {category}
        </div>
        <div className="text-xs text-[--text-3]">
          {count} tools
        </div>
      </div>
    </motion.div>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className = ""
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const start = 0;
    const end = value;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const currentValue = Math.floor(start + (end - start) * progress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return (
    <span className={`font-black text-white ${className}`}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};