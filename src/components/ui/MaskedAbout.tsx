"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { aboutContent } from "@/data/about";
import { gsap, setupGsap } from "@/lib/gsap";

export function MaskedAbout() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) {
        return;
      }

      const card = cardRef.current;
      const section = sectionRef.current;
      if (!card || !section) {
        return;
      }

      const content = section.querySelector<HTMLElement>("[data-about-content]");
      const highlights = gsap.utils.toArray<HTMLElement>("[data-about-highlight]");
      if (!content) {
        return;
      }

      /* Initial state: card is small and transparent */
      gsap.set(card, {
        scale: 0.82,
        opacity: 0,
        borderRadius: "32px",
        transformOrigin: "center center",
      });
      gsap.set(content, { opacity: 0, y: 40 });
      gsap.set(highlights, { opacity: 0, y: 24 });

      /* ── 3-phase scroll animation ─────────────────────────────── */
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          pinType: "transform",
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      /* Phase 1: Card scales in (0% → 35%) */
      timeline
        .to(card, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.12
        )
        .to(
          highlights,
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.2,
            ease: "power2.out",
          },
          0.2
        );

      /* Phase 2: Hold / reading zone (35% → 70%) — no animation, just breathing room */
      timeline.to(card, { duration: 0.35 });

      /* Phase 3: Card scales down and exits (70% → 100%) */
      timeline
        .to(card, {
          scale: 0.88,
          opacity: 0,
          y: -60,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          content,
          {
            opacity: 0,
            y: -30,
            duration: 0.2,
            ease: "power2.in",
          },
          "-=0.25"
        );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center overflow-visible bg-[var(--chapter-bg)]/95 px-[clamp(1rem,5vw,4rem)] py-20 backdrop-blur-sm"
    >
      <div
        ref={cardRef}
        data-about-mask
        className="about-ambient card-glass animated-border relative w-full max-w-6xl overflow-hidden text-[var(--text-primary)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,var(--accent-primary-subtle),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(234,179,8,0.08),transparent_45%)]" />
        <div
          data-about-content
          className="relative z-10 grid h-full w-full grid-cols-1 gap-10 p-7 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12 md:p-12 lg:p-16"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-primary-light)]">
              About
            </p>
            <h2 className="text-gradient-retro mt-3 text-balance text-[clamp(1.7rem,3.8vw,3.35rem)] font-semibold leading-[1.05]">
              {aboutContent.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
              {aboutContent.statement}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              {aboutContent.bio}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {aboutContent.highlights.map((item) => (
                <div
                  key={item.label}
                  data-about-highlight
                  className="card-glass rounded-xl p-4"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--accent-primary-light)] md:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[clamp(16rem,38vw,24rem)] shrink-0 overflow-hidden rounded-full border border-[var(--border-default)] aspect-square">
            <Image
              src={aboutContent.portrait.src}
              alt={aboutContent.portrait.alt}
              width={384}
              height={384}
              sizes="(max-width: 768px) 256px, (max-width: 1200px) 320px, 384px"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
