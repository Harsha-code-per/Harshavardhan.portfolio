"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { sportsEntries } from "@/data/sports";
import { gsap, setupGsap } from "@/lib/gsap";

export function SportsSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.to("[data-sports-track]", {
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from("[data-sports-card]", {
        opacity: 0,
        x: (index) => (index % 2 === 0 ? -70 : 70),
        rotateZ: (index) => (index % 2 === 0 ? -2.5 : 2.5),
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="sports"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f4ecde] px-6 py-20 md:px-10 lg:px-16"
    >
      <p
        data-sports-track
        className="pointer-events-none absolute left-6 top-5 text-[clamp(2.2rem,12vw,8rem)] font-black uppercase tracking-[0.08em] text-white/45"
      >
        Energy · Discipline · Drive
      </p>
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-600/75">Sports</p>
        <h2 className="mt-3 text-[clamp(1.8rem,4.6vw,3.5rem)] font-black uppercase tracking-tight text-zinc-900">
          Discipline Behind the Craft
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sportsEntries.map((sport) => (
            <article
              key={sport.title}
              data-sports-card
              className="rounded-2xl border border-[#e3d2bd] bg-gradient-to-br from-[#fffdfa] to-[#f5ece0] p-7 shadow-[0_16px_45px_-34px_rgba(84,58,35,0.45)]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-violet-600/75">{sport.level}</p>
              <h3 className="mt-3 text-xl font-semibold text-zinc-900">{sport.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700 md:text-base">{sport.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
