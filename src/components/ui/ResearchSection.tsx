"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Crosshair, Radio, Battery, Lock } from "lucide-react";
import { publications } from "@/data/publications";
import { gsap, setupGsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

export function ResearchSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dataStreamRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();
  
  const [isHovering, setIsHovering] = useState(false);
  const paper = publications[0];

  // --- GSAP Animations (HUD Elements Fade In) ---
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const section = sectionRef.current;
      if (!section) return;

      // Fade up section elements
      gsap.from(section.querySelectorAll(".hud-element"), {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });
      
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  // --- Interactive Custom Crosshair ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cursorRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1, // Quick, snappy response like a real targeting system
      ease: "power2.out",
    });
  };

  // Scrambling numbers for data stream
  const [stream, setStream] = useState("LOC: 34.0522° N, 118.2437° W");
  useEffect(() => {
    const interval = setInterval(() => {
      setStream(
        `LOC: ${(Math.random() * 90).toFixed(4)}° N, ${(Math.random() * 180).toFixed(4)}° W`
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="research"
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-[#020202] min-h-[100dvh] py-24 flex items-center justify-center text-white ${isHovering ? "cursor-none" : ""}`}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent-primary) 8%, transparent), transparent 60%), #020202",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* --- UAV Scanning Grid Background --- */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-primary) 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* --- UAV Camera Viewfinder UI (Anchored to Section boundaries to prevent overlapping the central dossier card) --- */}
      {/* Top Left */}
      <div className="hud-element absolute left-6 top-6 h-12 w-12 border-l-2 border-t-2 border-[var(--accent-primary)]/40 md:left-12 md:top-12 pointer-events-none" />
      <div className="hud-element absolute left-8 top-8 md:left-14 md:top-14 flex items-center gap-2 pointer-events-none">
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="font-mono text-xs font-bold tracking-widest text-red-500">REC</span>
      </div>

      {/* Top Right */}
      <div className="hud-element absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-[var(--accent-primary)]/40 md:right-12 md:top-12 pointer-events-none" />
      <div className="hud-element absolute right-8 top-8 md:right-14 md:top-14 flex flex-col items-end gap-1 pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[var(--accent-primary)]">
          <span>UAV-360-SYS</span>
          <Radio className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-[var(--accent-primary)]/60">
          <span>BAT 94%</span>
          <Battery className="h-3 w-3" />
        </div>
      </div>

      {/* Bottom Left */}
      <div className="hud-element absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2 border-[var(--accent-primary)]/40 md:bottom-12 md:left-12 pointer-events-none" />
      <div 
        ref={dataStreamRef}
        className="hud-element absolute bottom-8 left-8 md:bottom-14 md:left-14 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-primary)]/50 pointer-events-none"
      >
        {stream} <br />
        ALT: 400FT / SPD: 15KNOTS
      </div>

      {/* Bottom Right */}
      <div className="hud-element absolute bottom-6 right-6 h-12 w-12 border-b-2 border-r-2 border-[var(--accent-primary)]/40 md:bottom-12 md:right-12 pointer-events-none" />
      <div className="hud-element absolute bottom-8 right-8 md:bottom-14 md:right-14 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[var(--accent-primary)]/60 pointer-events-none">
        <Lock className="h-3 w-3" />
        TARGET LOCKED
      </div>

      {/* --- Custom Targeting Crosshair --- */}
      <div
        ref={cursorRef}
        className={`pointer-events-none absolute left-0 top-0 z-50 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-full border border-[var(--accent-primary)] opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-primary)]" />
        <div className="absolute left-1/2 top-0 h-3 w-[1px] -translate-x-1/2 bg-[var(--accent-primary)]" />
        <div className="absolute bottom-0 left-1/2 h-3 w-[1px] -translate-x-1/2 bg-[var(--accent-primary)]" />
        <div className="absolute left-0 top-1/2 h-[1px] w-3 -translate-y-1/2 bg-[var(--accent-primary)]" />
        <div className="absolute right-0 top-1/2 h-[1px] w-3 -translate-y-1/2 bg-[var(--accent-primary)]" />
        <Crosshair className="absolute -bottom-6 -right-6 h-4 w-4 text-[var(--accent-primary)] opacity-50" />
      </div>

      {/* Content Container (Sized and padded so that the card cannot overlap the HUD corner overlays) */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-8 md:px-20 lg:px-24">
        
        {/* --- Main Classified Dossier (The Paper) --- */}
        <div className="hud-element relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          
          <div className="mb-12 flex flex-col items-center">
             <div className="mb-4 inline-flex items-center justify-center border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-4 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">
                  Classified Data Link
                </span>
             </div>
             <p className="font-mono text-sm uppercase tracking-[0.3em] text-white/40">
               {paper.year}
             </p>
          </div>

          <div className="group relative w-full overflow-hidden border border-[var(--accent-primary)]/15 bg-white/[0.01] p-8 backdrop-blur-3xl transition-all duration-500 hover:border-[var(--accent-primary)]/35 hover:bg-white/[0.03] md:p-16"
            style={{
              boxShadow: "0 0 50px var(--accent-primary-glow)",
            }}
          >
            
            {/* Inner Scanning Line on Hover */}
            <div className="absolute left-0 top-0 h-full w-2 -translate-x-full bg-gradient-to-r from-transparent to-[var(--accent-primary)]/30 opacity-0 transition-all duration-1000 group-hover:translate-x-[800px] group-hover:opacity-100" />

            {/* Corner brackets for the dossier */}
            <div className="absolute left-4 top-4 h-4 w-4 border-l border-t border-[var(--accent-primary)]/40" />
            <div className="absolute right-4 top-4 h-4 w-4 border-r border-t border-[var(--accent-primary)]/40" />
            <div className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-[var(--accent-primary)]/40" />
            <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-[var(--accent-primary)]/40" />

            <h3 className="relative z-10 mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3.5rem)] font-black uppercase leading-[1.1] tracking-tight text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
              {paper.title}
            </h3>

            <div className="relative z-10 mt-10 grid gap-8 text-left md:grid-cols-2">
              <div className="border-l border-[var(--accent-primary)]/20 pl-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]/60">
                  Publisher Platform
                </p>
                <p className="mt-2 font-mono text-sm tracking-wider text-white/90">
                  {paper.publisher}
                </p>
              </div>
              <div className="border-l border-[var(--accent-primary)]/20 pl-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-primary)]/60">
                  Abstract Intel
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {paper.summary}
                </p>
              </div>
            </div>

            {paper.url && (
              <div className="relative z-10 mt-16 flex justify-center">
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn relative overflow-hidden border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-8 py-4 transition-all hover:bg-[var(--accent-primary)] hover:shadow-[0_0_30px_var(--accent-primary)]"
                >
                  <span className="relative z-10 flex items-center gap-3 font-mono text-sm font-black uppercase tracking-[0.2em] text-[var(--accent-primary)] transition-colors group-hover/btn:text-black">
                    Establish Secure Link <ArrowUpRight className="h-5 w-5" />
                  </span>
                </a>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
