import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Dialog({ title, className, children, ...props }: DialogProps) {
  return (
    <div className={cn("rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl shadow-black/30", className)} {...props}>
      {title && <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>}
      {children}
    </div>
  );
}
