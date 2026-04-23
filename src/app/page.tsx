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
import { chapterThemes } from "@/lib/visualScript";

export default function Home() {
  setupGsap();

  const mainRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!mainRef.current) {
        return;
      }

      const applyTheme = (chapterId: string) => {
        const chapter = chapterThemes.find((item) => item.id === chapterId);
        if (!chapter || !mainRef.current) {
          return;
        }

        mainRef.current.dataset.chapter = chapter.id;
        gsap.to(mainRef.current, {
          "--chapter-bg": chapter.bg,
          "--chapter-surface": chapter.surface,
          "--chapter-accent": chapter.accent,
          "--chapter-accent-alt": chapter.accentAlt,
          "--chapter-ink": chapter.ink,
          duration: 0.85,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      applyTheme("hero");

      const triggers: ScrollTrigger[] = [];

      chapterThemes.forEach((chapter) => {
        const section = document.getElementById(chapter.id);
        if (!section) {
          return;
        }

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            invalidateOnRefresh: true,
            onEnter: () => applyTheme(chapter.id),
            onEnterBack: () => applyTheme(chapter.id),
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
      className="relative w-full"
      data-chapter="hero"
      data-skew
    >
      <div id="hero-master-container" className="h-screen w-full relative z-0">
        <Hero />
      </div>
      <div className="relative z-10">
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
