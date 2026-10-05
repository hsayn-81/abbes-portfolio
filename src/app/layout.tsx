import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-serif",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "M. ABBAS SHKEIR — Electrical Engineer & Systems Architect",
  description: "High-end portfolio of M. Abbas Shkeir, Electrical Engineer specializing in High-Voltage Power Systems, SCADA Automation, and Embedded Hardware Engineering.",
  keywords: ["Electrical Engineer", "Power Systems", "SCADA", "Embedded Hardware", "PCB Design", "Abbas Shkeir", "Lebanon Engineer"],
  authors: [{ name: "M. Abbas Shkeir" }],
  openGraph: {
    title: "M. ABBAS SHKEIR — Electrical Engineer",
    description: "Architecting Intelligent Power Grids & Precision Hardware.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-[#080808] text-[#eaeaea] antialiased selection:bg-amber-400 selection:text-black">
        <SmoothScroll>
          <Cursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}