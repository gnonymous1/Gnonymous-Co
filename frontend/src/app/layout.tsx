import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apex Content OS | Professional AI Growth Suite",
  description: "The premium operating system for high-performance content creation, SEO intelligence, and AI-driven growth.",
  keywords: ["Apex Content OS", "AI Intelligence", "SEO Automation", "YouTube Growth", "Content Creation"],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable} dark`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
