"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  Code2,
  Cpu,
  BrainCircuit,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Layers,
  Layout,
  LayoutDashboard,
  LayoutTemplate,
  MonitorPlay,
  Move,
  Rocket,
  Search,
  Server,
  Settings,
  Sparkles,
  Terminal,
  Triangle,
  Video,
  Wind,
  Zap,
  Cloud,
  Box,
  Hexagon
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

const techIcons: Record<string, React.ElementType> = {
  "Next.js": Triangle,
  React: LayoutTemplate,
  TypeScript: Code2,
  "Tailwind CSS": Wind,
  "shadcn/ui": Layout,
  "App Router": LayoutDashboard,
  GSAP: Move,
  ScrollTrigger: Layers,
  "Framer Motion": Sparkles,
  Lenis: Rocket,
  "Three.js": Globe,
  WebGL: MonitorPlay,
  Python: Terminal,
  "Machine Learning": BrainCircuit,
  "Data Science": Database,
  LLMs: BrainCircuit,
  RAG: Layers,
  "Data Pipelines": GitBranch,
  AWS: Cloud,
  Azure: Cloud,
  "Google Cloud": Cloud,
  Docker: Box,
  Kubernetes: Hexagon,
  "CI/CD": Settings,
  Java: Code2,
  "Node.js": Server,
  "REST APIs": Server,
  WebRTC: Video,
  "Arch Linux": Terminal,
  Git: GitBranch,
  "Bash/Zsh": Terminal,
  Debugging: Search,
  "Performance Optimization": Zap,
  "SEO Fundamentals": Globe,
  Accessibility: MonitorPlay,
  "Analytics Thinking": LayoutDashboard,
};

// SimpleIcons CDN slugs and brand colors (or /white for dark mode visibility)
const techLogos: Record<string, string> = {
  "Next.js": "nextdotjs/white",
  React: "react/61DAFB",
  TypeScript: "typescript/3178C6",
  "Tailwind CSS": "tailwindcss/06B6D4",
  "shadcn/ui": "shadcnui/white",
  "App Router": "nextdotjs/white",
  GSAP: "greensock/88CE02",
  ScrollTrigger: "greensock/88CE02",
  "Framer Motion": "framer/0055FF",
  "Three.js": "threedotjs/white",
  WebGL: "webgl/990000",
  Python: "python/3776AB",
  "Machine Learning": "tensorflow/FF6F00",
  "Data Science": "pandas/white",
  RAG: "langchain/white",
  "Data Pipelines": "apache/D22128",
  "Google Cloud": "googlecloud/4285F4",
  Docker: "docker/2496ED",
  Kubernetes: "kubernetes/326CE5",
  "CI/CD": "githubactions/2088FF",
  "Node.js": "nodedotjs/339933",
  "REST APIs": "json/white",
  WebRTC: "webrtc/white",
  "Arch Linux": "archlinux/1793D1",
  Git: "git/F05032",
};

const systemAccents = ["#fcd34d", "#f97316", "#00f2fe", "#b2ff05", "#ff4560"] as const;

// Fetch real logos for technologies removed from SimpleIcons due to trademark
const techLogoOverrides: Record<string, string> = {
  "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
  "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "LLMs": "https://svgl.app/library/openai.svg",
};

