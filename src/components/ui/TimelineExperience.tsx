"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
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
  const spineRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-journey-item]");

      /* ── Animated spine line that draws as user scrolls ─────── */
      if (spineRef.current) {
        gsap.fromTo(
          spineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* ── Staggered reveal for each milestone ───────────────── */
      items.forEach((item, index) => {
        const card = item.querySelector<HTMLElement>("[data-journey-card]");
        const dot = item.querySelector<HTMLElement>("[data-milestone-dot]");
        const title = item.querySelector<HTMLElement>("[data-journey-title]");
        const copy = item.querySelectorAll<HTMLElement>("[data-journey-copy]");

        /* Entrance animation: alternating slide direction */
        gsap.fromTo(
          item,
          {
            x: index % 2 === 0 ? -40 : 40,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              invalidateOnRefresh: true,
            },
          }
        );

        /* Active milestone state on scroll */
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          invalidateOnRefresh: true,
          onEnter: () => activateMilestone(card, dot, title, copy),
          onEnterBack: () => activateMilestone(card, dot, title, copy),
          onLeave: () => resetMilestone(card, dot, title, copy),
          onLeaveBack: () => resetMilestone(card, dot, title, copy),
        });
      });

      /* ── Heading reveal ────────────────────────────────────── */
      gsap.from("[data-journey-heading]", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          invalidateOnRefresh: true,
        },
      });

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        cancelAnimationFrame(refreshFrame);
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative px-6 py-24 md:px-10 lg:px-16"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <p
            data-journey-heading
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary-light)]"
          >
            Journey Timeline
          </p>
          <h2
            data-journey-heading
            className="mt-3 text-[clamp(1.8rem,4vw,3.3rem)] font-black uppercase tracking-tight text-[var(--text-primary)]"
          >
            Milestones in AI & Engineering
          </h2>
          <p
            data-journey-heading
            className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
          >
            Key chapters in my engineering journey — from academic foundations to production delivery.
          </p>
        </div>

        <div className="relative space-y-8">
          {/* Background spine line */}
          <span className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-[var(--border-default)] md:block" />
          {/* Animated progress spine */}
          <span
            ref={spineRef}
            className="absolute left-8 top-8 hidden h-0 w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent-primary), var(--accent-tertiary))",
              boxShadow: "0 0 8px var(--accent-primary-glow)",
            }}
          />

          {journeyMilestones.map((milestone, index) => (
            <article
              data-journey-item
              key={`${milestone.year}-${milestone.title}`}
              className="relative ml-16 grid grid-cols-1 gap-3 lg:ml-24"
              style={{ opacity: 0 }}
            >
              <motion.div
                data-journey-card
                className="card-glass relative rounded-2xl p-6"
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 0 30px var(--accent-primary-glow)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Milestone dot */}
                <span
                  data-milestone-dot
                  className="absolute -left-10 top-7 hidden h-3.5 w-3.5 rounded-full md:block"
                  style={{
                    background: "var(--border-default)",
                    transition: "all 0.35s ease",
                  }}
                />

                <div className="flex items-center gap-3">
                  <p className="font-mono text-[0.8rem] uppercase tracking-wide text-[var(--accent-primary-light)]">
                    {milestone.year}
                  </p>
                  <span className="h-px flex-1 bg-[var(--border-default)]" />
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  data-journey-title
                  className="mt-3 text-[1.1rem] font-bold text-[var(--text-primary)] transition-colors duration-300"
                >
                  {milestone.title}
                </h3>

                <div className="mt-4 space-y-2">
                  {milestone.highlights.map((highlight) => (
                    <p
                      key={highlight}
                      data-journey-copy
                      className="text-sm leading-[1.7] text-[var(--text-secondary)] transition-colors duration-300"
                    >
                      {highlight}
                    </p>
                  ))}
                </div>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function activateMilestone(
  card: HTMLElement | null,
  dot: HTMLElement | null,
  title: HTMLElement | null,
  copy: NodeListOf<HTMLElement>
) {
  if (card) {
    gsap.to(card, {
      borderColor: "var(--accent-primary)",
      boxShadow: "0 0 34px var(--accent-primary-glow)",
      duration: 0.35,
      ease: "power2.out",
    });
  }

  if (dot) {
    gsap.to(dot, {
      scale: 1.6,
      backgroundColor: "var(--accent-primary)",
      boxShadow: "0 0 22px var(--accent-primary-glow)",
      duration: 0.35,
      ease: "power2.out",
    });
  }

  if (title) {
    gsap.to(title, {
      color: "var(--accent-primary-light)",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  if (copy.length > 0) {
    gsap.to(copy, {
      color: "var(--text-primary)",
      duration: 0.3,
      stagger: 0.03,
      ease: "power2.out",
    });
  }
}

function resetMilestone(
  card: HTMLElement | null,
  dot: HTMLElement | null,
  title: HTMLElement | null,
  copy: NodeListOf<HTMLElement>
) {
  if (card) {
    gsap.to(card, {
      borderColor: "var(--border-default)",
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  if (dot) {
    gsap.to(dot, {
      scale: 1,
      backgroundColor: "var(--border-default)",
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  if (title) {
    gsap.to(title, {
      color: "var(--text-primary)",
      duration: 0.3,
      ease: "power2.out",
    });
  }

  if (copy.length > 0) {
    gsap.to(copy, {
      color: "var(--text-secondary)",
      duration: 0.3,
      ease: "power2.out",
    });
  }
}
