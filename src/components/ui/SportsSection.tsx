"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
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
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-secondary)]">
          Sports
        </p>
        <h2 className="mt-3 text-[clamp(1.8rem,4.6vw,3.5rem)] font-black uppercase tracking-tight text-[var(--text-primary)]">
          Discipline Behind the Craft
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          The same intensity and discipline from sports fuels my engineering practice.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sportsEntries.map((sport, index) => (
            <motion.article
              key={sport.title}
              data-sports-card
              className="card-glass group relative overflow-hidden rounded-2xl p-7"
              style={{ borderLeft: "3px solid var(--accent-secondary)" }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px var(--accent-secondary-glow)",
                borderColor: "var(--accent-secondary-light)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--accent-secondary)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="flex items-center gap-3">
                <span className="inline-block h-1 w-4 rounded-full bg-[var(--accent-secondary)]" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
                {sport.title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-[var(--accent-secondary)]">
                {sport.level}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                {sport.summary}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
