"use client";

import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { HeroScene } from "@/components/canvas/HeroScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cinematicDuration, cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";
import { useRef } from "react";

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const sequenceStartedRef = useRef(false);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      sequenceStartedRef.current = false;
      const text = new SplitType("#hero-title", { types: "words,chars" });
      const chars = text.chars ?? [];
      const secondaryElements = gsap.utils.toArray<HTMLElement>(".hero-anim", container.current);
      const chromeElements = gsap.utils.toArray<HTMLElement>("[data-hero-chrome]", container.current);
      let timeline: gsap.core.Timeline | null = null;

      gsap.set(chars, { opacity: 0, y: 50 });
      gsap.set(secondaryElements, { opacity: 0, y: 30 });
      gsap.set(chromeElements, { opacity: 0, y: 18 });

      const startHeroSequence = () => {
        if (sequenceStartedRef.current) {
          return;
        }
        sequenceStartedRef.current = true;

        timeline = gsap.timeline({ delay: 0.2 });
        timeline
          .to(chars, {
            opacity: 1,
            y: 0,
            duration: prefersReducedMotion ? 0.01 : 1.5,
            stagger: prefersReducedMotion ? 0 : 0.02,
            ease: cinematicEase.out,
          })
          .to(
            secondaryElements,
            {
              opacity: 1,
              y: 0,
              duration: prefersReducedMotion ? 0.01 : 1.5,
              stagger: prefersReducedMotion ? 0 : 0.1,
              ease: cinematicEase.out,
            },
            "-=1.2"
          )
          .to(
            chromeElements,
            {
              opacity: 1,
              y: 0,
              duration: prefersReducedMotion ? 0.01 : cinematicDuration.slow,
              stagger: prefersReducedMotion ? 0 : 0.08,
              ease: cinematicEase.out,
            },
            "-=1"
          )
          .set(secondaryElements, {
            opacity: 1,
            y: 0,
            clearProps: "opacity,transform",
          })
          .set(chromeElements, {
            opacity: 1,
            y: 0,
            clearProps: "opacity,transform",
          });
      };

      if ((window as Window & { __preloaderComplete?: boolean }).__preloaderComplete) {
        startHeroSequence();
      } else {
        window.addEventListener("preloaderComplete", startHeroSequence);
      }
      const fallbackTimer = window.setTimeout(startHeroSequence, 6800);

      return () => {
        window.clearTimeout(fallbackTimer);
        window.removeEventListener("preloaderComplete", startHeroSequence);
        timeline?.kill();
        text.revert();
      };
    },
    { scope: container, dependencies: [prefersReducedMotion] }
  );

  useGSAP(
    () => {
      const getPinEnd = () => {
        const aboutEl = document.getElementById("about");
        const aboutHeight = aboutEl ? aboutEl.offsetHeight : window.innerHeight;
        return `+=${window.innerHeight + aboutHeight}`;
      };

      const pinTrigger = ScrollTrigger.create({
        trigger: "#hero-master-container",
        start: "top top",
        end: getPinEnd,
        pin: true,
        pinSpacing: false,
        refreshPriority: 10,
      });

      return () => {
        pinTrigger.kill();
      };
    },
    { dependencies: [] }
  );

  useGSAP(
    () => {
      const heroSection = container.current;
      if (!heroSection) {
        return;
      }

      const handoffTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-master-container",
          start: "top top",
          end: "+=100%",
          scrub: prefersReducedMotion ? false : true,
          invalidateOnRefresh: true,
          refreshPriority: 9,
        },
      });

      handoffTimeline
        .to("#hero-scroll-wrapper", {
          opacity: 0,
          y: -100,
          duration: prefersReducedMotion ? 0.01 : 0.22,
          ease: cinematicEase.scrub,
        })
        .to(
          "[data-hero-chrome]",
          {
            opacity: 0,
            y: -28,
            duration: prefersReducedMotion ? 0.01 : 0.22,
            ease: cinematicEase.scrub,
          },
          0
        )

        .to({}, { duration: 0.22 });

      return () => {
        handoffTimeline.scrollTrigger?.kill();
        handoffTimeline.kill();
      };
    },
    { scope: container, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="hero"
      ref={container}
      className="relative w-full h-dvh overflow-hidden bg-[#050505] text-white"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <HeroScene />
      </div>

      <div className="cinematic-grid pointer-events-none absolute inset-0 z-1 opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-3 h-px bg-[linear-gradient(90deg,transparent,var(--accent-primary),transparent)] opacity-70" />

      {/* Mobile gradient: ensures text is readable over the 3D canvas */}
      <div
        className="absolute inset-0 z-4 pointer-events-none lg:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 55%, rgba(5,5,5,0.15) 100%)",
        }}
      />

      <div
        data-hero-chrome
        className="hud-panel pointer-events-none absolute right-[clamp(2rem,5vw,5rem)] top-28 z-10 hidden w-[16rem] rounded-md p-4 lg:block"
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
          System Online
        </p>
        <div className="mt-4 space-y-3">
          {["AI Systems", "Motion Interface", "Full-Stack Logic"].map((item) => (
            <div key={item} className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/65">{item}</span>
              <span className="h-1.5 w-10 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full w-4/5 rounded-full bg-accent-primary shadow-[0_0_14px_var(--accent-primary-glow)]" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        data-hero-chrome
        className="pointer-events-none absolute bottom-8 right-8 z-10 hidden max-w-[18rem] border-r border-accent-primary pr-4 text-right lg:block"
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-accent-primary-light">
          Chapter 01
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          Scroll turns the machine into a portfolio intelligence layer.
        </p>
      </div>

      <div id="hero-scroll-wrapper" className="absolute inset-0 z-10 flex flex-col justify-center pt-24 lg:pt-0 px-8 lg:px-16 pointer-events-none w-full lg:w-[55vw] xl:w-[48vw]">
        
        {/* Eyebrow */}
        <p className="hero-anim text-accent-primary text-xs md:text-sm tracking-widest uppercase mb-4 flex items-center gap-4 pointer-events-auto">
          <span className="w-6 h-px bg-accent-primary"></span> 
          AI Engineer <span className="opacity-50">&bull;</span> Full-Stack Architect
        </p>

        {/* H1 */}
        <h1 id="hero-title" className="text-[clamp(2.5rem,min(5vw,6.5vh),5rem)] font-black uppercase leading-[0.85] tracking-tighter text-zinc-100 pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_120%,0_120%)]">
          Engineering<br/>The Signal<br/>Behind AI.
        </h1>

        {/* Subheadline */}
        <p className="hero-anim mt-6 text-neutral-400 text-[clamp(1rem,min(1.5vw,2vh),1.25rem)] max-w-[55ch] font-light pointer-events-auto">
          I build <span className="text-white font-medium">AI-powered systems</span> and shape <span className="text-[#E49B55] font-medium">cinematic interfaces</span> <br className="hidden sm:block"/>where product logic, motion, and performance move as one.
        </p>

        {/* Badges */}
        <div className="hero-anim flex flex-wrap gap-3 mt-8 pointer-events-auto">
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">AI Systems</span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">Interface Motion</span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">B.Tech 2028</span>
        </div>

        {/* Primary Button */}
        <div className="hero-anim mt-8 pointer-events-auto">
          <button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-3 rounded-full bg-accent-primary hover:bg-accent-secondary text-black font-semibold transition-colors shadow-[0_0_20px_var(--accent-primary-glow)]">
            View My Work
          </button>
        </div>
      </div>
    </section>
  );
}
