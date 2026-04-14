Im"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { apexTheme } from "@/styles/theme";

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  category?: keyof typeof apexTheme.categories;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = "",
  gradient,
  glow = false,
  hoverEffect = true,
  category
}) => {
  // Determine card styling based on props
  const getCardStyle = () => {
    if (gradient) return gradient;
    if (category) {
      const catColor = apexTheme.categories[category];
      return `linear-gradient(145deg, ${catColor.glow} 0%, rgba(255,255,255,0.02) 100%)`;
    }
    return apexTheme.gradients.glass;
  };

  const getGlowEffect = () => {
    if (!glow) return "";
    if (category) {
      const catColor = apexTheme.categories[category];
      return `0 0 28px -8px ${catColor.glow}`;
    }
    return `0 0 28px -8px ${apexTheme.colors.brandGlow}`;
  };

  return (
    <motion.div
      className={`glass-card-elevated ${className}`}
      style={{
        background: getCardStyle(),
        boxShadow: getGlowEffect()
      }}
      whileHover={hoverEffect ? {
        y: -4,
        boxShadow: glow
          ? (category
              ? `0 0 48px -12px ${apexTheme.categories[category].glow}`
              : `0 0 48px -12px ${apexTheme.colors.brandGlowStrong}`)
          : undefined
      } : undefined}
      transition={{ duration: 0.4, ease: apexTheme.colors.easing.spring as any }}
    >
      {children}
    </motion.div>
  );
};

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  category?: keyof typeof apexTheme.categories;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  category,
  trend,
  trendValue
}) => {
  const categoryColor = category ? apexTheme.categories[category] : null;
  const color = categoryColor || apexTheme.colors;

  return (
    <EnhancedCard category={category} glow>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: categoryColor?.glow || apexTheme.colors.brandGlow,
                  boxShadow: `0 0 16px -4px ${categoryColor?.glow || apexTheme.colors.brandGlow}`
                }}
              >
                {React.cloneElement(icon as React.ReactElement, {
                  size: 18,
                  className: "text-white"
                })}
              </div>
            )}
            <div>
              <div className="text-3xl font-black text-white">
                {value}
              </div>
              <div className="text-xs font-bold text-[--text-3] uppercase tracking-wider mt-1">
                {label}
              </div>
            </div>
          </div>

          {trend && trendValue && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              trend === "up" ? "bg-emerald-900/50 text-emerald-400" :
              trend === "down" ? "bg-rose-900/50 text-rose-400" :
              "bg-gray-700/50 text-gray-400"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>
      </div>
    </EnhancedCard>
  );
};

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  gradient?: keyof typeof apexTheme.gradients;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  type = "button",
  gradient = "primary",
  size = "md",
  icon,
  disabled = false,
  className = ""
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const gradientStyle = apexTheme.gradients[gradient] || apexTheme.gradients.primary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${sizeClasses[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ background: gradientStyle }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {icon && React.cloneElement(icon as React.ReactElement, {
        size: size === "sm" ? 14 : size === "md" ? 16 : 18,
        className: "mr-2"
      })}
      {children}
    </motion.button>
  );
};