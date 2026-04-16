"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { projects } from "@/data/projects";
import { gsap, setupGsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";

export function HorizontalProjects() {
  setupGsap();

  const wrapperRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const getScrollAmount = () => {
        const delta = track.scrollWidth - window.innerWidth;
        return delta > 0 ? -delta : 0;
      };

      if (getScrollAmount() === 0) {
        return;
      }

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <section
      id="projects"
      ref={wrapperRef}
      className="projects-wrapper h-screen w-full overflow-hidden bg-[#f5eddf]"
    >
      <div
        ref={trackRef}
        className="projects-track flex h-full w-max flex-row flex-nowrap"
      >
        {projects.map((project) => (
          <article
            key={project.slug}
            className="h-full w-screen shrink-0 border-r border-[#e4d5c0] bg-[#f5eddf] p-8 md:p-12"
          >
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center rounded-3xl border border-[#e2d4c1] bg-white/90 p-8 shadow-[0_24px_60px_-42px_rgba(90,61,38,0.45)] backdrop-blur-lg md:p-12">
              <p className="text-xs uppercase tracking-[0.28em] text-violet-600/70">Featured Project</p>
              <h2 className="mt-4 text-[clamp(2rem,7vw,5.3rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-zinc-900">
                {project.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base text-zinc-800 md:text-xl">
                {project.oneLiner}
              </p>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-600 md:text-base">
                {project.summary}
              </p>
              <p className="mt-5 max-w-3xl rounded-xl border border-[#eadac4] bg-[#faf6f0] p-4 text-sm text-zinc-700 md:text-base">
                <span className="font-semibold text-violet-600">Impact: </span>
                {project.impact}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {project.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              <div
                className={`pointer-events-none mt-8 h-20 w-full rounded-2xl bg-gradient-to-r ${project.accent} blur-xl`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
