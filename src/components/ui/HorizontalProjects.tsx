"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { useGSAP } from "@gsap/react";

import {
  Activity,
  Satellite,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.35 6.5-1.5 6.5-7.14a5.8 5.8 0 0 0-1.5-3.89 5.5 5.5 0 0 0-.15-3.82s-1.13-.36-3.85 1.4a13.3 13.3 0 0 0-7 0c-2.72-1.76-3.85-1.4-3.85-1.4a5.5 5.5 0 0 0-.15 3.82 5.8 5.8 0 0 0-1.5 3.89c0 5.6 3.32 6.79 6.5 7.14a4.8 4.8 0 0 0-1 3.03v4" />
    </svg>
  );
}
import { Badge } from "@/components/ui/badge";
import { Project, projects } from "@/data/projects";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

const dossierPalettes = [
  {
    primary: "#fcd34d", // Orbital Gold
    secondary: "#b2ff05", // Bioluminescent Green
    tertiary: "#10b981", 
    glow: "rgba(252, 211, 77, 0.18)",
    field: "rgba(178, 255, 5, 0.08)",
  },
  {
    primary: "#00f2fe", // Deep Azure
    secondary: "#4facfe", 
    tertiary: "#9bf6ff",
    glow: "rgba(0, 242, 254, 0.18)",
    field: "rgba(79, 172, 254, 0.08)",
  },
  {
    primary: "#8e2de2", // Sleep Indigo
    secondary: "#4a00e0", 
    tertiary: "#e0c3fc",
    glow: "rgba(142, 45, 226, 0.22)",
    field: "rgba(74, 0, 224, 0.1)",
  },
] as const;

const projectDossiers = [
  {
    codename: "Orbital Intelligence Platform",
    signal: "Live Telemetry & ML Engine",
    metric: "99.9",
    metricLabel: "Uptime on API",
    visual: "orbit",
    Icon: Satellite,
  },
  {
    codename: "Encrypted WebRTC Channel",
    signal: "Offline-first resilience queue",
    metric: "E2E",
    metricLabel: "Encryption Ready",
    visual: "secure",
    Icon: ShieldCheck,
  },
  {
    codename: "WebGL Anxiety Narrative",
    signal: "Scroll-bound shader curves",
    metric: "60",
    metricLabel: "FPS Render Target",
    visual: "ambient",
    Icon: Activity,
  },
] as const;

type Palette = (typeof dossierPalettes)[number];
type Dossier = (typeof projectDossiers)[number];

// --- INTERACTIVE COMPONENTS ---

function MagneticButton({ children, href, primaryColor }: { children: React.ReactNode, href: string, primaryColor: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.4,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="magnetic-btn relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 bg-black/40 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition-all hover:bg-white/5"
      style={{ boxShadow: `0 0 20px color-mix(in srgb, ${primaryColor} 20%, transparent)` }}
    >
      {children}
    </a>
  );
}

