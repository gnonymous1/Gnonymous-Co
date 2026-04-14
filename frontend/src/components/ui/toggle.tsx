import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <label className={cn("inline-flex items-center gap-2", className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="h-6 w-12 rounded-full bg-white/10 transition-all duration-200 peer-checked:bg-indigo-500" />
    </label>
  );
}
