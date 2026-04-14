import * as React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <table className={cn("min-w-full divide-y divide-white/10 text-sm text-left", className)} {...props}>
      {children}
    </table>
  );
}
