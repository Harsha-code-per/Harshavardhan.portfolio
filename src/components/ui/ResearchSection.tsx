"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { researchEntries } from "@/data/research";
import { gsap, setupGsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";

export function ResearchSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-research-heading]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      gsap.from("[data-research-card]", {
        opacity: 0,
        y: 44,
        rotateX: 8,
        stagger: 0.1,
        duration: 0.76,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.to("[data-research-orb]", {
        yPercent: -26,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="research" ref={sectionRef} className="relative overflow-hidden bg-[#f5eddf] px-6 py-20 md:px-10 lg:px-16">
      <div
        data-research-orb
        className="pointer-events-none absolute -right-16 top-24 h-44 w-44 rounded-full bg-gradient-to-br from-violet-300/35 to-amber-200/25 blur-2xl"
      />
      <div className="mx-auto w-full max-w-7xl">
        <p data-research-heading className="text-xs uppercase tracking-[0.3em] text-violet-600/75">
          Research
        </p>
        <h2
          data-research-heading
          className="mt-3 text-[clamp(1.9rem,4.8vw,3.6rem)] font-black uppercase tracking-tight text-zinc-900"
        >
          Exploration Beyond Shipping
        </h2>
        <p data-research-heading className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
          Structured experimentation that turns ideas into practical systems.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {researchEntries.map((entry) => (
            <article
              key={entry.title}
              data-research-card
              className="rounded-2xl border border-[#e2d1bc] bg-white/90 p-6 shadow-[0_16px_45px_-34px_rgba(84,58,35,0.45)] transition-colors hover:border-violet-300/45"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-violet-600/75">{entry.area}</p>
              <h3 className="mt-3 text-xl font-semibold text-zinc-900">{entry.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">{entry.summary}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-500">{entry.status}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
