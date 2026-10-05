"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects as fallbackProjects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [projectList, setProjects] = useState<any[]>(fallbackProjects);

  // Fetch Projects from MongoDB API
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => console.log("Using fallback projects data", err));
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".project-header",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    const projectRows = gsap.utils.toArray(".project-row") as HTMLElement[];

    projectRows.forEach((row) => {
      const img = row.querySelector(".parallax-img") as HTMLElement;
      const content = row.querySelector(".project-content");
      const overlay = row.querySelector(".project-overlay") as HTMLElement;

      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -15, scale: 1.1 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (content) {
        gsap.fromTo(
          content,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 75%",
            },
          }
        );
      }

      if (img && overlay) {
        ScrollTrigger.create({
          trigger: row,
          start: "top 70%",
          end: "bottom 30%",
          onEnter: () => {
            img.classList.add("is-lit");
            overlay.classList.add("is-lit");
          },
          onEnterBack: () => {
            img.classList.add("is-lit");
            overlay.classList.add("is-lit");
          },
        });
      }
    });

    if (svgRef.current) {
      const wires = svgRef.current.querySelectorAll(".cable-wire");
      wires.forEach((wire, index) => {
        const path = wire as SVGPathElement;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom bottom",
            scrub: 1 + index * 0.2,
          },
        });
      });
    }
  }, [projectList]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#080808] w-full py-24 md:py-40 px-6 md:px-12 lg:px-20 border-t border-white/5 overflow-hidden"
    >
      {/* SVG CABLE BACKGROUND */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50">
        <svg ref={svgRef} viewBox="0 0 1000 3000" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="wireAmber" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="wireCyan" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="wireCopper" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
          </defs>
          <path className="cable-wire" d="M 800 0 C 900 400, 200 600, 300 1200 C 400 1800, 800 2200, 500 3000" fill="none" stroke="url(#wireCopper)" strokeWidth="4" filter="url(#neonGlow)" strokeLinecap="round" />
          <path className="cable-wire" d="M 780 0 C 850 350, 250 650, 280 1250 C 350 1750, 850 2150, 480 3000" fill="none" stroke="url(#wireCyan)" strokeWidth="2" filter="url(#neonGlow)" strokeLinecap="round" />
          <path className="cable-wire" d="M 820 0 C 950 450, 150 550, 320 1150 C 450 1850, 750 2250, 520 3000" fill="none" stroke="url(#wireAmber)" strokeWidth="2.5" filter="url(#neonGlow)" strokeLinecap="round" />
          <path className="cable-wire" d="M 790 0 C 880 400, 220 600, 290 1200 C 420 1800, 820 2200, 510 3000" fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#neonGlow)" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8">
        <div>
          <span className="project-header block text-xs font-mono text-amber-400 tracking-[0.3em] uppercase mb-4">
            [ 02 // SELECTED WORKS ]
          </span>
          <h2 className="project-header text-5xl md:text-7xl lg:text-8xl font-serif text-white font-light uppercase tracking-tight drop-shadow-2xl">
            ENGINEERING <br />
            <span className="italic text-zinc-500">ARCHIVE.</span>
          </h2>
        </div>
      </div>

      {/* PROJECTS LIST */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-32 md:space-y-48">
        {projectList.map((project, index) => (
          <div
            key={project._id}
            className="project-row group flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
          >
            <Link
              href={`/project/${project._id}`}
              className={`w-full lg:w-3/5 h-[50vh] md:h-[70vh] relative overflow-hidden rounded-sm bg-zinc-900 border border-white/5 shadow-2xl block ${
                index % 2 !== 0 ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="parallax-img object-cover filter grayscale contrast-125 transition-all duration-700 ease-out group-hover:grayscale-0 is-lit:grayscale-0"
              />
              <div className="project-overlay absolute inset-0 bg-black/40 transition-colors duration-700 group-hover:bg-black/10 is-lit:bg-black/10" />
            </Link>

            <div
              className={`project-content w-full lg:w-2/5 flex flex-col bg-[#080808]/60 backdrop-blur-md p-6 rounded-sm ${
                index % 2 !== 0 ? "lg:order-1" : ""
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono text-amber-400 border-b border-white/10 pb-4 mb-6">
                <span>INDEX // {project.index}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase font-light leading-[1.1] mb-6 group-hover:text-amber-300 transition-colors duration-500">
                {project.title}
              </h3>
              <div className="space-y-4 text-sm font-mono text-zinc-400">
                <p className="leading-relaxed">{project.description}</p>
                <div className="pt-6 flex justify-between items-center text-xs uppercase tracking-widest text-zinc-500">
                  <span>CLIENT: {project.client}</span>
                  <span className="text-amber-400/50">{project.category}</span>
                </div>
              </div>
              <div className="mt-10">
                <Link href={`/project/${project._id}`}>
                  <button className="text-xs font-mono text-white border border-white/20 px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                    Explore Case Study →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}