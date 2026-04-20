"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/ui/About";
import { ContactSection } from "@/components/ui/ContactSection";
import { Hero } from "@/components/ui/Hero";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { ResearchSection } from "@/components/ui/ResearchSection";
import { SkillsBento } from "@/components/ui/SkillsBento";
import { SportsSection } from "@/components/ui/SportsSection";
import { TimelineExperience } from "@/components/ui/TimelineExperience";
import { WorkShowcase } from "@/components/ui/WorkShowcase";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

const storyChapters = [
  { id: "hero", label: "Intro", tone: "#0a0a0f" },
  { id: "about", label: "About", tone: "#0d0d15" },
  { id: "work", label: "Work", tone: "#0a0a0f" },
  { id: "projects", label: "Projects", tone: "#0c0a10" },
  { id: "skills", label: "Skills", tone: "#0a0a0f" },
  { id: "journey", label: "Journey", tone: "#0a0f0f" },
  { id: "research", label: "Research", tone: "#111118" },
  { id: "sports", label: "Sports", tone: "#0a0a0f" },
  { id: "contact", label: "Contact", tone: "#0a0a0f" },
] as const;

export default function Home() {
  setupGsap();

  const mainRef = useRef<HTMLElement | null>(null);

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
            start: "top 70%",
            end: "top 20%",
            scrub: true,
            invalidateOnRefresh: true,
            animation: gsap.to(mainRef.current, {
              backgroundColor: chapter.tone,
              duration: 1,
              ease: "none",
            }),
          })
        );
      });

      /* Single debounced refresh after everything is set up */
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        clearTimeout(refreshTimer);
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
      <div id="hero-master-container" className="h-screen w-full relative z-0">
        <Hero />
      </div>
      <div className="relative z-10 mt-[120vh]">
        <About />
      </div>
      <WorkShowcase />
      <HorizontalProjects />
      <SkillsBento />
      <TimelineExperience />
      <ResearchSection />
      <SportsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
