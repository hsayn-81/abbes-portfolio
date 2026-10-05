"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects"; // Fetch from dummy DB

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  
  // Find project by _id from the URL
  const project = projects.find((p) => p._id === params.id);

  useEffect(() => {
    // Smooth reveal when page loads
    gsap.fromTo(
      ".reveal-item",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, [project]);

  // If project not found in DB
  if (!project) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white font-mono">
        <h1>PROJECT NOT FOUND.</h1>
        <button onClick={() => router.push('/')} className="ml-4 text-amber-400">Return Home</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-24 px-6 md:px-12 lg:px-20 selection:bg-amber-400 selection:text-black">
      
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link href="/" className="reveal-item inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors uppercase tracking-widest mb-16">
          <ArrowLeft className="w-4 h-4" /> Back to Archive
        </Link>

        {/* HEADER SECTION */}
        <div className="border-b border-white/10 pb-12 mb-12">
          <div className="reveal-item flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <h1 className="text-5xl md:text-7xl font-serif font-light uppercase tracking-tight leading-[0.9]">
              {project.title}
            </h1>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest whitespace-nowrap">
              INDEX // {project.index}
            </span>
          </div>

          {/* METADATA GRID */}
          <div className="reveal-item grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono uppercase tracking-widest text-zinc-500 pt-8 border-t border-white/5">
            <div>
              <span className="block text-zinc-600 mb-1">CLIENT</span>
              <span className="text-white">{project.client}</span>
            </div>
            <div>
              <span className="block text-zinc-600 mb-1">YEAR</span>
              <span className="text-white">{project.year}</span>
            </div>
            <div>
              <span className="block text-zinc-600 mb-1">DISCIPLINE</span>
              <span className="text-amber-400">{project.category}</span>
            </div>
          </div>
        </div>

        {/* MAIN DESCRIPTION */}
        <div className="reveal-item text-zinc-300 font-mono text-sm leading-relaxed max-w-3xl mb-24">
          <span className="text-xs text-amber-400 uppercase tracking-widest block mb-4">
            [ PROJECT OVERVIEW ]
          </span>
          <p>{project.fullDescription}</p>
        </div>

        {/* IMAGE GALLERY (No Zoom, No Cropping - Uses Object-Contain) */}
        <div className="space-y-16">
          <div className="reveal-item text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-white/10 pb-4">
            PROJECT GALLERY / SCHEMATICS
          </div>

          {project.gallery.map((imgSrc, i) => (
            <div 
              key={i} 
              // Background zinc-950 and p-4 creates a nice frame. Object-contain keeps original aspect ratio.
              className="reveal-item relative w-full h-[50vh] md:h-[80vh] bg-[#0c0c0c] border border-white/5 p-4 rounded-sm flex items-center justify-center"
            >
              <Image
                src={imgSrc}
                alt={`${project.title} Gallery ${i + 1}`}
                fill
                className="object-contain p-4" // 👈 The magic word that prevents cropping/zooming!
              />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}