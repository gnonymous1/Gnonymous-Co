"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Public routes that don't need the dashboard shell
  const isPublicRoute = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isPublicRoute) {
    return <div className="min-h-screen bg-[--canvas]">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--canvas)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
