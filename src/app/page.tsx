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
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

const storyChapters = [
  { id: "hero", label: "Intro", tone: "#0a0a0c" },
  { id: "about", label: "About", tone: "#110e0c" },
  { id: "work", label: "Work", tone: "#0a0a0c" },
  { id: "projects", label: "Projects", tone: "#13100a" },
  { id: "skills", label: "Skills", tone: "#0a0a0c" },
  { id: "journey", label: "Journey", tone: "#110b0a" },
  { id: "research", label: "Research", tone: "#111115" },
  { id: "sports", label: "Sports", tone: "#0a0a0c" },
  { id: "contact", label: "Contact", tone: "#0c0a0a" },
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
      <div id="hero-master-container" className="h-screen w-full relative z-0">
        <Hero />
      </div>

      {/* Invisible spacer to hold scroll while Hero 3D model rotates */}
      <div className="h-[100vh] w-full pointer-events-none" />

      <div className="relative z-10 w-full">
        <About />
        <WorkShowcase />
        <HorizontalProjects />
        <SkillsBento />
        <TimelineExperience />
        <ResearchSection />
        <MarqueeBanner />
        <SportsSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
