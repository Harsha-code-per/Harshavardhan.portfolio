"use client";

import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";

const HeroScene = dynamic(
  () => import("@/components/canvas/HeroScene").then((module) => module.HeroScene),
    {
      ssr: false,
      loading: () => (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,95,43,0.18),transparent_35%),radial-gradient(circle_at_75%_35%,rgba(234,179,8,0.12),transparent_32%),linear-gradient(135deg,#0c0b0a_0%,#121110_100%)]" />
      ),
    }
);

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const sequenceStartedRef = useRef(false);

  useGSAP(
    () => {
      if (container.current) {
        gsap.set(container.current, { opacity: 0, y: 24, scale: 0.985 });
      }

      const text = new SplitType("#hero-title", { types: "words,chars" });
      const chars = text.chars ?? [];
      const secondaryElements = gsap.utils.toArray<HTMLElement>(".hero-anim", container.current);
      let timeline: gsap.core.Timeline | null = null;

      gsap.set(chars, { opacity: 0, y: 40 });
      gsap.set(secondaryElements, { opacity: 0, y: 40 });

      const startHeroSequence = () => {
        if (sequenceStartedRef.current) {
          return;
        }
        sequenceStartedRef.current = true;

        /* Text scramble effect */
        const heroTitleEl = document.getElementById("hero-title");
        if (heroTitleEl) {
          const chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let iteration = 0;
          const originalText = heroTitleEl.innerText;
          const scramble = setInterval(() => {
            heroTitleEl.innerText = originalText.split('').map((letter, index) => {
              if (index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            if (iteration >= originalText.length) clearInterval(scramble);
            iteration += 1/3;
          }, 30);
          
          setTimeout(() => {
            clearInterval(scramble);
            heroTitleEl.innerText = originalText;
          }, 400);
        }

        timeline = gsap.timeline({ delay: 0.6 });
        timeline.to(
          container.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          0
        );
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
        end: "+=180%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
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
          end: "+=120%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      handoffTimeline
        .to("#hero-scroll-wrapper", {
          opacity: 0,
          y: -60,
          duration: 0.25,
          ease: "power2.in",
        }, 0)
        .to({}, { duration: 0.35 });

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
      className="relative h-dvh w-full overflow-hidden text-[var(--chapter-ink)]"
    >
      <div id="hero-canvas-layer" className="fixed inset-0 z-0 w-full h-screen pointer-events-none">
        <HeroScene />
      </div>

      <div id="hero-scroll-wrapper" className="relative z-10 flex h-full w-full flex-col justify-center px-8 pt-24 pointer-events-none lg:w-[55vw] lg:px-16 lg:pt-0 xl:w-[50vw]">
        
        {/* Eyebrow */}
        <p className="hero-anim mb-4 flex items-center gap-4 text-xs uppercase tracking-widest text-[var(--chapter-accent)] md:text-sm pointer-events-auto">
          <span className="h-px w-6 bg-[var(--chapter-accent)]"></span>
          AI Engineer <span className="text-[color-mix(in_srgb,var(--chapter-accent)_60%,transparent)]">&bull;</span> FULL-Stack Architect
        </p>

        {/* H1 - Note the updated clip-path to prevent descender clipping */}
        <h1 id="hero-title" className="text-[clamp(2.5rem,min(5vw,6.5vh),5rem)] font-black uppercase leading-[0.85] tracking-tighter text-zinc-100 pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_120%,0_120%)]">
          CRAFTING<br/>INTELLIGENT<br/>EXPERIENCES.
        </h1>

        {/* Subheadline */}
        <p className="hero-anim mt-6 text-neutral-400 text-[clamp(1rem,min(1.5vw,2vh),1.25rem)] max-w-[90%] font-light pointer-events-auto">
          I build <span className="font-medium text-[var(--chapter-ink)]">AI-Powered Systems</span> and design <span className="font-medium text-[var(--chapter-accent-alt)]">Cinematic Web Interfaces</span> <br />where deep engineering meets visual storytelling.
        </p>

        {/* Badges */}
        <div className="hero-anim flex flex-wrap gap-3 mt-8 pointer-events-auto">
          <span className="rounded-full border border-[var(--chapter-accent)]/20 bg-[var(--chapter-surface)]/70 px-4 py-1.5 text-xs tracking-widest text-[var(--chapter-muted)]">Tech Enthusiast</span>
          <span className="rounded-full border border-[var(--chapter-accent)]/20 bg-[var(--chapter-surface)]/70 px-4 py-1.5 text-xs tracking-widest text-[var(--chapter-muted)]">Rapid Prototyper</span>
          <span className="rounded-full border border-[var(--chapter-accent)]/20 bg-[var(--chapter-surface)]/70 px-4 py-1.5 text-xs tracking-widest text-[var(--chapter-muted)]">B.Tech 2028</span>
        </div>

        {/* Primary Button */}
        <div className="hero-anim mt-8 pointer-events-auto">
          <button data-magnetic onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="rounded-full bg-[var(--chapter-accent)] px-8 py-3 font-medium text-white shadow-[0_0_20px_var(--chapter-glow)] transition-colors hover:brightness-110">
            View My Work
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70 animate-bounce pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-[var(--chapter-muted)]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--chapter-accent)] to-transparent"></div>
      </div>
    </section>
  );
}
