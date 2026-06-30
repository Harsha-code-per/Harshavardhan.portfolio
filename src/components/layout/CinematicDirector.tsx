"use client";

import { type ReactNode, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";
import {
  cinematicChapters,
  cinematicDuration,
  getShouldReduceMotion,
} from "@/lib/motion";

type CinematicDirectorProps = {
  children: ReactNode;
};

function applyChapterPalette(chapter: (typeof cinematicChapters)[number]) {
  const root = document.documentElement;
  root.style.setProperty("--accent-primary", chapter.palette.primary);
  root.style.setProperty("--accent-secondary", chapter.palette.secondary);
  root.style.setProperty("--accent-tertiary", chapter.palette.tertiary);
}

export function CinematicDirector({ children }: CinematicDirectorProps) {
  setupGsap();

  const mainRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useGSAP(
    () => {
      const main = mainRef.current;
      const progress = progressRef.current;
      if (!main) {
        return;
      }

      const prefersReducedMotion = getShouldReduceMotion();
      const triggers: ScrollTrigger[] = [];

      if (progress) {
        triggers.push(
          ScrollTrigger.create({
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(progress, {
                scaleY: self.progress,
                transformOrigin: "center top",
              });
            },
          })
        );
      }

      cinematicChapters.forEach((chapter, index) => {
        const section = document.getElementById(chapter.id);
        if (!section) {
          return;
        }

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            scrub: prefersReducedMotion ? false : true,
            invalidateOnRefresh: true,
            onEnter: () => {
              applyChapterPalette(chapter);
              setActiveChapterIndex(index);
            },
            onEnterBack: () => {
              applyChapterPalette(chapter);
              setActiveChapterIndex(index);
            },
            animation: prefersReducedMotion
              ? undefined
              : gsap.to(main, {
                  backgroundColor: chapter.tone,
                  duration: cinematicDuration.chapter,
                  ease: "none",
                }),
          })
        );
      });

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: mainRef, dependencies: [] }
  );

  return (
    <main
      id="main-wrapper"
      ref={mainRef}
      className="relative"
      style={{ background: "var(--bg-base)" }}
    >
      <aside
        aria-hidden="true"
        className="pointer-events-none fixed right-6 top-1/2 z-900 hidden -translate-y-1/2 items-center gap-4 lg:flex"
      >
        <div className="relative h-40 w-px overflow-hidden bg-white/10">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full w-full origin-top scale-y-0 bg-accent-primary shadow-[0_0_18px_var(--accent-primary-glow)]"
          />
        </div>
        <div className="[writing-mode:vertical-rl]">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-white/45">
            {String(activeChapterIndex + 1).padStart(2, "0")} /{" "}
            {String(cinematicChapters.length).padStart(2, "0")}
          </p>
          <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.38em] text-accent-primary-light">
            {cinematicChapters[activeChapterIndex].label}
          </p>
        </div>
      </aside>

      {children}
    </main>
  );
}
