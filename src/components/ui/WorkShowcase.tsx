"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { workExperience } from "@/data/work";
import { gsap, setupGsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";

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
        gsap.set(card, { zIndex: cards.length - index });
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

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top+=96",
          end: `+=${cards.length * 120}%`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        timeline
          .to(
            card,
            {
              yPercent: -115,
              rotateZ: -4,
              opacity: 0.14,
              ease: "none",
            },
            index
          )
          .fromTo(
            nextCard,
            {
              scale: 0.96,
              opacity: 0.78,
            },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
            },
            index
          );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="work" ref={sectionRef} className="bg-[#f4ecde] px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-600/75">Work</p>
        <h2 className="mt-3 text-[clamp(1.9rem,4.8vw,3.8rem)] font-black uppercase leading-[0.95] tracking-tight text-zinc-900">
          Real-World Engineering Experience
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
          Scroll through each chapter to see progression from problem framing to
          production outcomes.
        </p>

        <div ref={stageRef} className="relative mt-10 h-[72vh] md:h-[78vh]">
          {workExperience.map((work) => (
            <article
              key={`${work.period}-${work.role}`}
              data-work-card
              className="absolute inset-0 rounded-3xl border border-[#e2d0b8] bg-white/95 p-7 shadow-[0_24px_60px_-40px_rgba(84,58,35,0.5)] backdrop-blur-lg md:p-8"
            >
              <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-600/70">
                    {work.period}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-zinc-900">{work.role}</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {work.organization} · {work.location}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-zinc-700 md:text-base">
                    {work.overview}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {work.outcomes.map((outcome) => (
                      <li key={outcome} className="text-sm text-zinc-700">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex h-full flex-col justify-between rounded-2xl border border-[#eadbc6] bg-[#f9f4eb] p-5">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-violet-600/70">
                      Core Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {work.technologies.map((technology) => (
                        <Badge key={technology}>{technology}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 rounded-xl border border-[#e9dbc8] bg-white px-4 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">
                      Outcome Focus
                    </p>
                    <p className="mt-1 text-sm text-zinc-700">
                      Recruiter-facing delivery clarity and measurable execution.
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
