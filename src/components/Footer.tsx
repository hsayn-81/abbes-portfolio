"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contactData as fallbackContact } from "@/data/contact";
import { Send, Check, ArrowUpRight, Zap, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const [time, setTime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [contactData, setContactData] = useState(fallbackContact);
  
  const footerRef = useRef<HTMLElement>(null);

  // Live Time Clock (GMT+2 / Beirut Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Beirut",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Scroll Reveal
  useEffect(() => {
    gsap.fromTo(
      ".footer-item",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  // Submit Handler -> Connects to API & MongoDB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server Error: Database connection failed.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} id="contact" className="relative w-full bg-[#080808] border-t border-white/10 pt-24 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* TOP SECTION: Headline & Direct Quick Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-16 border-b border-white/10 gap-8">
          <div>
            <span className="footer-item text-xs font-mono text-amber-400 tracking-[0.3em] uppercase block mb-4">
              {contactData.tagline}
            </span>
            <h2 className="footer-item text-6xl sm:text-7xl lg:text-9xl font-serif text-white font-light tracking-tight uppercase leading-[0.85]">
              {contactData.headlineMain} <br />
              <span className="italic text-amber-400">{contactData.headlineAccent}</span>
            </h2>
          </div>

          {/* Quick Action Buttons */}
          <div className="footer-item flex flex-wrap gap-4">
            <a
              href={`mailto:${contactData.email}`}
              className="inline-flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:border-amber-400 hover:text-amber-400 transition-all rounded-sm"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>DIRECT EMAIL</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>

            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-amber-400 text-black text-xs font-mono font-semibold uppercase tracking-widest hover:bg-white transition-all rounded-sm shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            >
              <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 0 0-1.47 1.47c0 .81.66 1.47 1.47 1.47a1.47 1.47 0 0 0 1.47-1.47c0-.81-.66-1.47-1.47-1.47Z" />
              </svg>
              <span>LINKEDIN PROFILE</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* MIDDLE SECTION: Contact Form & Info */}
        <div className="py-16 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Transmission Form */}
          <div className="footer-item lg:col-span-7 bg-[#0c0c0c] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
              // DIRECT MESSAGE TRANSMISSION
            </span>
            <h3 className="text-2xl font-serif text-white uppercase tracking-wider mb-8 font-light">
              Send a Message to Dashboard
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">YOUR NAME *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" className="w-full bg-[#080808] border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">YOUR EMAIL *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. john@example.com" className="w-full bg-[#080808] border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">SUBJECT / DISCIPLINE</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Power Grid Consulting / Hardware Prototype" className="w-full bg-[#080808] border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">MESSAGE *</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Describe your project specs or inquiry..." className="w-full bg-[#080808] border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none" />
              </div>

              {/* Status Notifications */}
              {status === "error" && (
                <div className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-800/50 p-3">⚠️ {errorMessage}</div>
              )}
              {status === "success" && (
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-3 flex items-center gap-2"><Check className="w-4 h-4" /> Transmission logged! Message routed to the Dashboard.</div>
              )}

              <button type="submit" disabled={status === "submitting"} className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-400 text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-white transition-all disabled:opacity-50">
                {status === "submitting" ? <span>TRANSMITTING...</span> : <><Send className="w-4 h-4" /><span>TRANSMIT MESSAGE</span></>}
              </button>
            </form>
          </div>

          {/* Right: Info Card */}
          <div className="footer-item lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="bg-[#0c0c0c] border border-white/10 p-8 rounded-sm space-y-6">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">SYSTEM TELEMETRY</span>
              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-zinc-500">AVAILABILITY:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> OPEN FOR CONSULTING</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-zinc-500">BASE LOCATION:</span>
                  <span className="text-white">{contactData.location}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-zinc-500">LOCAL TIME:</span>
                  <span className="text-amber-400 font-bold">{time || "12:00:00"} GMT+2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">SECURITY:</span>
                  <span className="text-zinc-300">SSL ENCRYPTED</span>
                </div>
              </div>
            </div>
            <div className="p-8 border border-white/5 bg-zinc-950 text-xs font-mono text-zinc-500 leading-relaxed">
              <p>{contactData.subtext}</p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="footer-item pt-8 flex justify-between items-center text-[11px] font-mono text-zinc-600">
          <span>{contactData.copyright}</span>
          <button onClick={scrollToTop} className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-widest">
            <span>BACK TO TOP</span>
            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center"><Zap className="w-3 h-3 text-amber-400" /></div>
          </button>
        </div>

      </div>
    </footer>
  );
}