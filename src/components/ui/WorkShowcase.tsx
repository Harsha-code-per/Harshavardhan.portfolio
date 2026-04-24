"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { workExperience } from "@/data/work";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

export function WorkShowcase() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]");
      if (!stageRef.current || cards.length === 0) {
        return;
      }

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: index + 1,
          yPercent: index === 0 ? 0 : 100,
          opacity: index === 0 ? 1 : 0,
          scale: index === 0 ? 1 : 0.95,
          transformOrigin: "center center",
        });
      });

      if (cards.length === 1) {
        gsap.from(cards[0], {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
        return;
      }

      /* Add more scroll distance to accommodate reading pauses */
      const scrollPerCard = window.innerHeight * 1.1; // Reduced from 1.5 to 1.1 for a snappier feel
      const totalScroll = scrollPerCard * cards.length;
      
      const artisticPalettes = [
        { primary: "#00f2fe", secondary: "#4facfe" }, // Ocean Cyan
        { primary: "#0052D4", secondary: "#4364F7" }, // Deep Azure
        { primary: "#00b09b", secondary: "#96c93d" }, // Bioluminescent Teal
        { primary: "#4a00e0", secondary: "#8e2de2" }, // Electric Indigo
      ];

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: () => `+=${Math.max(totalScroll, 800)}`,
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // We multiply by 2 because each card now has a [Resting] and [Transitioning] phase
            const totalDuration = cards.length * 2;
            const idx = Math.min(
              Math.floor((self.progress * totalDuration) / 2),
              cards.length - 1
            );
          },
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];
        const currentInner = card.querySelectorAll("[data-work-animate]");
        const nextInner = nextCard.querySelectorAll("[data-work-animate]");
        
        // position is index * 2. 
        // Example: index 0. 
        // 0 to 1 = card 0 rests (Reading Pause)
        // 1 to 2 = card 0 exits, card 1 enters
        // 2 to 3 = card 1 rests
        const position = index * 2;

        /* Current card exits up */
        timeline
          .to(
            card,
            {
              yPercent: -30,
              opacity: 0,
              scale: 0.92,
              duration: 0.8,
              ease: "power2.inOut",
              overwrite: "auto",
            },
            position + 1
          )
          .to(
            currentInner,
            {
              opacity: 0,
              y: -20,
              duration: 0.4,
              stagger: 0.02,
              overwrite: "auto",
            },
            position + 1
          );

        /* Next card enters from below */
        timeline
          .fromTo(
            nextCard,
            {
              yPercent: 100,
              opacity: 0,
              scale: 0.95,
            },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              overwrite: "auto",
            },
            position + 1.2
          )
          .fromTo(
            nextInner,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.04,
              overwrite: "auto",
            },
            position + 1.3
          );
      });

      /* Add an extra period for the last card to settle and lock the screen before unpinning */
      timeline.to({}, { duration: 1 });

    },
    { scope: sectionRef, dependencies: [] }
  );

  const artisticPalettes = [
    { primary: "#00f2fe", secondary: "#4facfe" }, // Ocean Cyan
    { primary: "#0052D4", secondary: "#4364F7" }, // Deep Azure
    { primary: "#00b09b", secondary: "#96c93d" }, // Bioluminescent Teal
    { primary: "#4a00e0", secondary: "#8e2de2" }, // Electric Indigo
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative isolate bg-[var(--bg-base)]"
    >
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
        
        {/* Intro Card */}
        <article
          data-work-card
          className="absolute inset-0 flex flex-col justify-center px-[clamp(1rem,5vw,4rem)]"
          style={{ background: "var(--bg-base)" }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <p data-work-animate className="text-xs uppercase tracking-[0.3em] text-[var(--accent-primary-light)]">
              Work
            </p>
            <h2 data-work-animate className="mt-3 text-[clamp(1.9rem,4.8vw,3.8rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--text-primary)]">
              Real-World Engineering
            </h2>
            <p data-work-animate className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              Scroll through each chapter to see progression from problem framing to
              production outcomes.
            </p>
          </div>
        </article>

        {/* Work Cards */}
        {workExperience.map((work, index) => {
          const palette = artisticPalettes[index % artisticPalettes.length];
          return (
            <article
              key={`${work.period}-${work.role}`}
              data-work-card
              className="absolute inset-0 flex flex-col justify-center px-[clamp(1rem,5vw,4rem)]"
              style={{
                willChange: "transform, opacity",
                background: `radial-gradient(ellipse at 80% 20%, color-mix(in srgb, ${palette.primary} 20%, #050505) 0%, color-mix(in srgb, ${palette.secondary} 25%, #0a0a0c) 100%)`,
              }}
            >

              <div className="relative z-10 mx-auto w-full max-w-7xl h-full flex flex-col justify-center">
                
                {/* Top Section: Title & Role */}
                <div className="w-full relative z-20 mb-12">
                  <h3
                    data-work-animate
                    className="text-[clamp(3rem,6vw,5rem)] font-black uppercase tracking-tight text-white"
                    style={{ textShadow: `0 20px 50px color-mix(in srgb, ${palette.primary} 40%, transparent)` }}
                  >
                    {work.organization}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span data-work-animate className="font-mono text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: palette.primary }}>
                      {work.period}
                    </span>
                    <span data-work-animate className="hidden md:block h-1.5 w-1.5 rounded-full bg-white/30" />
                    <p data-work-animate className="text-xl md:text-2xl font-light text-white/80">
                      {work.role}
                    </p>
                  </div>
                </div>

                {/* Bottom Section: The two inner cards placed dynamically */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-30">
                  
                  {/* Inner Card 1: Overview & Stack */}
                  <div data-work-animate className="p-8 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                    <p className="text-[clamp(1rem,1.2vw,1.15rem)] font-medium text-white/90 leading-relaxed">
                      {work.overview}
                    </p>
                    <div className="mt-10 pt-6 border-t border-white/10">
                      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50 mb-4">
                        Core Stack
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {work.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Inner Card 2: Outcomes */}
                  <div data-work-animate className="p-8 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50 mb-6">
                      Outcome Focus
                    </p>
                    <ul className="space-y-5">
                      {work.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="text-sm md:text-base text-white/80 flex items-start leading-relaxed group"
                        >
                          <span className="mr-4 font-bold text-lg leading-none transition-transform group-hover:translate-x-1" style={{ color: palette.primary }}>
                            →
                          </span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
