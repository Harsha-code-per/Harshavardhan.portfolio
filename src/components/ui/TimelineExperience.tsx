"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { BriefcaseBusiness, GraduationCap, ArrowUpRight } from "lucide-react";
import { publications } from "@/data/publications";
import { workExperience } from "@/data/work";
import { ScrollTrigger, setupGsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

type JourneyMilestone = {
  id: string;
  year: string;
  title: string;
  type: "work" | "research";
  highlights: string[];
  url?: string;
  sortWeight: number;
};

// Sort milestones chronologically
const journeyMilestones: JourneyMilestone[] = [
  ...workExperience.map((work) => ({
    id: work.role + work.organization,
    year: work.period,
    title: `${work.role} · ${work.organization}`,
    type: "work" as const,
    highlights: [work.overview, ...work.outcomes],
    sortWeight: work.organization.includes("Zensphere") ? 3 : 1,
  })),
  ...publications.map((publication) => ({
    id: publication.title,
    year: publication.year,
    title: publication.title,
    type: "research" as const,
    highlights: [publication.publisher, publication.summary],
    url: publication.url,
    sortWeight: 2,
  })),
].sort((a, b) => b.sortWeight - a.sortWeight);

const routeAccents = ["#00f2fe", "#b2ff05", "#ff4560"] as const;

// Telemetry character-scrambler date component
function DateScrambler({ dateText }: { dateText: string }) {
  const [display, setDisplay] = useState(dateText);

  useEffect(() => {
    let frame = 0;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-/.";
    const duration = 18;
    let animationId: number;

    const tick = () => {
      frame++;
      if (frame < duration) {
        const scrambled = dateText
          .split("")
          .map((char) => {
            if (char === " " || char === "-") return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setDisplay(scrambled);
        animationId = requestAnimationFrame(tick);
      } else {
        setDisplay(dateText);
      }
    };

    tick();
    return () => cancelAnimationFrame(animationId);
  }, [dateText]);

  return <span>{display}</span>;
}

export function TimelineExperience() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const probeRef = useRef<SVGGElement | null>(null);
  const velocityTextRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const velocityRef = useRef(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Monitor visibility to pause background canvas loops when out of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync ref with active index state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Measure path length and trigger default pos
  useEffect(() => {
    const path = pathRef.current;
    if (path) {
      const point = path.getPointAtLength(0);
      if (probeRef.current) {
        probeRef.current.setAttribute("transform", `translate(${point.x}, ${point.y})`);
      }
    }
  }, []);

  // Background Warp-Speed Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion || !isSectionVisible) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth || 800;
    let height = canvas.height = canvas.offsetHeight || 600;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    interface StardustParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
      color: string;
    }

    const particles: StardustParticle[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2,
        speed: 0.12 + Math.random() * 0.35,
        alpha: 0.25 + Math.random() * 0.55,
        color: routeAccents[i % routeAccents.length],
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentVelocity = velocityRef.current;
      const isWarping = Math.abs(currentVelocity) > 0.03;

      // Smooth decay on velocity
      velocityRef.current *= 0.94;
      if (velocityTextRef.current) {
        velocityTextRef.current.textContent = `${Math.round(Math.abs(velocityRef.current) * 100)} km/s`;
      }

      particles.forEach((p) => {
        const directionFactor = currentVelocity >= 0 ? 1 : -1;
        const warpMultiplier = isWarping ? 1 + Math.abs(currentVelocity) * 35 : 1;

        p.x += p.speed * directionFactor * warpMultiplier;

        // Wrap boundaries
        if (p.x < -100) p.x = width + 100;
        if (p.x > width + 100) p.x = -100;

        ctx.strokeStyle = `color-mix(in srgb, ${p.color} ${p.alpha * 100}%, transparent)`;
        ctx.fillStyle = `color-mix(in srgb, ${p.color} ${p.alpha * 100}%, transparent)`;
        ctx.lineWidth = p.size;

        ctx.beginPath();
        if (isWarping) {
          const lineLength = p.speed * Math.abs(currentVelocity) * 38;
          ctx.moveTo(p.x - lineLength * directionFactor, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReducedMotion, isSectionVisible]);

  // GSAP ScrollTrigger Pinned Timeline
  useGSAP(
    () => {
      const section = sectionRef.current;
      const path = pathRef.current;
      if (!section || !path || prefersReducedMotion) return;

      const totalLength = path.getTotalLength();

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const vel = self.getVelocity() / 1500; // Normalize velocity scale
          
          velocityRef.current = vel;
          if (velocityTextRef.current) {
            velocityTextRef.current.textContent = `${Math.round(Math.abs(vel) * 100)} km/s`;
          }

          // 1. Draw glowing SVG path line dynamically
          const drawLength = totalLength * progress;
          path.style.strokeDasharray = `${totalLength}`;
          path.style.strokeDashoffset = `${totalLength - drawLength}`;

          // 2. Translate Time Probe along coordinates
          const point = path.getPointAtLength(progress * totalLength);
          if (probeRef.current) {
            probeRef.current.setAttribute("transform", `translate(${point.x}, ${point.y})`);
          }

          // 3. Update active index stop dynamically
          let currentActive = Math.floor(progress / (1 / journeyMilestones.length));
          if (currentActive >= journeyMilestones.length) {
            currentActive = journeyMilestones.length - 1;
          }
          if (currentActive !== activeIndexRef.current) {
            setActiveIndex(currentActive);
          }
        },
      });

      return () => {
        pinTrigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#030303] py-16 lg:py-0 text-white border-t border-white/5 flex items-center"
    >
      {/* Background Warp Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-40"
      />

      {/* SVG Winding Pathway (Visible on Desktop) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden lg:block">
        <svg viewBox="0 0 1000 600" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.15" />
              <stop offset="50%" stopColor="var(--accent-secondary)" stopOpacity="0.65" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Dim background path */}
          <path
            d="M 100 300 C 250 100, 400 100, 500 300 S 750 500, 900 300"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Glowing active path */}
          <path
            ref={pathRef}
            d="M 100 300 C 250 100, 400 100, 500 300 S 750 500, 900 300"
            fill="none"
            stroke="url(#pathGlow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          />

          {/* Milestone nodes */}
          {[
            { x: 100, y: 300 },
            { x: 500, y: 300 },
            { x: 900, y: 300 },
          ].map((node, i) => {
            const isActive = i === activeIndex;
            const accent = routeAccents[i % routeAccents.length];

            return (
              <g key={i}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 9 : 5}
                  className="transition-all duration-300"
                  fill={i <= activeIndex ? accent : "rgba(255,255,255,0.12)"}
                  style={{
                    filter: i <= activeIndex ? `drop-shadow(0 0 10px ${accent})` : "none",
                  }}
                />
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill="none"
                    stroke={accent}
                    strokeWidth="1"
                    className="animate-ping origin-center"
                    style={{ animationDuration: "1.8s" }}
                  />
                )}
              </g>
            );
          })}

          {/* Time Probe Marker */}
          <g ref={probeRef}>
            <circle r="6.5" fill="#ffffff" style={{ filter: "drop-shadow(0 0 12px var(--accent-primary))" }} />
            <circle r="13" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" className="animate-pulse" />
          </g>
        </svg>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl h-full flex-col lg:flex-row items-center justify-between px-[clamp(1rem,5vw,4rem)] py-24">
        
        {/* Left Side: Sticky HUD details */}
        <div className="flex flex-col justify-center w-full lg:max-w-[40%] text-left">
          {/* Chapter Dossier Header */}
          <div className="mb-6 border-l-2 border-accent-primary pl-4">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
              06 // PATH
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
              MILESTONES & TRANSITIONS
            </h2>
          </div>

          <div className="mb-8">
            <h3 className="text-[clamp(1.8rem,4vw,3.2rem)] font-black uppercase leading-[0.95] text-white/90">
              Path of Execution
            </h3>
          </div>

          {/* Scramble HUD Telemetry Box */}
          <div className="hud-panel p-6 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 w-full max-w-85">
            <p className="font-mono text-[0.5rem] tracking-[0.24em] text-white/40 mb-2.5 uppercase">Time Telemetry Sync</p>
            <div className="font-mono text-base sm:text-lg lg:text-xl xl:text-2xl font-black text-accent-primary-light">
              <DateScrambler dateText={journeyMilestones[activeIndex].year} />
            </div>
          </div>

          {/* Warp Status Indicators */}
          <div className="mt-6 border border-white/5 bg-white/1 rounded-sm p-4 font-mono text-[0.5625rem] w-full max-w-85 space-y-2.5 text-white/45 hidden sm:block">
            <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/60">
              <span>PATH NAVIGATION</span>
              <span className="text-accent-primary-light font-bold">ENGAGED</span>
            </div>
            <div className="flex justify-between">
              <span>WARP SPEED FACTOR</span>
              <span ref={velocityTextRef} className="text-zinc-300 font-bold">0 km/s</span>
            </div>
            <div className="flex justify-between">
              <span>CURRENT LOG INDEX</span>
              <span>0{activeIndex + 1} / 03</span>
            </div>
          </div>
        </div>

        {/* Mobile Years Nav (Visible on Mobile/Tablet only) */}
        <div className="flex justify-center gap-3 mt-6 lg:hidden no-print z-30 relative w-full">
          {journeyMilestones.map((m, idx) => {
            const isActive = idx === activeIndex;
            const accent = routeAccents[idx % routeAccents.length];
            return (
              <button
                key={m.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2 font-mono text-[0.625rem] uppercase tracking-widest border transition-all duration-300 rounded bg-black/40 cursor-pointer`}
                style={{
                  borderColor: isActive ? accent : "rgba(255,255,255,0.05)",
                  boxShadow: isActive ? `0 0 15px color-mix(in srgb, ${accent} 25%, transparent)` : "none",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.4)"
                }}
              >
                {m.year}
              </button>
            );
          })}
        </div>

        {/* Right Side: 3D Holographic Card Viewport */}
        <div className="relative w-full h-100 sm:h-120 lg:h-137.5 lg:max-w-[55%] flex items-center justify-center mt-4 lg:mt-0" style={{ perspective: "1200px" }}>
          {journeyMilestones.map((milestone, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            const isFuture = i > activeIndex;
            const accent = routeAccents[i % routeAccents.length];
            const Icon = milestone.type === "work" ? BriefcaseBusiness : GraduationCap;
            const yearWatermark = milestone.year.match(/\d{4}/)?.[0] || "202X";
            
            // Compose 3D depth styles
            let transformStr = "translateZ(-250px) rotateY(35deg) scale(0.7) opacity(0)";
            if (isActive) {
              transformStr = "translateZ(0) rotateY(0deg) scale(1)";
            } else if (isPast) {
              transformStr = "translateZ(100px) rotateY(-35deg) translateY(-60px) scale(0.85)";
            } else if (isFuture) {
              transformStr = "translateZ(-150px) rotateY(35deg) translateY(60px) scale(0.85)";
            }

            return (
              <article
                key={`card-${milestone.id}`}
                className={`absolute w-full max-w-120 transition-all duration-700 ease-out ${
                  isActive ? "pointer-events-auto opacity-100 z-20" : "pointer-events-none opacity-0 z-10"
                }`}
                style={{
                  transform: transformStr,
                  transitionDelay: isActive ? "80ms" : "0ms",
                }}
              >
                <div 
                  className="group relative flex flex-col overflow-hidden rounded-4xl border p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl bg-black/48"
                  style={{
                    borderColor: isActive ? `color-mix(in srgb, ${accent} 35%, rgba(255,255,255,0.06))` : "rgba(255,255,255,0.05)",
                    boxShadow: isActive 
                      ? `0 24px 80px rgba(0,0,0,0.65), 0 0 35px color-mix(in srgb, ${accent} 8%, transparent)` 
                      : "none",
                  }}
                >
                  {/* Ambient Glow */}
                  <div
                    className="pointer-events-none absolute -right-32 -top-32 h-120 w-120 rounded-full opacity-10 blur-[100px] transition-opacity duration-700 group-hover:opacity-20"
                    style={{ background: accent }}
                  />

                  {/* Massive Watermark Year */}
                  <div className="pointer-events-none absolute -bottom-10 -right-4 font-mono text-[14vw] font-black leading-none text-white/1.5 md:text-[8vw] select-none">
                    {yearWatermark}
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/3 border border-white/10 shadow-inner">
                        <Icon className="h-5 w-5" style={{ color: accent }} />
                      </span>
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                        {milestone.type === "work" ? "Professional" : "Academic"}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-black uppercase leading-[1.1] text-white md:text-3xl lg:text-4xl">
                      {milestone.title}
                    </h3>

                    <div className="mt-6 flex flex-col gap-4">
                      {milestone.highlights.map((highlight, idx) => (
                        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-white/70">
                          {highlight}
                        </p>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                      {milestone.url ? (
                        <a
                          href={milestone.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:text-white"
                          style={{ color: accent }}
                        >
                          Read Publication <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-white/30">
                          Production Code
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
