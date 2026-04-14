import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error";
}

export function Toast({ variant = "default", className, children, ...props }: ToastProps) {
  const base = "rounded-2xl border p-4 text-sm shadow-lg";
  const variantClasses = {
    default: "border-white/10 bg-zinc-950 text-white",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/30 bg-red-500/10 text-red-200",
  };

  return (
    <div className={cn(base, variantClasses[variant], className)} role="status" {...props}>
      {children}
    </div>
  );
}
