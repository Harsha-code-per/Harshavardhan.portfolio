"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiArchlinux,
  SiCplusplus,
  SiCss,
  SiFramer,
  SiGit,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { skillCategories } from "@/data/skills";
import { gsap, setupGsap } from "@/lib/gsap";

const techIcons: Record<string, IconType> = {
  "Next.js": SiJavascript,
  React: SiReact,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiCss,
  "shadcn/ui": SiCss,
  "App Router": SiJavascript,
  GSAP: SiJavascript,
  ScrollTrigger: SiJavascript,
  "Framer Motion": SiFramer,
  Lenis: SiJavascript,
  SplitType: SiJavascript,
  Spline: SiJavascript,
  Python: SiPython,
  Java: SiJavascript,
  "C++": SiCplusplus,
  "Machine Learning": SiPython,
  "REST APIs": SiNodedotjs,
  WebRTC: SiJavascript,
  "Arch Linux": SiArchlinux,
  Git: SiGit,
  "Bash/Zsh": SiJavascript,
  "CI/CD": SiGit,
  Debugging: SiJavascript,
  "Performance Optimization": SiJavascript,
  "SEO Fundamentals": SiJavascript,
  Accessibility: SiJavascript,
  "Analytics Thinking": SiJavascript,
};

function SkillCard({
  title,
  description,
  technologies,
}: {
  title: string;
  description: string;
  technologies: string[];
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-70, 70], [9, -9]);
  const rotateY = useTransform(x, [-70, 70], [-10, 10]);

  const smoothRotateX = useSpring(rotateX, { damping: 18, stiffness: 160 });
  const smoothRotateY = useSpring(rotateY, { damping: 18, stiffness: 160 });

  return (
    <motion.article
      data-skill-card
      className="group relative overflow-hidden rounded-2xl border border-[#dccdb9] bg-white p-7 shadow-[0_16px_45px_-30px_rgba(68,48,31,0.45)] md:p-8"
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 900,
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - (rect.left + rect.width / 2));
        y.set(event.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-amber-100/70 to-transparent" />
      <h3 className="relative z-10 mb-2 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="relative z-10 mb-5 text-sm leading-relaxed text-zinc-600">{description}</p>
      <ul className="relative z-10 grid grid-cols-2 gap-2.5">
        {technologies.map((item) => {
          const Icon = techIcons[item] ?? SiJavascript;

          return (
            <li
              key={item}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-[#f9f5ef] px-2.5 py-2 text-xs font-medium text-zinc-700"
            >
              <Icon className="h-3.5 w-3.5 text-violet-600" />
              <span className="truncate">{item}</span>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
}

export function SkillsBento() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-skill-card]", {
        opacity: 0,
        y: 48,
        stagger: 0.14,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
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
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f6ecdc] px-6 py-24 md:px-8"
    >
      <h2 className="mb-6 text-center text-xs uppercase tracking-[0.34em] text-violet-600/75">
        Skills
      </h2>
      <p className="mb-14 max-w-3xl text-center text-[clamp(1.8rem,5vw,3.65rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-zinc-900">
        ENGINEERING ARSENAL
      </p>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((card) => (
          <SkillCard
            key={card.title}
            title={card.title}
            description={card.description}
            technologies={card.technologies.slice(0, 6)}
          />
        ))}
      </div>
    </section>
  );
}
