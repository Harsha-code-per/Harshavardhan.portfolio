"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";

export function HorizontalProjects() {
  setupGsap();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [activeProject, setActiveProject] = useState(0);

  useGSAP(
    () => {
      const track = trackRef.current;
      const wrapper = wrapperRef.current;
      const progress = progressRef.current;
      if (!track || !wrapper || !progress) {
        return;
      }

      /* Wait for layout to settle before calculating widths */
      const initTimeout = setTimeout(() => {
        const getScrollAmount = () =>
          -(track.scrollWidth - window.innerWidth);

        gsap.set(track, { x: 0 });

        gsap.to(track, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () =>
              `+=${Math.abs(getScrollAmount())}`,
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              /* Update progress bar */
              gsap.set(progress, {
                scaleX: self.progress,
                transformOrigin: "left center",
              });

              /* Update active project index */
              const idx = Math.min(
                Math.floor(self.progress * projects.length),
                projects.length - 1
              );
              setActiveProject(idx);
            },
          },
        });

        /* Per-card reveal animation */
        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
        cards.forEach((card) => {
          const inner = card.querySelectorAll("[data-project-reveal]");

          gsap.fromTo(
            inner,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "left 80%",
                containerAnimation: undefined,
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(initTimeout);
      };
    },
    { scope: wrapperRef, dependencies: [] }
  );

  const accentColors = [
    "var(--accent-primary)",
    "var(--accent-secondary)",
    "var(--accent-tertiary)",
  ];

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        ref={wrapperRef}
        className="projects-wrapper relative h-[100dvh] overflow-hidden"
      >
        {/* ── Sticky header ──────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] py-6"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent-primary-light)]">
              Featured Projects
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {projects.map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: activeProject === index ? "20px" : "6px",
                    background:
                      activeProject === index
                        ? accentColors[index % accentColors.length]
                        : "var(--border-hover)",
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-sm text-[var(--text-muted)]">
              {String(activeProject + 1).padStart(2, "0")}/
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ── Horizontal track ───────────────────────────────────── */}
        <div
          ref={trackRef}
          className="projects-track flex h-full flex-nowrap"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, index) => {
            const accentColor = accentColors[index % accentColors.length];

            return (
              <article
                key={project.slug}
                data-project-card
                className="relative flex h-full w-screen shrink-0 flex-col justify-center overflow-hidden px-[clamp(1.5rem,5vw,4rem)]"
                style={{
                  background: `linear-gradient(135deg, var(--bg-surface) 0%, color-mix(in srgb, ${accentColor} 8%, var(--bg-base)) 100%)`,
                }}
              >
                {/* Background number */}
                <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 select-none text-[clamp(12rem,25vw,22rem)] font-black text-white opacity-[0.03]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Left accent bar */}
                <span
                  className="absolute left-0 top-0 h-full w-[3px]"
                  style={{ background: accentColor }}
                />

                {/* Content */}
                <div className="relative z-10 max-w-4xl pt-16">
                  <p
                    data-project-reveal
                    className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]"
                  >
                    Featured Project
                  </p>
                  <h2
                    data-project-reveal
                    className="mt-4 text-[clamp(3rem,8vw,7rem)] font-black leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)]"
                  >
                    {project.title}
                  </h2>
                  <p
                    data-project-reveal
                    className="mt-5 max-w-3xl text-base text-[var(--text-secondary)] md:text-xl"
                  >
                    {project.oneLiner}
                  </p>
                  <p
                    data-project-reveal
                    className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
                  >
                    {project.summary}
                  </p>

                  {/* Impact metric */}
                  <div
                    data-project-reveal
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: accentColor }}
                    />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {project.impact}
                    </span>
                  </div>

                  <div
                    data-project-reveal
                    className="mt-7 flex flex-wrap gap-2.5"
                  >
                    {project.stack.map((tech) => (
                      <Badge
                        key={tech}
                        className="card-glass border-[var(--border-default)] bg-[var(--bg-elevated)] text-[0.68rem] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    data-cursor="hover"
                    data-project-reveal
                    className="mt-10 w-fit rounded-full border px-8 py-3 text-sm font-semibold text-[var(--text-primary)] transition"
                    style={{ borderColor: "var(--border-hover)" }}
                    whileHover={{
                      borderColor: accentColor,
                      backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                      scale: 1.03,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Project →
                  </motion.button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Progress bar ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-[var(--border-default)]" />
        <div
          ref={progressRef}
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0"
          style={{ background: "var(--accent-primary)" }}
        />
      </div>
    </section>
  );
}
