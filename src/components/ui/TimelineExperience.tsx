"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { publications } from "@/data/publications";
import { workExperience } from "@/data/work";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

type JourneyMilestone = {
  year: string;
  title: string;
  highlights: string[];
};

const journeyMilestones: JourneyMilestone[] = [
  ...workExperience.map((work) => ({
    year: work.period,
    title: `${work.role} · ${work.organization}`,
    highlights: [work.overview, ...work.outcomes],
  })),
  ...publications.map((publication) => ({
    year: publication.year,
    title: publication.title,
    highlights: [publication.publisher, publication.summary],
  })),
];

export function TimelineExperience() {
  setupGsap();
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // 1. Spine Progress
      gsap.fromTo(
        ".progress-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // 2. Card Entrances and Active States
      const cards = gsap.utils.toArray<HTMLElement>("[data-journey-card]");
      cards.forEach((card, index) => {
        const inner = card.querySelector(".journey-inner");
        
        // Entrance animation
        gsap.fromTo(
          inner,
          { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Active state toggling
        ScrollTrigger.create({
          trigger: card,
          start: "top 50%",
          end: "bottom 50%",
          toggleClass: { targets: card, className: "is-active" },
          invalidateOnRefresh: true,
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative px-[clamp(1rem,5vw,4rem)] py-20"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary-light)]">
            Journey Timeline
          </p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3.3rem)] font-black uppercase tracking-tight text-[var(--text-primary)]">
            Milestones in AI & Engineering
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            Key chapters in my engineering journey — from academic foundations to production delivery.
          </p>
        </div>

        <div className="relative">
          {/* Spine container - positioned exactly at left: 31.5px to intersect center of 64px col */}
          <div className="absolute left-[31.5px] top-10 bottom-0 w-px hidden md:block z-0">
            <span className="absolute inset-0 w-full bg-white/10" />
            <span
              className="progress-spine absolute top-0 left-0 w-full h-full origin-top"
              style={{
                background: "linear-gradient(to bottom, var(--accent-primary), var(--accent-tertiary))",
                boxShadow: "0 0 12px var(--accent-primary-glow)",
                transform: "scaleY(0)",
              }}
            />
          </div>

          <div className="relative flex flex-col gap-6 z-10">
            {journeyMilestones.map((milestone, index) => (
              <article
                key={`${milestone.year}-${milestone.title}`}
                data-journey-card
                className="group relative flex items-start w-full"
              >
                {/* Dot Container */}
                <div className="hidden md:flex w-16 shrink-0 justify-center pt-8 z-10">
                  <span
                    className="journey-dot h-4 w-4 rounded-full border-2 border-white/20 bg-[var(--bg-surface)] transition-all duration-300"
                  />
                </div>

                {/* Card Container */}
                <div className="flex-1 min-w-0">
                  <div className="journey-inner card-glass journey-card relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_var(--accent-primary-glow)]">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-[0.8rem] uppercase tracking-wide text-[var(--accent-primary-light)]">
                        {milestone.year}
                      </p>
                      <span className="h-px flex-1 bg-[var(--border-default)]" />
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="journey-title mt-3 text-[1.1rem] font-bold text-[var(--text-primary)] transition-colors duration-300">
                      {milestone.title}
                    </h3>

                    <div className="mt-4 space-y-2">
                      {milestone.highlights.map((highlight) => (
                        <p
                          key={highlight}
                          className="journey-copy text-sm leading-[1.7] text-[var(--text-secondary)] transition-colors duration-300"
                        >
                          {highlight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