// Awwwards SOTD level interactive cinematic image card
function InteractiveImageCard({ project, palette, className }: { project: Project, palette: Palette, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current || !cursorRef.current || !imageRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Move custom cursor
    gsap.to(cursorRef.current, {
      x, y,
      duration: 0.2,
      ease: "power2.out"
    });

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    
    gsap.to(imageRef.current, {
      rotateX,
      rotateY,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1200,
    });
  };

  const handleMouseEnter = () => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !cursorRef.current || !imageRef.current) return;
    gsap.to(imageRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
    });
    gsap.to(cursorRef.current, { opacity: 0, scale: 0.5, duration: 0.3 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] cursor-none ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Custom Hover Cursor */}
      <div 
        ref={cursorRef} 
        className="pointer-events-none absolute left-0 top-0 z-50 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xs font-bold tracking-[0.25em] text-white backdrop-blur-md opacity-0 scale-50 transition-colors border border-white/20"
        style={{ boxShadow: `0 0 40px ${palette.glow}` }}
      >
        EXPLORE
      </div>
      
      {/* Vignette & Cinematic Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
      
      <img 
        ref={imageRef}
        src={`/images/projects/${project.slug}.png`} 
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-1000 origin-center"
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

// --- DOSSIER STRUCTURE ---

function ProjectDossier({
  project,
  index,
  mode,
}: {
  project: Project;
  index: number;
  mode: "desktop" | "mobile";
}) {
  const palette = dossierPalettes[index % dossierPalettes.length];
  const dossier = projectDossiers[index % projectDossiers.length];
  const Icon = dossier.Icon;

  return (
    <article
      data-project-card
      className={`relative isolate shrink-0 overflow-hidden ${
        mode === "desktop"
          ? "flex h-full w-screen items-center px-[clamp(1.2rem,5vw,4.5rem)] py-20"
          : "min-h-[calc(100svh-2rem)] rounded-md border border-white/10 px-5 py-8"
      }`}
      style={{
        willChange: mode === "desktop" ? "transform, opacity" : undefined,
        background: `radial-gradient(circle at 72% 40%, ${palette.field}, transparent 36%), radial-gradient(circle at 18% 78%, color-mix(in srgb, ${palette.glow} 40%, transparent), transparent 34%), #050505`,
      }}
    >
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.18]" />
      <div
        className="pointer-events-none absolute -right-[18vw] top-1/2 aspect-square w-[48vw] -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: palette.primary }}
      />
      <span
        className="absolute left-0 top-0 h-full w-px"
        style={{ background: palette.primary, boxShadow: `0 0 28px ${palette.primary}` }}
      />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1400px] justify-between gap-12 ${
          mode === "desktop"
            ? "flex-row items-center"
            : "flex-col"
        }`}
      >
        {/* Constrain width to 45% of viewport to absolutely prevent overlapping the image */}
        <div className={mode === "desktop" ? "flex flex-col max-w-[42vw] xl:max-w-[45vw]" : ""}>
          <div data-project-reveal className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.045]"
              style={{ color: palette.primary }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-white/45">
              Mission {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px min-w-10 flex-1 bg-[linear-gradient(90deg,var(--accent-primary),transparent)]" style={{'--accent-primary': palette.primary} as React.CSSProperties} />
          </div>

          <p
            data-project-reveal
            className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.32em]"
            style={{ color: palette.primary }}
          >
            {dossier.codename}
          </p>
          {/* Prevent text wrapping out of bounds with break-words */}
          <h2
            data-project-reveal
            className="mt-4 break-words text-[clamp(2.5rem,5.2vw,5.5rem)] font-black uppercase leading-[0.85] text-white"
            style={{ textShadow: `0 24px 70px color-mix(in srgb, ${palette.primary} 30%, transparent)` }}
          >
            {project.title}
          </h2>
          <p data-project-reveal className="mt-6 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-white/80">
            {project.summary}
          </p>

          <div data-project-reveal className="mt-8 grid grid-cols-[0.8fr_1fr] gap-4">
            <div className="hud-panel rounded-md p-5 bg-white/[0.015] border border-white/10 backdrop-blur-sm">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/40">
                Signal
              </p>
              <p className="mt-3 text-[0.8rem] font-semibold leading-relaxed text-white/80">{dossier.signal}</p>
            </div>
            <div className="hud-panel rounded-md p-5 bg-white/[0.015] border border-white/10 backdrop-blur-sm">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/40">
                Impact
              </p>
              <p className="mt-3 text-[0.8rem] font-semibold leading-relaxed text-white/80">{project.impact}</p>
            </div>
          </div>

          <div data-project-reveal className="mt-7 flex flex-wrap gap-2.5">
            {project.stack.map((tech) => (
              <Badge
                key={tech}
                className="border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[0.62rem] text-white/80 hover:bg-white/10 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action Bar (Moved under the text for a cleaner layout) */}
          <div data-project-reveal className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-4">
              {project.repoUrl && (
                 <MagneticButton href={project.repoUrl} primaryColor={palette.primary}>
                   <Github className="h-4 w-4" /> Code
                 </MagneticButton>
              )}
              {project.siteUrl && (
                 <MagneticButton href={project.siteUrl} primaryColor={palette.secondary}>
                   Live Site <ExternalLink className="h-4 w-4" style={{ color: palette.secondary }} />
                 </MagneticButton>
              )}
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="flex items-end gap-3">
              <p className="text-4xl font-black leading-none" style={{ color: palette.primary }}>
                {dossier.metric}
              </p>
              <div className="pb-1">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-white/40">
                  Measured Outcome
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-white/50">{dossier.metricLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Image Card */}
        <div data-project-reveal className={`${mode === "desktop" ? "w-[45vw] max-w-[800px] h-[34rem]" : "w-full min-h-[22rem]"}`}>
          <InteractiveImageCard project={project} palette={palette} className="w-full h-full" />
        </div>
      </div>
    </article>
  );
}

// --- SCROLL CONTROLLERS ---

function MobileProjectStack() {
  return (
    <div className="relative px-4 py-16">
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative z-10 mb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent-primary)]">
          Missions
        </p>
        <h2 className="mt-3 text-[clamp(2.5rem,16vw,4.4rem)] font-black uppercase leading-[0.8] text-white">
          Project Dossiers
        </h2>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {projects.map((project, index) => (
          <ProjectDossier key={project.slug} project={project} index={index} mode="mobile" />
        ))}
      </div>
    </div>
  );
}

