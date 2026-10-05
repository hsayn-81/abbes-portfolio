"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutData as fallbackAbout } from "@/data/about";
import { Cpu, Zap, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const icons = [Cpu, Zap, Activity, ShieldCheck];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [aboutData, setAboutData] = useState<any>(fallbackAbout);

  // Fetch Dynamic Data from MongoDB
  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.headlineMain) {
          setAboutData(data);
        }
      })
      .catch((err) => console.log("Using fallback about data", err));
  }, []);

  // GSAP Scroll Reveals
  useEffect(() => {
    gsap.fromTo(
      ".about-item",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    gsap.fromTo(
      ".about-portrait",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      }
    );
  }, [aboutData]);

  // Scroll to Contact + focus name
  const handleChatWithMe = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const nameInput = document.querySelector(
          'input[placeholder*="John Doe"]'
        ) as HTMLInputElement;
        if (nameInput) nameInput.focus();
      }, 800);
    }
  };

  // Scroll to Projects
  const handleGoToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#080808] border-t border-white/5 pt-16 lg:pt-24 min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* ======================================= */}
      {/* TOP HEADER */}
      {/* ======================================= */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20">
        <div className="about-item flex justify-between items-center border-b border-white/10 pb-6 mb-8 lg:mb-20 pt-8 lg:pt-0">
          <span className="font-serif text-xl sm:text-2xl text-white tracking-widest uppercase">
            Abbes<span className="text-amber-400">.</span>
          </span>
          <a
            href={`mailto:${aboutData?.email || "contact@example.com"}`}
            className="text-[10px] sm:text-xs font-mono text-zinc-400 border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-white hover:text-black transition-colors rounded-sm uppercase tracking-widest"
          >
            {aboutData?.email || "contact@example.com"}
          </a>
        </div>
      </div>

      {/* ======================================= */}
      {/* MAIN CONTENT GRID */}
      {/* ======================================= */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20 flex-grow flex items-center pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 w-full items-center">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 flex flex-col justify-center relative z-20">
            <h2 className="about-item text-4xl sm:text-6xl lg:text-7xl font-serif text-white font-light uppercase tracking-tight leading-[0.95] mb-6 drop-shadow-2xl">
              {aboutData?.headlineMain || "SYSTEM"} <br />
              <span className="italic text-amber-400">
                {aboutData?.headlineAccent || "ARCHITECT."}
              </span>
            </h2>

            <p className="about-item text-zinc-400 font-mono text-xs sm:text-sm leading-relaxed mb-8 lg:mb-12 max-w-sm">
              {aboutData?.bio}
            </p>

            <div className="about-item flex flex-wrap items-center gap-4 sm:gap-6 mb-10 lg:mb-16">
              <button
                onClick={handleChatWithMe}
                className="bg-amber-400 text-black font-semibold text-xs font-mono px-5 py-3 sm:px-6 uppercase tracking-widest hover:bg-white transition-colors rounded-sm shadow-[0_0_20px_rgba(251,191,36,0.2)] active:scale-95"
              >
                {aboutData?.buttons?.primary || "CHAT WITH ME"}
              </button>

              <button
                onClick={handleGoToProjects}
                className="flex items-center gap-2 text-white text-xs font-mono uppercase tracking-widest hover:text-amber-400 transition-colors active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />{" "}
                {aboutData?.buttons?.secondary || "PROJECTS"}
              </button>
            </div>

            <div className="about-item flex gap-10 sm:gap-12">
              {aboutData?.stats?.map((stat: any) => (
                <div key={stat.id}>
                  <span className="text-3xl sm:text-4xl font-serif font-light text-amber-400 block mb-1 sm:mb-2 drop-shadow-md">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================= */}
          {/* MOBILE PORTRAIT — centered fixed box */}
          {/* ======================================= */}
          <div className="about-portrait lg:hidden relative w-full h-[420px] my-8 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-[340px] h-full">
              <Image
                src={aboutData?.portraitImage || "/images/me.png"}
                alt="Abbes Shkeir"
                fill
                className="object-contain object-center drop-shadow-[0_0_40px_rgba(0,0,0,0.85)]"
                priority
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center gap-8 sm:gap-12 pt-4 lg:pt-0 relative z-20">
            {aboutData?.capabilities?.map((cap: any, index: number) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={cap.id} className="about-item flex gap-4 sm:gap-6 group">
                  <div className="mt-1 shrink-0">
                    <Icon className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-serif uppercase tracking-widest mb-1.5 text-base sm:text-lg group-hover:text-amber-400 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-zinc-500 font-mono text-xs leading-relaxed max-w-xs group-hover:text-zinc-300 transition-colors">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================= */}
      {/* DESKTOP PORTRAIT — absolute middle box */}
      {/* ======================================= */}
      <div className="about-portrait hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 z-10 w-[480px] xl:w-[580px] pointer-events-none items-center justify-center">
        <div className="relative w-full h-[75%] max-h-[720px]">
          <Image
            src={aboutData?.portraitImage || "/images/me.png"}
            alt="Abbes Shkeir"
            fill
            className="object-contain object-center drop-shadow-[0_0_50px_rgba(0,0,0,0.7)]"
            priority
          />
        </div>
        {/* Soft bottom blend so it doesn't cut hard */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}