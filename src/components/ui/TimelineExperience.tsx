"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { publications } from "@/data/publications";
import { workExperience } from "@/data/work";
import { gsap, setupGsap } from "@/lib/gsap";

type JourneyMilestone = {
  year: string;
  title: string;
  highlights: string[];
};

const journeyMilestones: JourneyMilestone[] = [
  ...workExperience.map((work) => ({
    year: work.period,
    title: `${work.role} · ${work.organization}`,
    highlights: [work.overview, ...work.outcomes],
  })),
  ...publications.map((publication) => ({
    year: publication.year,
    title: publication.title,
    highlights: [publication.publisher, publication.summary],
  })),
];

export function TimelineExperience() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-journey-item]");

      gsap.from(items, {
        opacity: 0,
        y: 44,
        stagger: 0.12,
        duration: 0.74,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 25%",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section id="journey" ref={sectionRef} className="relative bg-[#f4ecde] px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600/75">
            Journey Timeline
          </p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3.3rem)] font-black uppercase tracking-tight text-zinc-900">
            Milestones in AI & Engineering
          </h2>
        </div>

        <div className="relative space-y-6">
          <span className="absolute left-[108px] top-7 hidden h-[calc(100%-3.5rem)] w-px bg-violet-200/50 md:block" />
          <span
            ref={progressRef}
            className="absolute left-[108px] top-7 hidden h-[calc(100%-3.5rem)] w-px bg-violet-600/60 md:block"
          />
          {journeyMilestones.map((milestone, index) => {
            const isLast = index === journeyMilestones.length - 1;

            return (
              <article
                data-journey-item
                key={`${milestone.year}-${milestone.title}`}
                className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr] md:gap-8"
              >
                <div className="md:pt-7">
                  <p className="text-xl font-extrabold tracking-tight text-zinc-900 md:text-2xl">
                    {milestone.year}
                  </p>
                </div>

                <div className="relative rounded-2xl border border-[#e3d2bc] bg-white/85 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/45 md:p-7">
                  <span className="absolute -left-[117px] top-8 hidden h-3.5 w-3.5 rounded-full border border-violet-300/45 bg-[#f4ecde] md:block" />
                  {!isLast ? (
                    <span className="absolute -left-px top-11 hidden h-[calc(100%+1.5rem)] w-px bg-violet-300/30 md:hidden" />
                  ) : null}

                  <h3 className="text-xl font-bold text-zinc-900">{milestone.title}</h3>

                  <div className="mt-4 space-y-2">
                    {milestone.highlights.map((highlight) => (
                      <p key={highlight} className="text-sm leading-relaxed text-zinc-700">
                        {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
