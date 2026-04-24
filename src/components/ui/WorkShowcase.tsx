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

      /* Use a more conservative scroll distance */
      const scrollPerCard = window.innerHeight * 1.2;
      const totalScroll = scrollPerCard * (cards.length - 1);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top+=96",
          end: () => `+=${Math.max(totalScroll, 800)}`,
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * cards.length),
              cards.length - 1
            );
            
            // Update dots via DOM
            const dots = document.querySelectorAll("[data-work-dot]");
            const accentColors = [
              "var(--accent-primary)",
              "var(--accent-secondary)",
              "var(--accent-tertiary)",
            ];
            
            dots.forEach((dot, i) => {
              const el = dot as HTMLElement;
              if (i === idx) {
                el.style.width = "24px";
                el.style.background = accentColors[i % accentColors.length];
              } else {
                el.style.width = "8px";
                el.style.background = "var(--border-hover)";
              }
            });

            // Update counter via DOM
            const counter = document.querySelector("[data-work-counter]");
            if (counter) {
              counter.textContent = `${String(idx + 1).padStart(2, "0")}/${String(cards.length).padStart(2, "0")}`;
            }
          },
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];
        const currentInner = card.querySelectorAll("[data-work-animate]");
        const nextInner = nextCard.querySelectorAll("[data-work-animate]");
        const position = index;

        /* Current card exits up with slight rotation */
        timeline
          .to(
            card,
            {
              yPercent: -30,
              opacity: 0,
              scale: 0.92,
              duration: 0.5,
              ease: "power2.inOut",
              overwrite: "auto",
            },
            position
          )
          .to(
            currentInner,
            {
              opacity: 0,
              y: -18,
              duration: 0.3,
              stagger: 0.03,
              overwrite: "auto",
            },
            position
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
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            },
            position + 0.15
          )
          .fromTo(
            nextInner,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
              overwrite: "auto",
            },
            position + 0.28
          );
      });

    },
    { scope: sectionRef, dependencies: [] }
  );

  const accentColors = [
    "var(--accent-primary)",
    "var(--accent-secondary)",
    "var(--accent-tertiary)",
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative isolate px-[clamp(1rem,5vw,4rem)] py-20"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-primary-light)]">
          Work
        </p>
        <h2 className="mt-3 text-[clamp(1.9rem,4.8vw,3.8rem)] font-black uppercase leading-[0.95] tracking-tight text-[var(--text-primary)]">
          Real-World Engineering
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          Scroll through each chapter to see progression from problem framing to
          production outcomes.
        </p>

        {/* ── Progress dots ──────────────────────────────────────── */}
        <div className="mt-6 flex items-center gap-2">
          {workExperience.map((_, index) => (
            <span
              key={index}
              data-work-dot
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: index === 0 ? "24px" : "8px",
                background:
                  index === 0
                    ? accentColors[0]
                    : "var(--border-hover)",
              }}
            />
          ))}
          <span data-work-counter className="ml-2 font-mono text-xs text-[var(--text-muted)]">
            01/{String(workExperience.length).padStart(2, "0")}
          </span>
        </div>

        <div ref={stageRef} className="relative mt-8 h-[70vh] md:h-[76vh]">
          {workExperience.map((work, index) => (
            <article
              key={`${work.period}-${work.role}`}
              data-work-card
              className="card-glass absolute inset-0 rounded-3xl p-7 md:p-8"
            >
              <div
                className="grid h-full grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr]"
                style={{
                  borderLeft: `3px solid ${accentColors[index % accentColors.length]}`,
                  paddingLeft: "1rem",
                }}
              >
                <div>
                  <p
                    data-work-animate
                    className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]"
                  >
                    {work.period}
                  </p>
                  <h3
                    data-work-animate
                    className="mt-3 text-2xl font-bold text-[var(--text-primary)]"
                  >
                    {work.organization}
                  </h3>
                  <p
                    data-work-animate
                    className="mt-1 text-sm text-[var(--text-secondary)]"
                  >
                    {work.role}
                  </p>
                  <p
                    data-work-animate
                    className="mt-1 text-sm text-[var(--text-secondary)]"
                  >
                    {work.organization} · {work.location}
                  </p>
                  <p
                    data-work-animate
                    className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
                  >
                    {work.overview}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {work.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        data-work-animate
                        className="text-sm text-[var(--text-secondary)]"
                      >
                        <span className="mr-2 text-[var(--accent-primary-light)]">
                          →
                        </span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-glass flex h-full flex-col justify-between rounded-2xl p-5">
                  <div>
                    <p
                      data-work-animate
                      className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--accent-tertiary)]"
                    >
                      Core Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {work.technologies.map((technology) => (
                        <span
                          key={technology}
                          data-work-animate
                          className="rounded-full border px-3 py-1 text-xs"
                          style={{
                            background: "var(--bg-elevated)",
                            borderColor: "var(--border-default)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3">
                    <p
                      data-work-animate
                      className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Outcome Focus
                    </p>
                    <p
                      data-work-animate
                      className="mt-1 text-sm text-[var(--text-secondary)]"
                    >
                      Production-grade delivery with measurable engineering impact.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
