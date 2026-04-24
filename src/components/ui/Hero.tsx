"use client";

import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { HeroScene } from "@/components/canvas/HeroScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const sequenceStartedRef = useRef(false);

  useGSAP(
    () => {
      const text = new SplitType("#hero-title", { types: "words,chars" });
      const chars = text.chars ?? [];
      const secondaryElements = gsap.utils.toArray<HTMLElement>(".hero-anim", container.current);
      let timeline: gsap.core.Timeline | null = null;

      gsap.set(chars, { opacity: 0, y: 50 });
      gsap.set(secondaryElements, { opacity: 0, y: 30 });

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
            duration: 1.5,
            stagger: 0.02,
            ease: "expo.out",
          })
          .to(
            secondaryElements,
            {
              opacity: 1,
              y: 0,
              duration: 1.5,
              stagger: 0.1,
              ease: "expo.out",
            },
            "-=1.2"
          )
          .set(secondaryElements, {
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

      return () => {
        window.removeEventListener("preloaderComplete", startHeroSequence);
        timeline?.kill();
        text.revert();
      };
    },
    { scope: container, dependencies: [] }
  );

  useGSAP(
    () => {
      const pinTrigger = ScrollTrigger.create({
        trigger: "#hero-master-container",
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
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
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      handoffTimeline
        .to("#hero-scroll-wrapper", {
          opacity: 0,
          y: -100,
          duration: 0.25,
          ease: "none",
        })
        .to({}, { duration: 0.75 });

      return () => {
        handoffTimeline.scrollTrigger?.kill();
        handoffTimeline.kill();
      };
    },
    { scope: container, dependencies: [] }
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

      <div id="hero-scroll-wrapper" className="absolute inset-0 z-10 flex flex-col justify-center pt-24 lg:pt-0 px-8 lg:px-16 pointer-events-none w-full lg:w-[55vw] xl:w-[50vw]">
        
        {/* Eyebrow */}
        <p className="hero-anim text-[var(--accent-primary)] text-xs md:text-sm tracking-widest uppercase mb-4 flex items-center gap-4 pointer-events-auto">
          <span className="w-6 h-px bg-[var(--accent-primary)]"></span> 
          AI Engineer <span className="opacity-50">&bull;</span> FULL-Stack Architect
        </p>

        {/* H1 - Note the updated clip-path to prevent descender clipping */}
        <h1 id="hero-title" className="text-[clamp(2.5rem,min(5vw,6.5vh),5rem)] font-black uppercase leading-[0.85] tracking-tighter text-zinc-100 pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_120%,0_120%)]">
          CRAFTING<br/>INTELLIGENT<br/>EXPERIENCES.
        </h1>

        {/* Subheadline */}
        <p className="hero-anim mt-6 text-neutral-400 text-[clamp(1rem,min(1.5vw,2vh),1.25rem)] max-w-[90%] font-light pointer-events-auto">
          I build <span className="text-white font-medium">AI-Powered Systems</span> and design <span className="text-[var(--accent-primary-light)] font-medium">Cinematic Web Interfaces</span> <br/>where deep engineering meets visual storytelling.
        </p>

        {/* Badges */}
        <div className="hero-anim flex flex-wrap gap-3 mt-8 pointer-events-auto">
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">Tech Enthusiast</span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">Rapid Prototyper</span>
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">B.Tech 2028</span>
        </div>

        {/* Primary Button */}
        <div className="hero-anim mt-8 pointer-events-auto">
          <button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-3 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white font-medium transition-colors shadow-[0_0_20px_var(--accent-primary-glow)]">
            View My Work
          </button>
        </div>
      </div>
    </section>
  );
}
