"use client";

import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Triangle,
  LayoutTemplate,
  Wind,
  Layout,
  LayoutDashboard,
  Move,
  Layers,
  Sparkles,
  Rocket,
  Globe,
  MonitorPlay,
  Terminal,
  BrainCircuit,
  Database,
  Cloud,
  Box,
  Hexagon,
  Settings,
  Server,
  Video,
  GitBranch,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import { gsap, setupGsap } from "@/lib/gsap";
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
};

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

const techLogoOverrides: Record<string, string> = {
  "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
  "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "LLMs": "https://svgl.app/library/openai.svg",
};

export function SkillsBento() {
  setupGsap();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prefersReducedMotion = useReducedMotionPreference();
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });

  // Sync ref with active index state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Monitor visibility to pause rendering when out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle tech badges entry animation on change
  useEffect(() => {
    gsap.fromTo(
      ".tech-badge",
      { opacity: 0, y: 15, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.04, ease: "power2.out", overwrite: "auto" }
    );
  }, [activeIndex]);

  // Interactive Particle Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion || !isSectionVisible) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth || 500;
    let height = canvas.height = canvas.offsetHeight || 500;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener("resize", handleResize);

    interface MorphingParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      baseX: number;
      baseY: number;
      seed: number;
      size: number;
      speed: number;
      alpha: number;
      pipelineX?: number;
    }

    const particleCount = 130;
    const particles: MorphingParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      particles.push({
        x: rx,
        y: ry,
        targetX: rx,
        targetY: ry,
        baseX: rx,
        baseY: ry,
        seed: Math.random() * 100,
        size: 1.2 + Math.random() * 2.2,
        speed: 0.035 + Math.random() * 0.045,
        alpha: 0.35 + Math.random() * 0.55,
      });
    }

    let frame = 0;
    let animationId: number;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const activeIdx = activeIndexRef.current;
      const currentAccent = systemAccents[activeIdx % systemAccents.length];

      // Dynamic nodes for AI network strand
      const hubs: { x: number; y: number }[] = [];
      if (activeIdx === 2) {
        const numHubs = 4;
        const spacingX = width / (numHubs + 1);
        for (let i = 0; i < numHubs; i++) {
          hubs.push({
            x: spacingX * (i + 1),
            y: height * 0.5 + Math.sin(frame * 0.025 + i) * 45
          });
        }
      }

      // Smooth mouse position lerping
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;
      }

      particles.forEach((p, idx) => {
        let tx = p.baseX;
        let ty = p.baseY;

        if (activeIdx === null) {
          // Idle floating
          p.baseX += Math.sin(frame * 0.004 + p.seed) * 0.18;
          p.baseY += Math.cos(frame * 0.004 + p.seed) * 0.18;
          
          if (p.baseX < 0) p.baseX = width;
          if (p.baseX > width) p.baseX = 0;
          if (p.baseY < 0) p.baseY = height;
          if (p.baseY > height) p.baseY = 0;

          tx = p.baseX + Math.sin(frame * 0.008 + p.seed) * 20;
          ty = p.baseY + Math.cos(frame * 0.008 + p.seed) * 20;
        } else if (activeIdx === 0) {
          // Frontend: Isometric Grid
          const cols = 7;
          const rowsCount = 5;
          const layers = 3;
          const isoIdx = idx % (cols * rowsCount * layers);
          const cx = isoIdx % cols;
          const cy = Math.floor((isoIdx / cols) % rowsCount);
          const cz = Math.floor(isoIdx / (cols * rowsCount));

          const spacingX = 35;
          const spacingY = 18;
          const spacingZ = 22;

          const isoX = width * 0.5 + (cx - cy) * spacingX;
          const isoY = height * 0.55 + (cx + cy) * spacingY - cz * spacingZ;

          tx = isoX;
          ty = isoY;
        } else if (activeIdx === 1) {
          // Motion: Double Helix Wave
          const step = width / particleCount;
          const px = idx * step;
          const isStrandA = idx % 2 === 0;
          const phaseOffset = isStrandA ? 0 : Math.PI;
          const py = height * 0.5 + Math.sin(px * 0.007 + frame * 0.03 + phaseOffset) * 75;
          
          tx = px;
          ty = py;
        } else if (activeIdx === 2) {
          // AI: Neural Net Constellation
          const hubIdx = idx % hubs.length;
          const angle = (idx * 2.3) % (Math.PI * 2);
          const rad = 25 + ((idx * 11) % 50);
          
          tx = hubs[hubIdx].x + Math.cos(angle) * rad;
          ty = hubs[hubIdx].y + Math.sin(angle) * rad;
        } else if (activeIdx === 3) {
          // Cloud: Concentric Rings
          const ringIdx = idx % 4;
          const radius = 60 + ringIdx * 38;
          const particlesPerRing = Math.floor(particleCount / 4);
          const ringPos = Math.floor(idx / 4);
          const rotSpeed = ringIdx % 2 === 0 ? 0.006 : -0.009;
          const angle = (ringPos / particlesPerRing) * Math.PI * 2 + frame * rotSpeed;

          tx = width * 0.5 + Math.cos(angle) * radius;
          ty = height * 0.5 + Math.sin(angle) * radius * 0.72;
        } else if (activeIdx === 4) {
          // Backend: Linear pipelines
          const pipelineIdx = idx % 5;
          const pipelineY = height * 0.22 + pipelineIdx * height * 0.14;
          const speed = 1.5 + (idx % 4) * 0.6;
          
          p.pipelineX = (p.pipelineX || Math.random() * width) + speed;
          if (p.pipelineX > width + 20) {
            p.pipelineX = -20;
          }
          
          tx = p.pipelineX;
          ty = pipelineY;
        }

        // Pointer force repulsion
        if (mouseRef.current.active) {
          const dx = tx - mouseRef.current.x;
          const dy = ty - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const force = (110 - dist) * 0.12;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
          }
        }

        // Lerp position
        p.x += (tx - p.x) * p.speed;
        p.y += (ty - p.y) * p.speed;

        // Draw particle
        ctx.fillStyle = `color-mix(in srgb, ${currentAccent} ${p.alpha * 100}%, transparent)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = currentAccent;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connected lines for AI neural network hubs
        if (activeIdx === 2 && idx < hubs.length) {
          hubs.forEach((h1, i) => {
            hubs.forEach((h2, j) => {
              if (i >= j) return;
              const dist = Math.hypot(h1.x - h2.x, h1.y - h2.y);
              if (dist < width * 0.3) {
                ctx.beginPath();
                ctx.moveTo(h1.x, h1.y);
                ctx.lineTo(h2.x, h2.y);
                ctx.strokeStyle = `color-mix(in srgb, ${currentAccent} 18%, transparent)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          });
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

  // Pointer event handlers for viewport interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.targetX = e.clientX - rect.left;
    mouseRef.current.targetY = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const activeAccent = systemAccents[activeIndex % systemAccents.length];

  return (
    <section
      id="skills"
      className="relative w-full bg-[#020202] py-24 lg:py-32 overflow-hidden border-t border-white/5"
    >
      <div 
        ref={containerRef} 
        className="relative z-10 mx-auto grid w-full max-w-350 gap-8 px-[clamp(1rem,5vw,4rem)] lg:grid-cols-[0.42fr_0.58fr] lg:gap-10 lg:h-[75vh] lg:min-h-150 lg:max-h-212.5 lg:px-8"
      >
        {/* Left Side Column: Accordion Menu */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Cinematic Section Header */}
            <div className="mb-8 border-l-2 border-accent-primary pl-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
                05 // STACK
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
                EXECUTION ARCHITECTURE
              </h2>
            </div>

            {/* Vertical menu navigation */}
            <div className="flex flex-col gap-3">
              {skillCategories.map((category, index) => {
                const isActive = index === activeIndex;
                const accent = systemAccents[index % systemAccents.length];
                
                return (
                  <button
                    key={category.title}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left relative overflow-hidden rounded-xl border p-5 transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "border-white/10 bg-white/2" 
                        : "border-white/5 bg-transparent hover:border-white/10"
                    }`}
                    style={{
                      boxShadow: isActive 
                        ? `0 0 25px color-mix(in srgb, ${accent} 8%, transparent)` 
                        : "none"
                    }}
                  >
                    <div className="absolute right-4 top-4 font-mono text-xl font-black text-white/5">
                      0{index + 1}
                    </div>
                    <div className="relative z-10">
                      <h3 
                        className="text-lg font-black uppercase tracking-tight transition-colors duration-300"
                        style={{
                          color: isActive ? accent : "rgba(255,255,255,0.7)"
                        }}
                      >
                        {category.title}
                      </h3>
                      
                      {/* Vertical details drawer */}
                      <div 
                        className={`grid transition-all duration-500 ease-in-out ${
                          isActive ? "grid-rows-[1fr] opacity-100 mt-3.5" : "grid-rows-[0fr] opacity-0 h-0 overflow-hidden"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs text-white/50 leading-relaxed mb-4">
                            {category.description}
                          </p>
                          
                          {/* HUD Diagnostics Panel */}
                          <div className="hud-panel w-full p-4 rounded-sm border border-white/5 bg-black/60 backdrop-blur-sm flex flex-col gap-2.5 font-mono text-[9px] text-white/50">
                            <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-white/40">
                              <span>SYSTEM_DIAGNOSTICS</span>
                              <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                                <span style={{ color: accent }}>COMPILED // OK</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-white/50">
                              <div>
                                <p className="text-white/30 text-[8px] uppercase tracking-wider">LOAD_MULTIPLIER</p>
                                <p className="font-bold mt-0.5 text-zinc-300">
                                  {index === 0 ? "RENDER_TARGET: CLIENT/SERVER" :
                                   index === 1 ? "RENDER_PIPELINE: ACCELERATED" :
                                   index === 2 ? "COMPUTE_MODE: CLUSTER/MODEL" :
                                   index === 3 ? "SYSTEM: HIGH_AVAILABILITY" :
                                   "SECURE_SOCKET: COMPILING"}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/30 text-[8px] uppercase tracking-wider">INTEGRATION_STATUS</p>
                                <p className="font-bold mt-0.5 text-zinc-300">
                                  {index === 0 ? "OPTIMIZATION: HIGH" :
                                   index === 1 ? "LATENCY: LOW (60FPS)" :
                                   index === 2 ? "CASCADE_FALLBACK: OK" :
                                   index === 3 ? "SERVERLESS: AUTO_SCALE" :
                                   "CI_CD: INTEGRATED"}
                                </p>
                              </div>
                            </div>

                            <div className="w-full mt-1">
                              <div className="flex justify-between text-white/40 text-[8px] mb-1">
                                <span>COMPETENCY_INDEX</span>
                                <span style={{ color: accent }} className="font-bold">
                                  {index === 0 ? "96%" :
                                   index === 1 ? "94%" :
                                   index === 2 ? "90%" :
                                   index === 3 ? "88%" :
                                   "92%"}
                                </span>
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{ 
                                    backgroundColor: accent,
                                    boxShadow: `0 0 10px ${accent}`,
                                    width: index === 0 ? "96%" :
                                           index === 1 ? "94%" :
                                           index === 2 ? "90%" :
                                           index === 3 ? "88%" :
                                           "92%"
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side Column: Interactive Canvas Viewport */}
        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-xl border bg-black/40 backdrop-blur-md overflow-hidden flex flex-col justify-between p-6 sm:p-8 min-h-115 lg:h-full transition-all duration-500"
          style={{
            borderColor: `color-mix(in srgb, ${activeAccent} 32%, rgba(255,255,255,0.06))`,
            boxShadow: `0 34px 100px rgba(0,0,0,0.65), 0 0 25px color-mix(in srgb, ${activeAccent} 6%, transparent)`
          }}
        >
          {/* Animated Background Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-60"
          />

          {/* Coordinates Header Overlay */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4 text-[9px] font-mono tracking-widest text-white/30">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: activeAccent }} />
              <span>SYS_ACCELERATED // CHANNEL_0{activeIndex + 1}</span>
            </div>
            <span>RENDER: PARTICLES_3D_MORPH</span>
          </div>

          {/* Technologies Nodes Overlay Grid */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full">
              {skillCategories[activeIndex].technologies.map((item) => {
                const overrideUrl = techLogoOverrides[item];
                const simpleSlug = techLogos[item];
                const logoUrl = overrideUrl || (simpleSlug ? `https://cdn.simpleicons.org/${simpleSlug}` : null);
                const Icon = (techIcons[item] || Code2) as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
                
                return (
                  <div
                    key={item}
                    className="tech-badge flex items-center gap-3 p-3.5 rounded-lg border border-white/5 bg-black/72 backdrop-blur-md transition-all duration-300 hover:border-(--active-accent) hover:bg-white/3 hover:-translate-y-0.5"
                    style={{
                      '--active-accent': activeAccent
                    } as React.CSSProperties}
                  >
                    {logoUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={logoUrl} 
                          alt={`${item} logo`} 
                          className={`h-4.5 w-4.5 shrink-0 ${item === "LLMs" ? "invert opacity-90" : ""}`}
                        />
                      </>
                    ) : (
                      <Icon className="h-4.5 w-4.5 shrink-0" style={{ color: activeAccent }} />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white truncate">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Viewport Footer Overlay */}
          <div className="relative z-10 border-t border-white/5 pt-4 text-[8px] font-mono tracking-widest text-white/20 flex justify-between">
            <span>GRID: RESOLVED_COMPILER_OK</span>
            <span>INDEX: 0{activeIndex + 1} {"//"} 05</span>
          </div>
        </div>
      </div>
    </section>
  );
}