function DesktopHorizontalProjects() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const track = trackRef.current;
      const wrapper = wrapperRef.current;
      const progress = progressRef.current;
      if (!track || !wrapper || !progress || prefersReducedMotion) {
        return;
      }

      const initTimeout = window.setTimeout(() => {
        // Right-to-Left math
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

        gsap.set(track, { x: getScrollAmount });
        gsap.set(progress, { scaleX: 0, transformOrigin: "right center" });

        const durationScroll = projects.length - 1;
        const durationSettle = 0.34;
        const totalDuration = durationScroll + durationSettle;
        let activeIndex = -1;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount()) + window.innerWidth * 0.2}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const trackProgress = Math.min((self.progress * totalDuration) / durationScroll, 1);
              const nextIndex = Math.min(Math.floor(trackProgress * projects.length), projects.length - 1);

              gsap.set(progress, { scaleX: trackProgress });
              if (nextIndex !== activeIndex) {
                activeIndex = nextIndex;
                const palette = dossierPalettes[nextIndex % dossierPalettes.length];
                progress.style.backgroundColor = palette.primary;
                progress.style.boxShadow = `0 0 18px ${palette.primary}`;
              }
            },
          },
        });

        // Pull right (camera goes left)
        const scrollTween = timeline.to(track, {
          x: 0,
          ease: cinematicEase.scrub,
          duration: durationScroll,
        });

        timeline.to({}, { duration: durationSettle });

        const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]", wrapper);
        cards.forEach((card, index) => {
          const inner = card.querySelectorAll("[data-project-reveal]");
          gsap.fromTo(
            inner,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.07,
              duration: 0.78,
              ease: cinematicEase.out,
              scrollTrigger: {
                trigger: card,
                start: "right 75%", // Triggers when the right edge enters 75% into the left-panning viewport
                containerAnimation: scrollTween,
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }, 120);

      return () => window.clearTimeout(initTimeout);
    },
    { scope: wrapperRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={wrapperRef} className="projects-wrapper relative h-screen overflow-hidden bg-[#050505]">
      <div
        ref={trackRef}
        className="projects-track flex h-full flex-nowrap flex-row-reverse"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, index) => (
          <ProjectDossier key={project.slug} project={project} index={index} mode="desktop" />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-white/10" />
      <div
        ref={progressRef}
        className="pointer-events-none absolute bottom-0 right-0 h-[2px] w-full origin-right scale-x-0 transition-colors duration-500 ease-out"
        style={{ backgroundColor: dossierPalettes[0].primary, boxShadow: `0 0 18px ${dossierPalettes[0].primary}` }}
      />
    </div>
  );
}

export function HorizontalProjects() {
  setupGsap();

  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden"
    >
      {isMobile || prefersReducedMotion ? <MobileProjectStack /> : <DesktopHorizontalProjects />}
    </section>
  );
}
