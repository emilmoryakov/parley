import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import Sidebar from "@/components/sidebar/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parley — a small chat",
  description: "A small chat interface built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-[#07070b] font-sans text-zinc-200 antialiased">
        {/* Drifting aurora backdrop */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="aurora-blob aurora-blob--1" />
          <div className="aurora-blob aurora-blob--2" />
          <div className="aurora-blob aurora-blob--3" />
        </div>

        {/* Floating glass app card. The sidebar lives in the layout so it stays
            mounted across conversation navigation (and only fetches once). The
            active page renders into the second column. QueryProvider gives every
            client component access to the shared TanStack Query cache. */}
        <QueryProvider>
          <div className="relative mx-auto flex h-[100dvh] max-w-[1440px] p-0 sm:p-4 lg:p-6">
            <div className="grid h-full w-full grid-cols-1 overflow-hidden rounded-none border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/60 backdrop-blur-2xl sm:rounded-3xl md:grid-cols-[300px_1fr]">
              <Sidebar />
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
