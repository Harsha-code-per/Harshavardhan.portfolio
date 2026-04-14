"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const skillCards = [
  {
    title: "Core Stack",
    items: ["Next.js", "React", "Node.js", "Django"],
  },
  {
    title: "AI & Data",
    items: ["Machine Learning", "Python", "Data Architecture"],
  },
  {
    title: "UI/UX Motion",
    items: ["GSAP", "Framer Motion", "Tailwind", "Aceternity UI"],
  },
  {
    title: "Systems",
    items: ["Arch Linux", "WebRTC Security", "JWT"],
  },
] as const;

export function SkillsBento() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from(".skills-card", {
        opacity: 0,
        y: 48,
        stagger: 0.14,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#skills",
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen w-full bg-zinc-950 py-24 px-8 flex flex-col items-center justify-center"
    >
      <h2 className="text-5xl font-black mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        ENGINEERING ARSENAL
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {skillCards.map((card) => (
          <article
            key={card.title}
            className="skills-card bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:border-cyan-500/50 hover:bg-white/[0.02] transition-all duration-300 group"
          >
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">{card.title}</h3>
            <ul className="space-y-2">
              {card.items.map((item) => (
                <li key={item} className="text-sm text-neutral-300">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

