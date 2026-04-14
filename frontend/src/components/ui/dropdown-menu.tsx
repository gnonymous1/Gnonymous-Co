import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenu({ className, children, ...props }: DropdownMenuProps) {
  return (
    <div className={cn("relative inline-block text-left", className)} {...props}>
      {children}
    </div>
  );
}
