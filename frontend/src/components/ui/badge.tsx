import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-white/10 text-white",
    success: "bg-emerald-500/20 text-emerald-300",
    warning: "bg-amber-500/20 text-amber-300",
    danger: "bg-red-500/20 text-red-300",
  };

  return (
    <div className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", variantClasses[variant], className)} {...props} />
  );
}
