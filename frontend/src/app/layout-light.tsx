import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles/themes/light-modern.css";
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
  title: "Gnonymous Intelligence OS | Modern AI Platform",
  description: "Next-generation AI content operating system with clean, professional interface",
  keywords: ["Gnonymous", "AI Platform", "Modern UI", "Content OS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable} light`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}