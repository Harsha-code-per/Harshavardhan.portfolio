"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, setupGsap } from "@/lib/gsap";
import { workExperience, workHeaderQuote } from "@/data/work";

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function WorkShowcase() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(".work-card", stage);
      if (!cards.length) {
        return;
      }

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: index + 1,
          y: index === 0 ? "0%" : "110%",
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          transformOrigin: "center center",
          willChange: "transform,opacity,filter",
          force3D: true,
        });
      });

      if (cards.length === 1) {
        const singleReveal = gsap.from(cards[0], {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          singleReveal.scrollTrigger?.kill();
          singleReveal.kill();
        };
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${(cards.length - 1) * window.innerHeight}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const maxStep = cards.length - 1;
            const idx = Math.min(Math.round(self.progress * maxStep), maxStep);
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              
              const dots = document.querySelectorAll('.progress-dot');
              dots.forEach((dot, i) => {
                const el = dot as HTMLElement;
                if (i === idx) {
                  el.style.width = '24px';
                  el.style.background = progressColors[i % progressColors.length];
                } else {
                  el.style.width = '8px';
                  el.style.background = 'rgba(255,255,255,0.16)';
                }
              });
              
              const text = document.querySelector('.progress-text');
              if (text) {
                text.textContent = `${String(idx + 1).padStart(2, '0')}/${String(workExperience.length).padStart(2, '0')}`;
              }
            }
          },
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const incomingCard = cards[index + 1];
        timeline
          .to(
            card,
            {
              y: "-12%",
              scale: 0.94,
              opacity: 0.35,
              rotateX: 8,
              transformPerspective: 1200,
              filter: "blur(8px) brightness(0.65)",
              duration: 1,
              ease: "power2.inOut",
              overwrite: "auto",
            },
            index === 0 ? 0 : ">"
          )
          .fromTo(
            incomingCard,
            { y: "110%", opacity: 1, scale: 1 },
            {
              y: "0%",
              opacity: 1,
              scale: 1,
              rotateX: 0,
              duration: 1,
              ease: "power3.out",
              overwrite: "auto",
            },
            "<"
          )
          .to({}, { duration: 0.15 });
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  const progressColors = ["var(--chapter-accent)", "var(--chapter-accent-alt)"];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-20 w-full bg-[#0c0b0a] text-[var(--chapter-ink)]"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-28 h-28 bg-gradient-to-b from-transparent to-[var(--chapter-bg)]" />
      <div className="mx-auto w-full max-w-7xl px-[clamp(1rem,4vw,3.5rem)] py-24">
        <header className="max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--chapter-muted)]">
            Professional Experience
          </p>
          <p className="mt-4 text-[clamp(1rem,1.45vw,1.3rem)] leading-relaxed text-[var(--chapter-muted)]">
            {workHeaderQuote}
          </p>
        </header>

        <div className="mt-6 flex items-center gap-2">
          {workExperience.map((_, index) => (
            <span
              key={index}
              className="progress-dot h-2 rounded-full transition-all duration-300"
              style={{
                width: index === 0 ? "24px" : "8px",
                background:
                  index === 0
                    ? progressColors[0]
                    : "rgba(255,255,255,0.16)",
              }}
            />
          ))}
          <span className="progress-text ml-2 font-mono text-xs text-[var(--chapter-muted)]">
            01/{String(workExperience.length).padStart(2, "0")}
          </span>
        </div>

        <div
          ref={stageRef}
          className="relative mt-10"
          style={{ height: `${Math.max(workExperience.length, 1) * 100}vh` }}
        >
          <div className="sticky top-0 h-screen" style={{ overflow: 'clip' }}>
            {workExperience.map((work, index) => {
              const accent = work.themeColor;
              const accentSoft = hexToRgba(accent, 0.08);
              const accentGlow = hexToRgba(accent, 0.18);
              const accentMuted = hexToRgba(accent, 0.35);

              return (
                <article
                  key={`${work.organization}-${work.period}`}
                  data-work-card
                  className="work-card absolute inset-0 flex items-center justify-center px-[clamp(1rem,4vw,3rem)]"
                  style={{ zIndex: index + 1 }}
                >
                  {index === 0 ? (
                    <div
                      className="relative h-[80vh] w-[95vw] max-w-[1200px] overflow-hidden rounded-[2rem] border p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.25)] md:p-12"
                      style={{
                        background: "var(--chapter-surface)",
                        borderColor: accentMuted,
                        boxShadow: `0 -20px 60px ${accentGlow}`,
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-color-dodge"
                        style={{
                          background: `radial-gradient(circle_at_18%_22%, ${accentSoft}, transparent 58%), radial-gradient(circle_at_86%_80%, ${accentSoft}, transparent 48%)`,
                        }}
                      />
                      <div className="relative z-10 grid h-full gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
                        <div className="space-y-7">
                          <div className="space-y-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chapter-muted)]">
                              {work.period}
                            </p>
                            <h3 
                              className="font-[var(--font-serif)] text-[clamp(3.2rem,8.8vw,7.4rem)] font-normal capitalize leading-[0.86] tracking-[-0.02em] text-[var(--chapter-ink)]"
                              style={{ fontFamily: "var(--font-serif)" }}
                            >
                              {work.organization}
                            </h3>
                          </div>

                          <p className="max-w-xl text-[clamp(1rem,1.6vw,1.3rem)] leading-relaxed text-[var(--chapter-muted)]">
                            {work.overview}
                          </p>

                          <div className="flex items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: accent,
                                boxShadow: `0 0 16px ${accentGlow}`,
                              }}
                            />
                            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--chapter-muted)]">
                              Role
                            </span>
                            <p className="text-base text-[var(--chapter-ink)]">{work.role}</p>
                          </div>
                        </div>

                        <aside
                          className="rounded-2xl border p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:p-7"
                          style={{
                            borderColor: accentMuted,
                            background: "rgba(0,0,0,0.28)",
                          }}
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--chapter-muted)]">
                            Outcomes
                          </p>
                          <ul className="mt-4 space-y-3">
                            {work.outcomes.map((outcome) => (
                              <li key={outcome} className="text-sm leading-relaxed text-[var(--chapter-muted)]">
                                {outcome}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-7 border-t pt-5" style={{ borderColor: accentSoft }}>
                            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--chapter-muted)]">
                              Tech Stack
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {work.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                                  style={{
                                    borderColor: accentMuted,
                                    background: accentSoft,
                                    color: "var(--chapter-ink)",
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </aside>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative h-[80vh] w-[95vw] max-w-[1200px] overflow-hidden rounded-[2rem] border p-7 md:p-12"
                      style={{
                        background: "var(--chapter-surface)",
                        borderColor: accentMuted,
                        boxShadow: `0 -20px 60px ${hexToRgba(accent, 0.08)}`,
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-color-dodge"
                        style={{
                          background: `radial-gradient(circle_at_16%_22%, ${accentSoft}, transparent 58%), radial-gradient(circle_at_84%_82%, ${accentSoft}, transparent 48%)`,
                        }}
                      />
                      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chapter-muted)]">
                            {work.period}
                          </p>
                          <h3 
                            className="font-[var(--font-serif)] text-[clamp(3.2rem,10vw,8rem)] font-normal capitalize leading-[0.84] tracking-[-0.02em] text-[var(--chapter-ink)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {work.organization}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: accent,
                                boxShadow: `0 0 16px ${accentGlow}`,
                              }}
                            />
                            <p className="text-base text-[var(--chapter-ink)]">{work.role}</p>
                          </div>
                        </div>

                        <div className="mt-8 grid flex-1 gap-7 md:grid-cols-[1.05fr_0.95fr]">
                          <div className="space-y-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chapter-muted)]">
                              Overview
                            </p>
                            <p className="text-[1.02rem] leading-relaxed text-[var(--chapter-muted)]">
                              {work.overview}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chapter-muted)]">
                              Outcomes
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {work.outcomes.map((outcome) => (
                                <p
                                  key={outcome}
                                  className="rounded-xl border p-3 text-sm leading-relaxed"
                                  style={{
                                    borderColor: accentMuted,
                                    background: hexToRgba(accent, 0.07),
                                    color: "var(--chapter-ink)",
                                  }}
                                >
                                  {outcome}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-7 border-t pt-5" style={{ borderColor: accentSoft }}>
                          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--chapter-muted)]">
                            Tech Stack
                          </p>
                          <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                            {work.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]"
                                style={{
                                  borderColor: accentMuted,
                                  background: hexToRgba(accent, 0.08),
                                  color: "var(--chapter-ink)",
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <p className="mt-5 text-center text-sm text-[var(--chapter-muted)]">
                            {work.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
