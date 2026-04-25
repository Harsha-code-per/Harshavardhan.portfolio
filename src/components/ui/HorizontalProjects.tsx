"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";
import { Badge } from "@/components/ui/badge";

const artisticPalettes = [
  { primary: "#b2ff05", secondary: "#00b09b" }, // Acid Lime
  { primary: "#00f2fe", secondary: "#4facfe" }, // Toxic Cyan
  { primary: "#fde047", secondary: "#f59e0b" }, // Radioactive Yellow
  { primary: "#f97316", secondary: "#ea580c" }, // Biohazard Orange
];

/* ── Mobile vertical card layout ──────────────────────────────────────── */
function MobileProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const palette = artisticPalettes[index % artisticPalettes.length];
  return (
    <article
      className="relative overflow-hidden rounded-[2rem] flex flex-col"
      style={{
        background: `radial-gradient(ellipse at 20% 80%, color-mix(in srgb, ${palette.primary} 20%, #050505) 0%, color-mix(in srgb, ${palette.secondary} 25%, #0a0a0c) 100%)`,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left accent bar */}
      <span
        className="absolute left-0 top-0 h-full w-[4px]"
        style={{ background: palette.primary, boxShadow: `0 0 20px ${palette.primary}` }}
      />

      <div className="p-6 pl-8 flex flex-col gap-6">
        <div className="flex flex-col">
          <p
            className="font-mono text-xs uppercase tracking-[0.4em] font-semibold mb-3"
            style={{ color: palette.primary }}
          >
            Featured Project
          </p>
          <h2
            className="text-[clamp(2rem,8vw,3.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white"
            style={{ textShadow: `0 10px 30px color-mix(in srgb, ${palette.primary} 40%, transparent)` }}
          >
            {project.title}
          </h2>
          <p className="mt-3 text-base font-light text-white/80">{project.oneLiner}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-white/90 leading-relaxed">{project.summary}</p>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: palette.primary, boxShadow: `0 0 10px ${palette.primary}` }}
              />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90">
                {project.impact}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge
                  key={tech}
                  className="border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/90"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Desktop horizontal scroll layout ─────────────────────────────────── */
function DesktopHorizontalProjects() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const wrapper = wrapperRef.current;
      const progress = progressRef.current;
      if (!track || !wrapper || !progress) {
        return;
      }

      /* Wait for layout to settle before calculating widths */
      const initTimeout = setTimeout(() => {
        const getScrollAmount = () =>
          -(track.scrollWidth - window.innerWidth);

        gsap.set(track, { x: 0 });

        const durationScroll = projects.length - 1;
        const durationSettle = 0.3;
        const totalDuration = durationScroll + durationSettle;

        let lastIdx = -1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () =>
              `+=${Math.abs(getScrollAmount()) + window.innerWidth}`,
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const trackProgress = Math.min((self.progress * totalDuration) / durationScroll, 1);
              gsap.set(progress, {
                scaleX: trackProgress,
                transformOrigin: "left center",
              });
              const idx = Math.min(
                Math.floor(trackProgress * projects.length),
                projects.length - 1
              );
              if (idx !== lastIdx) {
                lastIdx = idx;
                const currentPalette = artisticPalettes[idx % artisticPalettes.length];
                progress.style.backgroundColor = currentPalette.primary;
                progress.style.boxShadow = `0 0 15px ${currentPalette.primary}`;
              }
            },
          },
        });

        const scrollTween = tl.to(track, {
          x: getScrollAmount,
          ease: "none",
          duration: durationScroll,
        });

        tl.to({}, { duration: durationSettle });

        /* Per-card reveal animation */
        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
        cards.forEach((card) => {
          const inner = card.querySelectorAll("[data-project-reveal]");
          gsap.fromTo(
            inner,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "left 80%",
                containerAnimation: scrollTween,
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }, 100);

      return () => {
        clearTimeout(initTimeout);
      };
    },
    { scope: wrapperRef, dependencies: [] }
  );

  return (
    <div
      ref={wrapperRef}
      className="projects-wrapper relative h-screen overflow-hidden"
    >
      {/* ── Horizontal track ───────────────────────────────────── */}
      <div
        ref={trackRef}
        className="projects-track flex h-full flex-nowrap"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, index) => {
          const palette = artisticPalettes[index % artisticPalettes.length];
          return (
            <article
              key={project.slug}
              data-project-card
              className="relative flex h-full w-screen shrink-0 flex-col justify-center overflow-hidden px-[clamp(1rem,5vw,4rem)]"
              style={{
                willChange: "transform, opacity",
                background: `radial-gradient(ellipse at 20% 80%, color-mix(in srgb, ${palette.primary} 20%, #050505) 0%, color-mix(in srgb, ${palette.secondary} 25%, #0a0a0c) 100%)`,
              }}
            >
              {/* Left accent bar */}
              <span
                className="absolute left-0 top-0 h-full w-[4px]"
                style={{ background: palette.primary, boxShadow: `0 0 20px ${palette.primary}` }}
              />

              {/* Content */}
              <div className="relative z-10 w-full max-w-5xl mx-auto pt-16 flex flex-col items-center justify-center gap-12">
                
                {/* Top: Centered Title */}
                <div className="flex flex-col items-center text-center w-full relative z-20">
                  <p
                    data-project-reveal
                    className="font-mono text-xs uppercase tracking-[0.4em] font-semibold mb-6"
                    style={{ color: palette.primary }}
                  >
                    Featured Project
                  </p>
                  <h2
                    data-project-reveal
                    className="text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[0.85] tracking-tight text-white"
                    style={{ textShadow: `0 20px 50px color-mix(in srgb, ${palette.primary} 40%, transparent)` }}
                  >
                    {project.title}
                  </h2>
                  <p
                    data-project-reveal
                    className="mt-6 text-xl md:text-2xl font-light tracking-wide text-white/90 max-w-2xl"
                  >
                    {project.oneLiner}
                  </p>
                </div>

                {/* Bottom: Contents Below */}
                <div className="w-full relative z-30">
                  <div data-project-reveal className="p-8 md:p-10 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl text-center flex flex-col items-center">
                    <p className="text-[clamp(1rem,1.2vw,1.15rem)] font-medium text-white/90 leading-relaxed max-w-3xl">
                      {project.summary}
                    </p>

                    <div className="mt-8 pt-8 border-t border-white/10 w-full flex flex-col items-center">
                      <div className="inline-flex items-center gap-3 mb-6">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: palette.primary, boxShadow: `0 0 10px ${palette.primary}` }}
                        />
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/90">
                          {project.impact}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-2.5 mb-10">
                        {project.stack.map((tech) => (
                          <Badge
                            key={tech}
                            className="border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <motion.button
                        type="button"
                        data-cursor="hover"
                        className="w-full max-w-sm mx-auto rounded-[2rem] border p-5 text-sm uppercase tracking-[0.2em] font-bold text-white transition-colors shadow-lg flex justify-center items-center gap-3"
                        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                        whileHover={{
                          borderColor: palette.primary,
                          backgroundColor: `color-mix(in srgb, ${palette.primary} 20%, transparent)`,
                          scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Project <span style={{ color: palette.primary }}>→</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Progress bar ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-[var(--border-default)]" />
      <div
        ref={progressRef}
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-colors duration-500 ease-out"
        style={{ backgroundColor: artisticPalettes[0].primary, boxShadow: `0 0 15px ${artisticPalettes[0].primary}` }}
      />
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export function HorizontalProjects() {
  setupGsap();

  // Detect mobile — horizontal scroll is unusable on touch; use vertical stack
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {isMobile ? (
        /* Mobile: vertical scrollable card stack */
        <div className="px-4 py-16 flex flex-col gap-6">
          <div className="mb-4">
            <p className="font-mono text-xs uppercase tracking-[0.4em] font-semibold text-[var(--accent-primary)]">
              Projects
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-tight text-white">
              Featured Work
            </h2>
          </div>
          {projects.map((project, index) => (
            <MobileProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        /* Desktop: pinned horizontal scroll */
        <DesktopHorizontalProjects />
      )}
    </section>
  );
}
