"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { workExperience } from "@/data/work";
import { gsap, ScrollTrigger, setupGsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

const proofSignals = [
  { label: "Status", value: "Fresher", detail: "ready for first team" },
  { label: "Internships", value: "02", detail: "real product exposure" },
  { label: "Mode", value: "Ship", detail: "learn fast, build clean" },
];

export function WorkShowcase() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const horizontalRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const horizontal = horizontalRef.current;
      if (!section || !horizontal) return;

      const panels = gsap.utils.toArray<HTMLElement>(".work-panel", section);
      const parallaxTexts = gsap.utils.toArray<HTMLElement>(".parallax-text", section);
      
      const getScrollAmount = () => horizontal.scrollWidth - window.innerWidth;

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        anticipatePin: 1,
      });

      // Horizontal Scrub
      const scrollTween = gsap.to(horizontal, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: prefersReducedMotion ? false : 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Parallax Typography Effect
      // As the container moves left, we move the text right at a different speed to create depth
      parallaxTexts.forEach((text) => {
        gsap.to(text, {
          x: "15vw",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            scrub: prefersReducedMotion ? false : 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // Subtle entrance animations for cards when they come into view
      panels.forEach((panel, i) => {
        if (i === 0) return; // Skip intro panel
        
        const innerContent = panel.querySelector(".work-content");
        if (innerContent) {
          gsap.from(innerContent, {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween, // Use the horizontal scroll tween as the container
              start: "left 80%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });

      return () => {
        pinTrigger.kill();
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const artisticPalettes = [
    { primary: "#00f2fe", secondary: "#4facfe" }, 
    { primary: "#4a00e0", secondary: "#8e2de2" },
    { primary: "#b2ff05", secondary: "#00b09b" }, 
  ];

  return (
    <section id="work" ref={sectionRef} className="relative isolate bg-[#050505] overflow-hidden text-white">
      <div className="h-screen w-full overflow-hidden">
        <div ref={horizontalRef} className="flex h-full w-[300vw] will-change-transform">
          
          {/* Intro Panel */}
          <article className="work-panel relative h-full w-screen shrink-0 flex flex-col justify-center px-[clamp(1.5rem,5vw,4rem)]">
            <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.03),transparent_50%)]" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:items-center">
              <div className="flex-1">
                <div className="mb-8 border-l-2 border-[var(--accent-primary)] pl-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-[var(--accent-primary-light)]">
                    03 // PROOF
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
                    EXPERIENCE & ARCHITECTURE
                  </h2>
                </div>
                <h2 className="text-[clamp(3.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-tighter text-white">
                  Ready For<br/>The Real<br/>Room.
                </h2>
                <p className="mt-8 max-w-[48ch] text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-zinc-400 font-light border-l border-[var(--accent-primary)]/50 pl-6 py-2">
                  I am a fresher building like a production engineer: listening carefully,
                  documenting decisions, moving fast, and turning internship problems into
                  interfaces that can survive real feedback.
                </p>
              </div>

              <div className="w-full lg:w-[400px] grid gap-4 relative">
                {/* Decoration rings */}
                <div className="absolute -inset-12 border border-white/5 rounded-full pointer-events-none" />
                <div className="absolute -inset-24 border border-[var(--accent-primary)]/10 rounded-full pointer-events-none" />
                
                {proofSignals.map((signal) => (
                  <div key={signal.label} className="hud-panel p-6 backdrop-blur-md bg-white/[0.02] border border-white/10 rounded-xl transition-colors hover:bg-white/[0.05]">
                    <div className="flex items-end justify-between gap-5 mb-2">
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                        {signal.label}
                      </p>
                      <p className="text-3xl font-black leading-none text-[var(--accent-primary-light)]">
                        {signal.value}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Work History Panels */}
          {workExperience.map((work, index) => {
            const palette = artisticPalettes[index % artisticPalettes.length];
            return (
              <article
                key={work.organization}
                className="work-panel relative h-full w-screen shrink-0 flex items-center px-[clamp(1.5rem,5vw,4rem)]"
                style={{
                  background: `radial-gradient(circle at center, color-mix(in srgb, ${palette.primary} 12%, transparent) 0%, transparent 60%)`,
                }}
              >
                {/* Massive Parallax Typography Background */}
                <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none -z-10">
                  <span 
                    className="parallax-text font-black text-[22vw] leading-none whitespace-nowrap opacity-[0.03] text-white select-none"
                    style={{ transform: "translateX(-5vw)" }}
                  >
                    {work.organization}
                  </span>
                </div>

                <div className="work-content relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1fr] gap-12 lg:gap-24 items-center">
                  
                  {/* Left Column: Context */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-mono text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: palette.primary }}>
                        {work.period}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/30" />
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
                        {work.location}
                      </span>
                    </div>

                    <h3 className="text-[clamp(3.5rem,5.5vw,5.5rem)] font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
                      {work.organization}
                    </h3>
                    
                    <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-light leading-tight text-white/90 mb-8">
                      {work.role}
                    </p>

                    <p className="text-base lg:text-lg leading-relaxed text-zinc-400 max-w-[45ch]">
                      {work.overview}
                    </p>

                    <div className="mt-12">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-zinc-500 mb-5">
                        Core Architecture
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {work.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-mono text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Data Nodes / Outcomes */}
                  <div className="flex flex-col gap-6 relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
                    
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-zinc-500 pl-4 border-l border-[var(--accent-primary)]">
                      Outcome Focus
                    </p>

                    {work.outcomes.map((outcome, i) => (
                      <div 
                        key={i} 
                        className="group relative p-6 lg:p-8 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-white/10"
                      >
                        <div className="absolute top-8 left-0 w-1 h-8 bg-white/20 transition-colors group-hover:bg-[var(--accent-primary)] rounded-r" style={{ "--accent-primary": palette.primary } as React.CSSProperties} />
                        <p className="text-sm md:text-base text-zinc-300 leading-relaxed pl-4">
                          {outcome}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
