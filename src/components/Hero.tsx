"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;
const INITIAL_LOAD_FRAMES = 12; // 👈 FAST LOAD: Wait for only 12 frames to show screen in 0.5s!

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Text & Prompt Refs
  const textIntroRef = useRef<HTMLDivElement>(null);
  const textGridRef = useRef<HTMLDivElement>(null);
  const textSolarRef = useRef<HTMLDivElement>(null);
  const magicPromptRef = useRef<HTMLDivElement>(null);

  // HUD Refs
  const hud1Ref = useRef<HTMLSpanElement>(null);
  const hud2Ref = useRef<HTMLSpanElement>(null);
  const hud3Ref = useRef<HTMLSpanElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentFrameUrl = (index: number) => {
    const frameNumber = String(index + 1).padStart(3, "0");
    return `/frames/ezgif-frame-${frameNumber}.jpg`;
  };

  // 1. FAST PRELOADER: Load initial batch fast, then stream the rest in background
  useEffect(() => {
    let initialCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    // Helper to load single image
    const loadImage = (index: number, onInitialBatchDone?: () => void) => {
      const img = new Image();
      img.src = currentFrameUrl(index);
      img.onload = () => {
        loadedImages[index] = img;
        imagesRef.current[index] = img;

        if (index < INITIAL_LOAD_FRAMES) {
          initialCount++;
          if (initialCount === INITIAL_LOAD_FRAMES && onInitialBatchDone) {
            onInitialBatchDone();
          }
        }
      };
    };

    // A. Priority Load First 12 Frames
    for (let i = 0; i < INITIAL_LOAD_FRAMES; i++) {
      loadImage(i, () => {
        setIsLoaded(true); // Open site instantly!
        
        // B. Stream remaining frames silently in background
        for (let j = INITIAL_LOAD_FRAMES; j < TOTAL_FRAMES; j++) {
          loadImage(j);
        }
      });
    }
  }, []);

  // 2. High Performance Canvas Draw
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Fallback to nearest loaded image if targeted frame is still downloading
    let img = imagesRef.current[index];
    if (!img) {
      for (let fallback = index; fallback >= 0; fallback--) {
        if (imagesRef.current[fallback]) {
          img = imagesRef.current[fallback];
          break;
        }
      }
    }
    if (!img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderFrame(0);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded]);

  // 3. Master Scroll Engine
  useEffect(() => {
    if (!isLoaded) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=600%",
      pin: true,
      scrub: 0.2,
      onUpdate: (self) => {
        const progress = self.progress;

        const videoProgress = Math.min(1, progress / 0.85);
        const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(videoProgress * TOTAL_FRAMES));
        renderFrame(targetFrame);

        // Intro Text & Magic Box Fade Out
        if (progress < 0.15) {
          const fadeVal = String(1 - (progress / 0.15));
          
          if (textIntroRef.current) {
            textIntroRef.current.style.opacity = fadeVal;
            textIntroRef.current.style.transform = `translateY(-48px) scale(${1 - progress})`;
          }
          if (magicPromptRef.current) {
            magicPromptRef.current.style.opacity = fadeVal;
          }

          if (hud1Ref.current) hud1Ref.current.style.color = "#fbbf24";
          if (hud2Ref.current) hud2Ref.current.style.color = "#52525b";
        } 
        
        // Power Grid Text
        else if (progress >= 0.30 && progress < 0.55) {
          let opacity = 1;
          if (progress < 0.35) opacity = (progress - 0.30) / 0.05;
          if (progress > 0.50) opacity = 1 - ((progress - 0.50) / 0.05);
          
          if (textGridRef.current) {
            textGridRef.current.style.opacity = String(opacity);
            textGridRef.current.style.transform = `translateY(-48px) scale(${0.9 + (progress - 0.3) * 0.2})`;
          }
          
          if (hud1Ref.current) hud1Ref.current.style.color = "#52525b";
          if (hud2Ref.current) hud2Ref.current.style.color = "#fbbf24";
          if (hud3Ref.current) hud3Ref.current.style.color = "#52525b";
        } 
        
        // Solar / Renewable Text
        else if (progress >= 0.60 && progress < 0.85) {
          let opacity = 1;
          if (progress < 0.65) opacity = (progress - 0.60) / 0.05;
          if (progress > 0.80) opacity = 1 - ((progress - 0.80) / 0.05);
          
          if (textSolarRef.current) {
            textSolarRef.current.style.opacity = String(opacity);
            textSolarRef.current.style.transform = `translateY(-48px) scale(${0.9 + (progress - 0.6) * 0.2})`;
          }

          if (hud2Ref.current) hud2Ref.current.style.color = "#52525b";
          if (hud3Ref.current) hud3Ref.current.style.color = "#fbbf24";
        } 
        
        else {
          if (textIntroRef.current) textIntroRef.current.style.opacity = "0";
          if (textGridRef.current) textGridRef.current.style.opacity = "0";
          if (textSolarRef.current) textSolarRef.current.style.opacity = "0";
          if (magicPromptRef.current) magicPromptRef.current.style.opacity = "0";
        }

        // Exit Scale Transition
        if (progress > 0.85 && canvasWrapperRef.current) {
          const exitProgress = (progress - 0.85) / 0.15;
          const scale = 1 - (0.1 * exitProgress);
          const radius = 32 * exitProgress;
          
          canvasWrapperRef.current.style.transform = `scale(${scale})`;
          canvasWrapperRef.current.style.borderRadius = `${radius}px`;
        } else if (canvasWrapperRef.current) {
          canvasWrapperRef.current.style.transform = `scale(1)`;
          canvasWrapperRef.current.style.borderRadius = `0px`;
        }
      },
    });

    renderFrame(0);

    return () => {
      lenis.destroy();
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-[#080808] overflow-hidden">
      
      {/* Super Fast Loading Screen (< 0.8s) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] text-white">
          <span className="text-xs font-mono text-amber-400 tracking-[0.3em] uppercase mb-4 animate-pulse">
            BOOTING HARDWARE CORE
          </span>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 animate-[shimmer_1s_infinite]" />
          </div>
        </div>
      )}

      {/* Canvas Wrapper */}
      <div 
        ref={canvasWrapperRef} 
        className="w-full h-full relative overflow-hidden origin-center will-change-transform"
      >
        <canvas ref={canvasRef} className="w-full h-full object-cover block" />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-[#080808]/40 pointer-events-none" />

        {/* ================= TEXT REVEALS ================= */}
        <div ref={textIntroRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none -translate-y-12 transition-transform duration-100 ease-out">
          <div className="relative flex flex-col items-center justify-center text-center px-8 py-6 border border-amber-400/50 bg-[#080808]/80 backdrop-blur-md rounded-xs max-w-xs sm:max-w-md shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            <span className="text-[11px] sm:text-xs font-mono text-amber-400 font-semibold tracking-[0.35em] uppercase mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              [ ELECTRICAL ENG. ]
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif text-white font-semibold tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              M. ABBAS SHKEIR
            </h1>
          </div>
        </div>

        {/* MAGIC TRICK PROMPT BOX */}
        <div
          ref={magicPromptRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 ease-out"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 border border-amber-400/40 bg-[#080808]/85 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono text-amber-300 font-medium uppercase tracking-[0.2em] whitespace-nowrap">
              SCROLL DOWN TO SEE A MAGIC TRICK ✨
            </span>
          </div>
        </div>

        {/* Power Grid Text */}
        <div ref={textGridRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none will-change-transform opacity-0">
          <div className="relative flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-300 tracking-[0.4em] uppercase mb-4">
              [ HIGH-VOLTAGE INFRASTRUCTURE ]
            </span>
            <h2 className="text-6xl md:text-7xl font-serif text-white font-light tracking-tight uppercase drop-shadow-2xl">
              SUBSTATION <br />
              <span className="italic text-amber-400">AUTOMATION.</span>
            </h2>
          </div>
        </div>

        {/* Solar / Renewables Text */}
        <div ref={textSolarRef} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none will-change-transform opacity-0">
          <div className="relative flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-300 tracking-[0.4em] uppercase mb-4">
              [ SUSTAINABLE ENERGY GRIDS ]
            </span>
            <h2 className="text-6xl md:text-7xl font-serif text-white font-light tracking-tight uppercase drop-shadow-2xl">
              RENEWABLE <br />
              <span className="italic text-amber-400">INTEGRATION.</span>
            </h2>
          </div>
        </div>

        {/* HUD */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6 hidden md:flex pointer-events-none">
          <span ref={hud1Ref} className="text-[10px] font-mono font-bold tracking-widest text-amber-400 transition-colors duration-300">01</span>
          <div className="w-[1px] h-12 bg-white/10 relative">
             <div className="w-full h-full bg-amber-400/20 absolute top-0 left-0 animate-pulse" />
          </div>
          <span ref={hud2Ref} className="text-[10px] font-mono font-bold tracking-widest text-zinc-600 transition-colors duration-300">02</span>
          <div className="w-[1px] h-12 bg-white/10" />
          <span ref={hud3Ref} className="text-[10px] font-mono font-bold tracking-widest text-zinc-600 transition-colors duration-300">03</span>
        </div>

      </div>
    </div>
  );
}