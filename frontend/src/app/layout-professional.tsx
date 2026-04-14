"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SidebarProfessional from "@/components/layout/SidebarProfessional";
import TopBar from "@/components/layout/TopBar";
import CommandPalette from "@/components/ui/CommandPalette";
import { useGlobalStore } from "@/stores/useGlobalStore";
import "@/styles/globals.css";
import "@/styles/themes/professional.css";

const inter = Inter({ subsets: ["latin"] });

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useGlobalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GNONYMOUS Intelligence OS | Enterprise AI Platform</title>
        <meta name="description" content="Enterprise-grade AI intelligence platform for sovereign data control and autonomous operations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased selection:bg-brand-primary/30`}>
        <div id="grid-overlay" />
        <div className={`flex h-screen overflow-hidden ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {/* Professional Sidebar */}
          <SidebarProfessional />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Professional Top Bar */}
            <TopBar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 bg-canvas">
              {/* Page Header */}
              <div className="mb-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-1 capitalize font-mono">
                      {pathname.split('/').filter(Boolean).join(' ') || 'Command Center'}
                    </h1>
                    <p className="text-text-3 mt-1 font-medium italic opacity-80">
                      // {getPageDescription(pathname)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="relative z-10 w-full max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Command Palette for quick navigation */}
        <CommandPalette />
      </body>
    </html>
  );
}

function getPageDescription(pathname: string): string {
  const descriptions: Record<string, string> = {
    '/dashboard': 'Global mission overview and system health telemetry.',
    '/seo/serp-analyzer': 'High-fidelity competitive search intelligence.',
    '/youtube/rank-checker': 'Strategic video multi-variant performance analysis.',
    '/ai-hub/thumbnail-studio': 'Generative visual architecture for clinical CTR optimization.',
    '/settings/api-keys': 'Cryptographic credential and infrastructure management.',
    '/autopilot': 'Autonomous intelligence orchestration and neural processing.',
    '/missions': 'Contextual strategic workflows for targeted data acquisition.',
    '/agency': 'Multi-tenant operation monitoring and white-label distribution.',
  };

  return descriptions[pathname] || 'Enterprise AI intelligence platform initialization.';
}