export function SkillsBento() {
  setupGsap();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<(HTMLElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      if (!isDesktop) {
         gsap.from(rowsRef.current, {
           opacity: 0,
           y: 40,
           duration: 1,
           stagger: 0.15,
           ease: cinematicEase.out,
           scrollTrigger: { trigger: containerRef.current, start: "top 75%" }
         });
         return;
      }

      // --- Desktop GSAP Accordion Mechanics ---
      gsap.set(rowsRef.current, { flexGrow: 1, flexBasis: "0%", flexShrink: 1 });
      
      const contentAreas = gsap.utils.toArray<HTMLElement>(".skill-content", containerRef.current);
      gsap.set(contentAreas, { autoAlpha: 0, x: 40 });

      gsap.from(rowsRef.current, {
        opacity: 0,
        x: -50,
        duration: 1.4,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      });

      let activeRowIndex: number | null = null;

      rowsRef.current.forEach((row, rowIndex) => {
        if (!row) return;

        const handleMouseEnter = () => {
          if (activeRowIndex === rowIndex) return;
          activeRowIndex = rowIndex;

          // 1. Expand hovered row
          gsap.to(rowsRef.current, {
            flexGrow: (i) => (i === rowIndex ? 3 : 1),
            duration: 0.8,
            ease: "expo.out",
            overwrite: "auto",
          });

          // 2. Hide all contents
          gsap.to(contentAreas, {
            autoAlpha: 0,
            x: 40,
            duration: 0.3,
            overwrite: "auto",
          });

          // 3. Show hovered content
          const targetContent = row.querySelector(".skill-content");
          if (targetContent) {
            gsap.to(targetContent, {
              autoAlpha: 1,
              x: 0,
              duration: 0.7,
              delay: 0.15, 
              ease: "power3.out",
              overwrite: "auto",
            });
          }

          // 4. Fill text color
          const title = row.querySelector(".skill-title");
          if (title) {
            gsap.to(title, {
              color: "white",
              duration: 0.5,
              ease: "power2.out",
            });
          }
        };

        const handleMouseLeave = () => {
          const title = row.querySelector(".skill-title");
          if (title) {
            gsap.to(title, {
              color: "rgba(255,255,255,0)",
              duration: 0.5,
            });
          }
        };

        row.addEventListener("mouseenter", handleMouseEnter);
        row.addEventListener("mouseleave", handleMouseLeave);
      });

      const handleContainerLeave = () => {
        activeRowIndex = null;
        
        gsap.to(rowsRef.current, {
          flexGrow: 1,
          duration: 0.8,
          ease: "expo.out",
          overwrite: "auto"
        });
        
        gsap.to(contentAreas, {
          autoAlpha: 0,
          x: 40,
          duration: 0.4,
          overwrite: "auto"
        });
      };

      containerRef.current?.addEventListener("mouseleave", handleContainerLeave);

    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="skills"
      className="relative w-full bg-[#020202] py-32 lg:py-40"
    >
      <div 
        ref={containerRef} 
        className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-[clamp(1.5rem,5vw,4rem)] lg:h-[75vh] lg:min-h-[700px] lg:max-h-[900px] lg:gap-4 lg:px-8"
      >
        <div className="mb-6 lg:hidden">
           <p className="font-mono text-xs uppercase tracking-[0.34em] text-[var(--accent-primary-light)]">
             Architecture Core
           </p>
           <h2 className="mt-4 text-4xl font-black uppercase leading-none text-white">
             Execution Stack
           </h2>
        </div>

        {skillCategories.map((category, index) => {
          const accent = systemAccents[index % systemAccents.length];

          return (
            <article
              key={category.title}
              ref={(el) => {
                rowsRef.current[index] = el;
              }}
              className="group relative flex w-full flex-col justify-center overflow-hidden rounded-xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl lg:rounded-2xl lg:border-white/10 lg:bg-[#0a0a0a]/50 lg:px-12 lg:py-0"
            >
              <div
                className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-1000 group-hover:opacity-15 lg:block"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />

              <div 
                className="absolute right-4 top-4 font-mono text-5xl font-black leading-none text-white/5 lg:left-12 lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:text-[8vw] lg:text-white/[0.03]"
              >
                0{index + 1}
              </div>

              <div className="relative z-10 flex h-full flex-col lg:flex-row lg:items-center lg:justify-between lg:pl-[clamp(4rem,10vw,12rem)] lg:pr-[clamp(2rem,6vw,8rem)]">
                
                <h2
                  className="skill-title relative z-20 mt-8 max-w-sm text-3xl font-black uppercase leading-[0.9] tracking-tight lg:mt-0 lg:max-w-[45%] lg:text-[clamp(1.8rem,3vw,3.5rem)] lg:text-[rgba(255,255,255,0)]"
                  style={{
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {category.title}
                </h2>

                <div className="skill-content relative z-20 mt-6 flex flex-col items-start gap-6 lg:mt-0 lg:w-[45%] lg:max-w-2xl lg:opacity-0">
                  <p className="text-sm leading-relaxed text-white/60 lg:text-base lg:text-white/80 lg:drop-shadow-md">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {category.technologies.map((item) => {
                      const overrideUrl = techLogoOverrides[item];
                      const simpleSlug = techLogos[item];
                      const logoUrl = overrideUrl || (simpleSlug ? `https://cdn.simpleicons.org/${simpleSlug}` : null);
                      const Icon = (techIcons[item] || Code2) as any;
                      
                      return (
                        <span
                          key={`${category.title}-${item}`}
                          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white shadow-lg backdrop-blur-md transition-colors lg:bg-black/60 lg:hover:border-white/30"
                        >
                          {logoUrl ? (
                            <img 
                              src={logoUrl} 
                              alt={`${item} logo`} 
                              className={`h-4 w-4 ${item === "LLMs" ? "invert opacity-90" : ""}`}
                            />
                          ) : (
                            <Icon className="h-4 w-4" style={{ color: accent }} />
                          )}
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
