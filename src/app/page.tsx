"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";
import { Hero } from "@/components/ui/Hero";
import { HorizontalProjects } from "@/components/ui/HorizontalProjects";
import { MaskedAbout } from "@/components/ui/MaskedAbout";
import { SkillsBento } from "@/components/ui/SkillsBento";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Home() {
  useGSAP(() => {
    gsap.to("#main-wrapper", {
      backgroundColor: "#020617",
      scrollTrigger: {
        trigger: ".hero-container",
        start: "bottom top",
        end: "bottom top+=300",
        scrub: 1,
      },
    });
  }, []);

  return (
    <main id="main-wrapper" className="bg-white transition-colors duration-1000">
      <Hero />
      <div id="scroll-container" className="relative z-10 w-full">
        <MaskedAbout />
        <section id="work" className="h-screen w-full bg-zinc-800" />
        <HorizontalProjects />
        <SkillsBento />
        <section id="journey" className="h-screen w-full bg-neutral-900" />
        <section id="research" className="h-screen w-full bg-zinc-950" />
        <section id="sports" className="h-screen w-full bg-black" />
        <section id="contact" className="h-screen w-full bg-neutral-950" />
      </div>
    </main>
  );
}
