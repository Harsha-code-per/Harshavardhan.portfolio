"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/ui/ContactSection";
import { Hero } from "@/components/ui/Hero";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { MaskedAbout } from "@/components/ui/MaskedAbout";
import { ResearchSection } from "@/components/ui/ResearchSection";
import { SkillsBento } from "@/components/ui/SkillsBento";
import { SportsSection } from "@/components/ui/SportsSection";
import { TimelineExperience } from "@/components/ui/TimelineExperience";
import { WorkShowcase } from "@/components/ui/WorkShowcase";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

const storyChapters = [
  { id: "hero", label: "Intro", tone: "#f4ecde" },
  { id: "about", label: "About", tone: "#f2e9db" },
  { id: "work", label: "Work", tone: "#f4ecde" },
  { id: "projects", label: "Projects", tone: "#f5eddf" },
  { id: "skills", label: "Skills", tone: "#f6ecdc" },
  { id: "journey", label: "Journey", tone: "#f4ecde" },
  { id: "research", label: "Research", tone: "#f5eddf" },
  { id: "sports", label: "Sports", tone: "#f4ecde" },
  { id: "contact", label: "Contact", tone: "#f5eddf" },
] as const;

export default function Home() {
  setupGsap();

  const mainRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [activeChapter, setActiveChapter] = useState("hero");

  useGSAP(
    () => {
      if (!mainRef.current) {
        return;
      }

      const triggers: ScrollTrigger[] = [];

      storyChapters.forEach((chapter) => {
        const section = document.getElementById(chapter.id);
        if (!section) {
          return;
        }

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveChapter(chapter.id),
            onEnterBack: () => setActiveChapter(chapter.id),
          })
        );

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            scrub: true,
            animation: gsap.to(mainRef.current, {
              backgroundColor: chapter.tone,
              duration: 1,
              ease: "none",
            }),
          })
        );
      });

      const storyPanels = document.querySelectorAll<HTMLElement>("[data-story-panel]");
      storyPanels.forEach((panel) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: panel,
            start: "top 80%",
            end: "bottom 20%",
            animation: gsap.fromTo(
              panel,
              { opacity: 0.65, y: 32 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            ),
          })
        );
      });

      triggers.push(
        ScrollTrigger.create({
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            if (!progressRef.current) {
              return;
            }

            gsap.set(progressRef.current, {
              scaleY: self.progress,
              transformOrigin: "top center",
            });
          },
        })
      );

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: mainRef }
  );

  return (
    <main
      id="main-wrapper"
      ref={mainRef}
      className="relative bg-[#f4ecde] transition-colors duration-700"
    >
      <aside className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-3 lg:flex">
        <div className="relative h-48 w-px bg-zinc-300/70">
          <span
            ref={progressRef}
            className="absolute left-0 top-0 h-full w-full bg-violet-600"
          />
        </div>
        <div className="space-y-2">
          {storyChapters.map((chapter) => (
            <p
              key={chapter.id}
              className={
                activeChapter === chapter.id
                  ? "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-zinc-900"
                  : "text-[0.62rem] uppercase tracking-[0.22em] text-zinc-500"
              }
            >
              {chapter.label}
            </p>
          ))}
        </div>
      </aside>

      <div data-story-panel>
        <Hero />
      </div>
      <div data-story-panel>
        <MaskedAbout />
      </div>
      <div data-story-panel>
        <WorkShowcase />
      </div>
      <div data-story-panel>
        <HorizontalProjects />
      </div>
      <div data-story-panel>
        <SkillsBento />
      </div>
      <div data-story-panel>
        <TimelineExperience />
      </div>
      <div data-story-panel>
        <ResearchSection />
      </div>
      <div data-story-panel>
        <SportsSection />
      </div>
      <div data-story-panel>
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
