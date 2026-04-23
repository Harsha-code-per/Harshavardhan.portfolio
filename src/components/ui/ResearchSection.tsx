"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { researchEntries } from "@/data/research";
import { gsap, setupGsap } from "@/lib/gsap";

function ResearchCard({
  entry,
  index,
}: {
  entry: (typeof researchEntries)[number];
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [5, -5]);
  const rotateY = useTransform(x, [-80, 80], [-5, 5]);
  const smoothRX = useSpring(rotateX, { damping: 25, stiffness: 200 });
  const smoothRY = useSpring(rotateY, { damping: 25, stiffness: 200 });

  const accents = [
    "var(--accent-tertiary)",
    "var(--accent-primary)",
    "var(--accent-secondary)",
  ];
  const accent = accents[index % accents.length];

  return (
    <motion.article
      data-research-card
      className="card-glass group relative overflow-hidden rounded-2xl p-6"
      style={{
        borderLeft: `3px solid ${accent}`,
        rotateX: smoothRX,
        rotateY: smoothRY,
        transformPerspective: 800,
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - (rect.left + rect.width / 2));
        y.set(event.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 40px color-mix(in srgb, ${accent} 20%, transparent)`,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: accent }}
      />

      <p
        className="font-mono text-xs uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {entry.area}
      </p>
      <h3 className="text-gradient-retro mt-3 text-xl font-bold md:text-2xl">
        {entry.title}
      </h3>
      <p
        className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em]"
        style={{ color: accent }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
        />
        {entry.status}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {entry.summary}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[0.65rem] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href="#"
        data-cursor="hover"
        className="group/link mt-6 inline-flex items-center gap-2 text-sm text-[var(--text-primary)]"
      >
        <span className="border-b border-transparent transition group-hover/link:border-current">
          View Publication
        </span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
      </a>
    </motion.article>
  );
}

export function ResearchSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-research-heading]", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          invalidateOnRefresh: true,
        },
      });

      gsap.from("[data-research-card]", {
        opacity: 0,
        y: 44,
        scale: 0.96,
        stagger: 0.12,
        duration: 0.76,
        ease: "power2.out",
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
      id="research"
      ref={sectionRef}
      className="relative overflow-hidden px-[clamp(1rem,5vw,4rem)] py-20"
      style={{ background: "var(--chapter-surface)" }}
    >
      {/* Orbital decoration */}
      <div className="pointer-events-none absolute right-[clamp(1rem,6vw,5rem)] top-16 hidden h-[clamp(12rem,18vw,16rem)] w-[clamp(12rem,18vw,16rem)] rounded-full border border-[var(--border-default)] lg:block">
        <span className="orbital-dot absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[var(--accent-tertiary)] shadow-[0_0_20px_var(--accent-tertiary-glow)]" />
        <span className="orbital-dot absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[var(--accent-primary-light)] shadow-[0_0_20px_var(--accent-primary-glow)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <p
          data-research-heading
          className="text-xs uppercase tracking-[0.3em] text-[var(--accent-tertiary)]"
        >
          Research
        </p>
        <h2
          data-research-heading
          className="mt-3 text-[clamp(1.9rem,4.8vw,3.6rem)] font-black uppercase tracking-tight text-[var(--text-primary)]"
        >
          Exploration Beyond Shipping
        </h2>
        <p
          data-research-heading
          className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
        >
          Structured experimentation that turns ideas into practical systems.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {researchEntries.map((entry, index) => (
            <ResearchCard key={entry.title} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
