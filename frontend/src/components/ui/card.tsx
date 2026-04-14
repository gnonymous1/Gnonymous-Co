import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/5", className)}
      {...props}
    />
  );
}
