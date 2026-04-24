"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { sportsEntries } from "@/data/sports";
import { gsap, setupGsap } from "@/lib/gsap";

export function SportsSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      if (!stripRef.current) {
        return;
      }

      /* Removed kinetic typography scrub; using CSS marquee instead */

      /* Card reveal with rotation */
      gsap.from("[data-sports-card]", {
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotateZ: (index: number) => (index % 2 === 0 ? -2 : 2),
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="sports"
      ref={sectionRef}
      className="relative overflow-hidden px-[clamp(1rem,5vw,4rem)] py-20"
      style={{
        background: `repeating-linear-gradient(
          -45deg,
          var(--bg-base),
          var(--bg-base) 10px,
          var(--bg-surface) 10px,
          var(--bg-surface) 11px
        )`,
      }}
    >

      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-tertiary)]">
          Sports
        </p>
        <h2 className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Discipline Behind the Craft
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          The same intensity and discipline from sports fuels my engineering practice.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sportsEntries.map((sport, index) => (
            <article
              key={sport.title}
              data-sports-card
              className="card-glass group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 ease-out"
              style={{ borderLeft: "3px solid var(--accent-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 30px var(--accent-primary-glow)";
                e.currentTarget.style.borderColor = "var(--accent-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[var(--accent-primary)] opacity-0 transition-opacity duration-500 group-hover:opacity-10" style={{ filter: "blur(40px)" }} />

              <div className="flex items-center gap-3">
                <span className="inline-block h-1 w-4 rounded-full bg-[var(--accent-primary)]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary-light)]">
                {sport.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[var(--accent-secondary)]">
                {sport.level}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {sport.summary}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
