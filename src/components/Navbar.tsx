"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-[#080808]/85 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center group-hover:border-amber-400 group-hover:bg-amber-400/10 transition-all duration-300">
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-serif text-xl tracking-widest text-white uppercase">
              ABBASS<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-10 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
            <button
              onClick={() => scrollToSection("projects")}
              className="hover:text-amber-400 transition-colors"
            >
              [ 01 // PROJECTS ]
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-amber-400 transition-colors"
            >
              [ 02 // ABOUT ]
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-amber-400 transition-colors"
            >
              [ 03 // CONTACT ]
            </button>
          </nav>

          {/* RIGHT STATUS INDICATOR */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-zinc-400 tracking-wider uppercase border border-white/10 px-4 py-2 bg-[#080808]/50 backdrop-blur-sm rounded-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AVAILABLE FOR CONSULTING</span>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-amber-400 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* ======================================================== */}
      {/* MOBILE MENU OVERLAY */}
      {/* ======================================================== */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808]/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-8"
        }`}
      >
        <div className="pt-24 flex flex-col gap-8 text-2xl font-serif uppercase tracking-wider text-white">
          <button
            onClick={() => scrollToSection("projects")}
            className="text-left hover:text-amber-400 transition-colors border-b border-white/10 pb-4"
          >
            01 // PROJECTS
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-left hover:text-amber-400 transition-colors border-b border-white/10 pb-4"
          >
            02 // ABOUT
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-left hover:text-amber-400 transition-colors border-b border-white/10 pb-4"
          >
            03 // CONTACT
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono text-zinc-500 uppercase tracking-widest border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400">OPEN FOR CONSULTING</span>
          </div>
          <div>LEBANON / GLOBAL REMOTE</div>
        </div>
      </div>
    </>
  );
}