import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Marvel Universe | Cinematic Digital Experience",
  description:
    "Explore the Marvel Cinematic Universe like never before. Dive into interactive timelines, character profiles, and the multiverse in an immersive cinematic experience.",
  keywords: ["Marvel", "MCU", "Avengers", "Marvel Universe", "Timeline", "Multiverse"],
  openGraph: {
    title: "Marvel Universe | Cinematic Digital Experience",
    description: "An immersive journey through the Marvel Cinematic Universe.",
    type: "website",
  },
};

import { CursorProvider } from "@/lib/CursorContext";
import CustomCursor from "@/components/CustomCursor";
import CursorSwitcher from "@/components/CursorSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <CursorProvider>
          {/* Custom Marvel Cursors */}
          <CustomCursor />
          <CursorSwitcher />

          {/* Persistent cosmic background across all pages */}
          <div className="cosmic-bg" aria-hidden="true" />

          {/* Loading intro — plays once per session */}
          <LoadingScreen />

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="relative z-10 min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </CursorProvider>
      </body>
    </html>
  );
}
