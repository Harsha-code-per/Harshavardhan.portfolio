"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
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
  // Replaced: useMotionValue + useSpring + useTransform (4 ticking physics springs removed)
  // Pure CSS hover transition — zero JS per-frame cost
  const accents = [
    "var(--accent-tertiary)",
    "var(--accent-primary)",
    "var(--accent-secondary)",
  ];
  const accent = accents[index % accents.length];

  return (
    <article
      data-research-card
      className="card-glass group relative overflow-hidden rounded-2xl p-6"
      style={{
        borderLeft: `3px solid ${accent}`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px color-mix(in srgb, ${accent} 15%, transparent)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Glow orb — CSS transition only */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: accent, filter: "blur(30px)" }}
      />

      <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
        {entry.area}
      </p>
      <h3 className="text-gradient-violet mt-3 text-xl font-bold md:text-2xl">
        {entry.title}
      </h3>
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em]" style={{ color: accent }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
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
    </article>
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
      className="relative overflow-hidden px-[clamp(1rem,5vw,4rem)] pt-20 pb-32"
      style={{ 
        backgroundColor: "var(--bg-base)",
        backgroundImage: "radial-gradient(circle at 80% 20%, var(--accent-primary-subtle) 0%, transparent 50%), radial-gradient(circle at 20% 80%, var(--accent-secondary-subtle) 0%, transparent 50%)"
      }}
    >
      {/* Orbital decoration - Extreme top right corner of the screen */}
      <div className="pointer-events-none absolute right-8 top-16 hidden h-[240px] w-[240px] rounded-full border border-white/10 lg:block opacity-80 z-0">
        {/* Orbit 1 - Fast forward spin */}
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[var(--accent-tertiary)] shadow-[0_0_20px_var(--accent-tertiary-glow)]" />
        </div>

        {/* Orbit 2 - Slower reverse spin */}
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
          <span className="absolute top-1/2 -left-1.5 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary-glow)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        <p data-research-heading className="text-xs uppercase tracking-[0.3em] text-[var(--accent-tertiary)] relative z-10">
          Research
        </p>
        <h2
          data-research-heading
          className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 relative z-10 w-full lg:whitespace-nowrap"
        >
          Exploration Beyond Shipping
        </h2>
        <p
          data-research-heading
          className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base relative z-10"
        >
          Structured experimentation that turns ideas into practical systems.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 relative z-20">
          {researchEntries.map((entry, index) => (
            <ResearchCard key={entry.title} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
