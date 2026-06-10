"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { BriefcaseBusiness, GraduationCap, ArrowUpRight } from "lucide-react";
import { publications } from "@/data/publications";
import { workExperience } from "@/data/work";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

type JourneyMilestone = {
  id: string;
  year: string;
  title: string;
  type: "work" | "research";
  highlights: string[];
  url?: string;
  sortWeight: number;
};

// Fix chronological data by mapping and explicitly sorting
const journeyMilestones: JourneyMilestone[] = [
  ...workExperience.map((work) => ({
    id: work.role + work.organization,
    year: work.period,
    title: `${work.role} · ${work.organization}`,
    type: "work" as const,
    highlights: [work.overview, ...work.outcomes],
    sortWeight: work.organization.includes("Zensphere") ? 3 : 1, // Zensphere (Dec 2025) > Respro (June 2025)
  })),
  ...publications.map((publication) => ({
    id: publication.title,
    year: publication.year,
    title: publication.title,
    type: "research" as const,
    highlights: [publication.publisher, publication.summary],
    url: publication.url,
    sortWeight: 2, // IEEE (Oct 2025) is between the two internships
  })),
].sort((a, b) => b.sortWeight - a.sortWeight);

const routeAccents = ["#00f2fe", "#b2ff05", "#ff4560", "#f97316"] as const;

export function TimelineExperience() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray<HTMLElement>(".journey-card", section);
      const hudDates = gsap.utils.toArray<HTMLElement>(".hud-date", section);
      const hudGlows = gsap.utils.toArray<HTMLElement>(".hud-glow", section);

      // Initialize HUD states purely via GSAP
      gsap.set(hudDates, { opacity: 0, y: 60, filter: "blur(10px)" });
      gsap.set(hudGlows, { opacity: 0, scale: 0.5 });
      
      if (hudDates.length > 0) {
        gsap.set(hudDates[0], { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(hudGlows[0], { opacity: 0.15, scale: 1 });
      }

      function activateHUD(activeIndex: number) {
        hudDates.forEach((hud, i) => {
          if (i === activeIndex) {
            gsap.to(hud, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out", overwrite: "auto" });
            gsap.to(hudGlows[i], { opacity: 0.15, scale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          } else if (i < activeIndex) {
            // Scroll Up: move out to top
            gsap.to(hud, { opacity: 0, y: -60, scale: 0.95, filter: "blur(10px)", duration: 0.4, overwrite: "auto" });
            gsap.to(hudGlows[i], { opacity: 0, scale: 0.5, duration: 0.4, overwrite: "auto" });
          } else {
            // Scroll Down: move out to bottom
            gsap.to(hud, { opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)", duration: 0.4, overwrite: "auto" });
            gsap.to(hudGlows[i], { opacity: 0, scale: 0.5, duration: 0.4, overwrite: "auto" });
          }
        });
      }

      cards.forEach((card, index) => {
        // Fade up card as it enters view naturally
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Starts animating when top of card hits 85% down viewport
            },
          }
        );

        // Detect when card is in focus to trigger HUD sync
        ScrollTrigger.create({
          trigger: card,
          start: "top 50%", // When top of card hits middle of screen
          end: "bottom 50%", // When bottom of card hits middle of screen
          onEnter: () => activateHUD(index),
          onEnterBack: () => activateHUD(index),
        });
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full bg-[#030303] text-white"
    >
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col md:flex-row">
        
        {/* --- LEFT SIDE: Sticky HUD --- */}
        <div className="relative w-full md:w-1/2 lg:w-5/12">
          {/* Sticks to the viewport as you scroll the right side */}
          <div className="sticky top-0 flex h-[50vh] w-full flex-col justify-center px-6 pt-24 md:h-screen md:px-12 xl:px-24">
            
            <div className="mb-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-[var(--accent-primary-light)]">
                Route Log
              </p>
              <h2 className="mt-4 max-w-[12ch] text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase leading-[0.85] text-white">
                Path of Execution
              </h2>
            </div>

            {/* Dynamic Date Display */}
            <div className="relative h-24 w-full md:h-32 xl:h-40">
              {journeyMilestones.map((milestone, i) => {
                const accent = routeAccents[i % routeAccents.length];

                return (
                  <div key={`hud-${milestone.id}`} className="absolute inset-0 flex flex-col justify-center">
                    {/* Glowing background syncs with the date */}
                    <div 
                      className="hud-glow pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full blur-[80px]"
                      style={{ background: accent }}
                    />
                    
                    <div className="hud-date relative z-10 flex items-center gap-4">
                      <div className="h-[2px] w-8 bg-white/20" />
                      <span className="font-mono text-xl font-black uppercase tracking-widest text-white md:text-2xl lg:text-3xl xl:text-4xl" style={{ textShadow: `0 0 20px ${accent}40` }}>
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* --- RIGHT SIDE: Native Scrolling Feed --- */}
        <div className="w-full pb-[30vh] pt-12 md:w-1/2 md:pb-[50vh] md:pt-[50vh] lg:w-7/12">
          {/* Enormous gap creates massive pacing between elements */}
          <div className="flex flex-col gap-[30vh] md:gap-[50vh]">
            {journeyMilestones.map((milestone, i) => {
              const accent = routeAccents[i % routeAccents.length];
              const Icon = milestone.type === "work" ? BriefcaseBusiness : GraduationCap;
              const yearWatermark = milestone.year.match(/\d{4}/)?.[0] || "202X";

              return (
                <article
                  key={`card-${milestone.id}`}
                  className="journey-card relative w-full px-6 pr-6 md:pr-12 xl:pr-24"
                >
                  <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] md:p-12 xl:p-16">
                    
                    {/* Ambient Glow */}
                    <div
                      className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full opacity-10 blur-[100px] transition-opacity duration-700 group-hover:opacity-20"
                      style={{ background: accent }}
                    />

                    {/* Massive Watermark Year */}
                    <div className="pointer-events-none absolute -bottom-10 -right-4 font-mono text-[14vw] font-black leading-none text-white/[0.02] md:text-[8vw]">
                      {yearWatermark}
                    </div>

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] border border-white/10 shadow-inner">
                          <Icon className="h-5 w-5" style={{ color: accent }} />
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                          {milestone.type === "work" ? "Professional" : "Academic"}
                        </span>
                      </div>

                      <h3 className="mt-10 text-3xl font-black uppercase leading-[1.1] text-white md:text-4xl lg:text-5xl">
                        {milestone.title}
                      </h3>

                      <div className="mt-8 flex flex-col gap-5">
                        {milestone.highlights.map((highlight, idx) => (
                          <p key={idx} className="text-base leading-relaxed text-white/70 md:text-lg">
                            {highlight}
                          </p>
                        ))}
                      </div>

                      <div className="mt-auto pt-10">
                        {milestone.url ? (
                          <a
                            href={milestone.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:text-white"
                            style={{ color: accent }}
                          >
                            Read Publication <ArrowUpRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-white/30">
                            Production Code
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
