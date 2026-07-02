"use client";

import { useRef, MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { aboutContent } from "@/data/about";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

function BentoCard({ label, value }: { label: string; value: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    // Magnetic pull
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distanceX = x - centerX;
    const distanceY = y - centerY;

    gsap.to(cardRef.current, {
      x: distanceX * 0.05,
      y: distanceY * 0.05,
      rotationY: distanceX * 0.01,
      rotationX: -distanceY * 0.01,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotationY: 0,
      rotationX: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/2 p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/4"
      style={{ perspective: 1000 }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,138,61,0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-accent-primary">
          {label}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

export function About() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const textEl = textRef.current;
      if (!section || !textEl) return;

      const headingTargets = gsap.utils.toArray<HTMLElement>("[data-about-reveal]", section);
      const hudItems = gsap.utils.toArray<HTMLElement>("[data-about-hud]", section);
      const bentoCards = gsap.utils.toArray<HTMLElement>(".bento-container > div", section);

      // 2. Split Text for the scrub body paragraph
      const splitBody = new SplitType(textEl, { types: "words" });
      const bodyWords = splitBody.words ?? [];

      // Initial states
      gsap.set(headingTargets, { opacity: 0, y: 50, rotateX: -20 });
      gsap.set(hudItems, { opacity: 0, x: -20 });
      gsap.set(bodyWords, { opacity: 0.15 }); // Dimmed by default
      gsap.set(bentoCards, { opacity: 0, y: 40 });

      // Intro Reveal Timeline
      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 45%",
          toggleActions: "play none none reverse",
        },
      });

      revealTimeline
        .to(headingTargets, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: prefersReducedMotion ? 0.01 : 1.2,
          stagger: prefersReducedMotion ? 0 : 0.08,
          ease: cinematicEase.out,
        })
        .to(
          hudItems,
          {
            opacity: 1,
            x: 0,
            duration: prefersReducedMotion ? 0.01 : 0.8,
            stagger: prefersReducedMotion ? 0 : 0.1,
            ease: cinematicEase.out,
          },
          "-=0.8"
        )
        .to(
          bentoCards,
          {
            opacity: 1,
            y: 0,
            duration: prefersReducedMotion ? 0.01 : 1,
            stagger: prefersReducedMotion ? 0 : 0.1,
            ease: cinematicEase.out,
          },
          "-=0.6"
        );

      // Scrub Reveal for Body Text
      const scrubTween = gsap.to(bodyWords, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: textEl,
          start: "top 85%",
          end: "bottom 55%",
          scrub: true,
        },
      });

      return () => {
        revealTimeline.scrollTrigger?.kill();
        revealTimeline.kill();
        scrubTween.scrollTrigger?.kill();
        scrubTween.kill();
        splitBody.revert();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden rounded-t-[3rem] bg-transparent shadow-[0_-20px_40px_rgba(0,0,0,0.5)] border-t border-white/5"
    >
      <article className="relative min-h-dvh w-full px-[clamp(1.5rem,5vw,4rem)] pb-24 pt-32 text-foreground">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_30%,var(--accent-primary-subtle),transparent_50%)] opacity-30" />

        <div className="relative z-10 grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          
          {/* Vertical Side HUD */}
          <div className="hidden lg:col-span-1 lg:flex flex-col gap-12 pt-4 border-l border-white/10 pl-4 relative">
            <div className="absolute top-0 -left-px w-0.5 h-12 bg-accent-primary shadow-[0_0_12px_var(--accent-primary)]" />
            
            <div data-about-hud>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 mb-2">Input</p>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-primary-light">Curiosity</p>
            </div>
            <div data-about-hud>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 mb-2">Mode</p>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-300">Builder</p>
            </div>
            <div data-about-hud>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 mb-2">Bias</p>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-300">Performance</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
            
            {/* Mobile-only horizontal HUD */}
            <div className="flex lg:hidden flex-wrap gap-6 mb-12 border-l-2 border-accent-primary pl-4">
              <div data-about-hud>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 mb-1">Mode</p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-accent-primary-light">Builder</p>
              </div>
              <div data-about-hud>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-zinc-500 mb-1">Bias</p>
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-zinc-300">Performance</p>
              </div>
            </div>

            <div data-about-reveal className="mb-10 border-l-2 border-accent-primary pl-4">
              <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
                02 // SIGNAL
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
                ORIGIN & CORE PHILOSOPHY
              </h2>
            </div>

            <h3
              data-about-reveal
              className="max-w-[16ch] text-balance text-[clamp(2.2rem,4.5vw,4rem)] font-space font-black uppercase leading-[0.85] tracking-tight text-white"
              style={{ perspective: "1000px" }}
            >
              {aboutContent.title}
            </h3>
            
            <p
              ref={textRef}
              className="mt-12 max-w-2xl text-[clamp(1.1rem,2vw,1.6rem)] leading-[1.6] text-white font-light"
            >
              {aboutContent.statement} {aboutContent.bio}
            </p>

            <div className="bento-container mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutContent.highlights.map((item, i) => (
                <div key={item.label} className={i === 2 ? "sm:col-span-2" : ""}>
                  <BentoCard label={item.label} value={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Empty Space strictly reserved for the 3D RetroComputer to land */}
          <div className="hidden lg:block lg:col-span-4 pointer-events-none" />
        </div>
      </article>
    </section>
  );
}
