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
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
  SiGreensock,
  SiThreedotjs,
} from "react-icons/si";
import {
  FaJava,
  FaCog,
  FaRocket,
  FaSearch,
  FaUniversalAccess,
  FaChartLine,
  FaBug,
  FaTerminal,
  FaCode,
  FaBolt,
  FaVideo,
} from "react-icons/fa";
import { skillCategories } from "@/data/skills";
import { gsap, setupGsap } from "@/lib/gsap";

/* Proper icon mapping — no fallback to generic JS icon */
const techIcons: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiCss,
  "shadcn/ui": SiReact,
  "App Router": SiNextdotjs,
  GSAP: SiGreensock,
  ScrollTrigger: SiGreensock,
  "Framer Motion": SiFramer,
  Lenis: FaRocket,
  SplitType: FaCode,
  Spline: SiThreedotjs,
  Python: SiPython,
  Java: FaJava,
  "C++": SiCplusplus,
  "Machine Learning": SiPython,
  "REST APIs": SiNodedotjs,
  WebRTC: FaVideo,
  "Arch Linux": SiArchlinux,
  Git: SiGit,
  "Bash/Zsh": FaTerminal,
  "CI/CD": FaCog,
  Debugging: FaBug,
  "Performance Optimization": FaBolt,
  "SEO Fundamentals": FaSearch,
  Accessibility: FaUniversalAccess,
  "Analytics Thinking": FaChartLine,
};

const cardAccents = [
  "var(--accent-primary)",
  "var(--accent-tertiary)",
  "var(--accent-secondary)",
  "var(--accent-primary-light)",
  "var(--accent-tertiary-light)",
];

function SkillCard({
  title,
  description,
  technologies,
  accent,
  isLarge,
}: {
  title: string;
  description: string;
  technologies: string[];
  accent: string;
  isLarge: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  const smoothRotateX = useSpring(rotateX, { damping: 25, stiffness: 200 });
  const smoothRotateY = useSpring(rotateY, { damping: 25, stiffness: 200 });

  return (
    <motion.article
      data-skill-card
      className={`card-glass group relative overflow-hidden p-6 lg:p-8 ${
        isLarge ? "md:col-span-2" : ""
      }`}
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
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 50px color-mix(in srgb, ${accent} 25%, transparent)`,
        borderColor: accent,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Accent glow on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: accent }}
      />

      <div className="flex items-center gap-3">
        <span
          className="inline-block h-1 w-5 rounded-full"
          style={{ background: accent }}
        />
        <p
          className="font-mono text-[0.68rem] uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {title}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {description}
      </p>

      {/* Icon row */}
      <div className="mt-5 flex flex-wrap gap-3">
        {technologies.slice(0, isLarge ? 6 : 4).map((item) => {
          const Icon = techIcons[item] ?? SiJavascript;
          return (
            <div
              key={`icon-${item}`}
              className="group/icon relative"
              title={item}
            >
              <Icon
                className="h-7 w-7 text-[var(--text-muted)] transition-colors duration-300 group-hover/icon:text-[var(--accent-primary-light)]"
              />
            </div>
          );
        })}
      </div>

      {/* Tech list */}
      <ul className={`mt-5 grid gap-2 ${isLarge ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
        {technologies.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)]"
          >
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function SkillsBento() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-skill-card]");
      if (cards.length === 0) {
        return;
      }

      gsap.from(cards, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-[clamp(1rem,5vw,4rem)] py-20"
      style={{ background: "var(--chapter-bg)" }}
    >
      <h2 className="text-gradient-retro mb-4 text-center text-[clamp(3rem,7vw,6rem)] font-black leading-[0.95] tracking-[-0.02em]">
        Skills
      </h2>
      <p className="mb-14 max-w-3xl text-center text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)] md:text-base">
        Engineering Arsenal
      </p>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((card, index) => (
          <SkillCard
            key={card.title}
            title={card.title}
            description={card.description}
            technologies={card.technologies}
            accent={cardAccents[index % cardAccents.length]}
            isLarge={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
