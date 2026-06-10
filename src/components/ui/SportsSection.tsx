"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { 
  Activity, 
  Dumbbell, 
  Target, 
  Flame, 
  Zap, 
  Move, 
  ArrowUpRight, 
  Expand, 
  ShieldAlert 
} from "lucide-react";
import { sportsEntries } from "@/data/sports";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

export function SportsSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  const [activeCategory, setActiveCategory] = useState<"badminton" | "gym">("badminton");
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.from("[data-sports-heading]", {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 34,
        duration: prefersReducedMotion ? 0.01 : 0.8,
        stagger: prefersReducedMotion ? 0 : 0.08,
        ease: cinematicEase.out,
        scrollTrigger: {
          trigger: section,
          start: "top 74%",
          invalidateOnRefresh: true,
        },
      });

      gsap.from("[data-sports-hud-reveal]", {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.98,
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const activeData = sportsEntries.find((e) => e.category === activeCategory) || sportsEntries[0];

  // Dynamic status tags based on active category
  const activeStatusTags = activeCategory === "badminton" 
    ? [
        { label: "Focus", value: "Lethal", Icon: Target },
        { label: "Pace", value: "Express", Icon: Zap },
        { label: "Recovery", value: "Active", Icon: Activity },
      ]
    : [
        { label: "Focus", value: "Absolute", Icon: Target },
        { label: "Pace", value: "Controlled", Icon: Activity },
        { label: "Recovery", value: "Optimal", Icon: Dumbbell },
      ];

  // Badminton Court Zones for SVG Hotspots
  const courtZones = [
    { name: "Smash Zone (Backcourt)", metricIdx: 0, Icon: Flame, cx: 100, cy: 22, description: "Explosive overhead smash release vector." },
    { name: "Reaction Vector (Midcourt)", metricIdx: 1, Icon: Zap, cx: 45, cy: 55, description: "Agile lateral defense and split-step reflexes." },
    { name: "Coverage Grid (Center)", metricIdx: 2, Icon: Move, cx: 100, cy: 68, description: "High-stamina full court transition movement." },
    { name: "Mobility Reach (Net)", metricIdx: 3, Icon: Expand, cx: 155, cy: 88, description: "Flexibility-demanding lunges and net drops." },
  ];

  return (
    <section
      id="sports"
      ref={sectionRef}
      className="relative min-h-[100dvh] scroll-mt-24 overflow-hidden px-[clamp(1rem,5vw,4rem)] py-20 text-white flex items-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 22px), radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--accent-primary) 12%, transparent), transparent 40%), radial-gradient(circle at 85% 80%, color-mix(in srgb, var(--accent-secondary) 12%, transparent), transparent 40%), var(--bg-base)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,var(--accent-primary),transparent)] opacity-30" />
      
      <p className="pointer-events-none absolute left-1/2 top-10 hidden -translate-x-1/2 select-none text-[clamp(6rem,15vw,14rem)] font-black uppercase leading-none text-white opacity-[0.025] lg:block">
        Discipline
      </p>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        
        {/* Left Side: Dynamic Visual HUD (Badminton Court SVG or Gym Circular Gauges) */}
        <div data-sports-hud-reveal className="relative rounded-md border border-white/10 bg-black/40 p-6 backdrop-blur-md min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_70%)]" />
          
          {/* Diagnostic Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.32em] text-[var(--accent-primary-light)]">
                Diagnostic Telemetry
              </p>
              <h3 className="text-lg font-black uppercase tracking-wider mt-1 text-white">
                {activeCategory === "badminton" ? "Badminton Court Matrix" : "Biometric Strength Grid"}
              </h3>
            </div>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] border border-white/10 px-2.5 py-1 bg-white/[0.02] text-white/50">
              {activeCategory === "badminton" ? "System: Active" : "Regimen: Engaged"}
            </span>
          </div>

          {/* Interactive Visualizer Canvas */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-6">
            {activeCategory === "badminton" ? (
              /* --- Interactive Badminton Court Visualizer --- */
              <div className="w-full max-w-[420px] aspect-[1.6] relative flex items-center justify-center">
                <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-[0_0_20px_rgba(var(--accent-primary),0.1)]">
                  {/* Court grid background */}
                  <rect x="10" y="10" width="180" height="100" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.25" />
                  
                  {/* Outer boundaries */}
                  <rect x="20" y="10" width="160" height="100" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeOpacity="0.5" />
                  
                  {/* Left & Right doubles boundary lines */}
                  <line x1="32" y1="10" x2="32" y2="110" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />
                  <line x1="168" y1="10" x2="168" y2="110" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />
                  
                  {/* Short service lines */}
                  <line x1="20" y1="42" x2="180" y2="42" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />
                  <line x1="20" y1="78" x2="180" y2="78" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />

                  {/* Net line (horizontal center) */}
                  <line x1="20" y1="60" x2="180" y2="60" stroke="var(--accent-primary)" strokeWidth="1.8" strokeDasharray="3 2" strokeOpacity="0.8" />
                  
                  {/* Center line (longitudinal dividers) */}
                  <line x1="100" y1="10" x2="100" y2="42" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />
                  <line x1="100" y1="78" x2="100" y2="110" stroke="var(--accent-primary)" strokeWidth="0.8" strokeOpacity="0.3" />

                  {/* Interactive Hotspot Zones */}
                  {courtZones.map((zone, idx) => {
                    const isHovered = hoveredZone === idx;
                    return (
                      <g 
                        key={zone.name}
                        onMouseEnter={() => setHoveredZone(idx)}
                        onMouseLeave={() => setHoveredZone(null)}
                        className="cursor-pointer"
                      >
                        {/* Interactive trigger circle */}
                        <circle 
                          cx={zone.cx} 
                          cy={zone.cy} 
                          r={14} 
                          fill="transparent" 
                        />
                        {/* Pulse animation ring */}
                        <circle 
                          cx={zone.cx} 
                          cy={zone.cy} 
                          r={isHovered ? 9 : 6} 
                          fill="none" 
                          stroke="var(--accent-primary)" 
                          strokeWidth="1" 
                          strokeOpacity={isHovered ? "0.6" : "0.3"} 
                          className="transition-all duration-300"
                        />
                        {/* Outer ping */}
                        {!isHovered && (
                          <circle 
                            cx={zone.cx} 
                            cy={zone.cy} 
                            r={6} 
                            fill="none" 
                            stroke="var(--accent-primary)" 
                            strokeWidth="1.5" 
                            className="animate-ping origin-center" 
                            style={{ animationDuration: `${2 + idx * 0.5}s` }}
                          />
                        )}
                        {/* Solid core */}
                        <circle 
                          cx={zone.cx} 
                          cy={zone.cy} 
                          r={isHovered ? 4.5 : 3.5} 
                          fill="var(--accent-primary)" 
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Court Telemetry Card */}
                <div className="absolute bottom-2 left-2 right-2 border border-white/10 bg-black/80 px-4 py-2.5 rounded-sm backdrop-blur-md transition-all duration-300 flex items-center justify-between">
                  {hoveredZone !== null ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-sm bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                          {(() => {
                            const IconComp = courtZones[hoveredZone].Icon;
                            return <IconComp className="h-4 w-4" />;
                          })()}
                        </span>
                        <div>
                          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-[var(--accent-primary-light)]">
                            {courtZones[hoveredZone].name}
                          </p>
                          <p className="text-[10px] text-white/50 leading-none mt-1">
                            {courtZones[hoveredZone].description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-black text-white leading-none">
                          {activeData.metrics[courtZones[hoveredZone].metricIdx].value}
                        </p>
                        <p className="font-mono text-[0.54rem] uppercase tracking-widest text-white/40 mt-1">
                          {activeData.metrics[courtZones[hoveredZone].metricIdx].label}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-white/40 justify-center w-full py-1 text-[10px] font-mono tracking-wider">
                      <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-[var(--accent-primary)]/70" />
                      <span>HOVER COURT HOTSPOTS TO INITIATE ZONE DIAGNOSTICS</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* --- Strength & Flexibility Circular Dials --- */
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-[400px]">
                {activeData.metrics.map((metric, idx) => {
                  const radius = 32;
                  const strokeWidth = 3.5;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (circumference * metric.percentage) / 100;
                  
                  return (
                    <div key={metric.label} className="flex flex-col items-center group/dial">
                      <div className="relative h-20 w-20 flex items-center justify-center">
                        <svg className="h-full w-full transform -rotate-90">
                          {/* Background Ring */}
                          <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth={strokeWidth}
                          />
                          {/* Active Ring */}
                          <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="none"
                            stroke="var(--accent-primary)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{ strokeOpacity: 0.8 }}
                          />
                        </svg>
                        {/* Inner Metrics value */}
                        <div className="absolute text-center">
                          <span className="block font-mono text-[11px] font-black text-white">
                            {metric.percentage}%
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-white text-center leading-none">
                        {metric.label}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--accent-primary-light)] text-center">
                        {metric.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Diagnostic Footer */}
          <div className="relative z-10 border-t border-white/10 pt-4 grid grid-cols-3 gap-2">
            {activeStatusTags.map(({ label, value, Icon }) => (
              <div key={label} className="border border-white/5 bg-white/[0.01] rounded-sm p-2 text-center">
                <Icon className="h-3.5 w-3.5 mx-auto text-[var(--accent-primary-light)] opacity-70" />
                <p className="mt-1.5 font-mono text-[0.52rem] uppercase tracking-widest text-white/36 leading-none">
                  {label}
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-white leading-none">
                  {value}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Tab Selectors & Core Highlights */}
        <div className="flex flex-col justify-center">
          
          <div data-sports-heading>
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-[var(--accent-primary-light)]">
              Discipline Layer
            </p>
            <h2 className="mt-4 text-[clamp(2.5rem,6vw,5.2rem)] font-black uppercase leading-[0.78] text-white">
              Pressure Trains Precision
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">
              Athletic sports sharpen the same mental traits required to build production software: focus under load, consistent repetition, agile recovery, and team collaboration.
            </p>
          </div>

          {/* Interactive Profile Switchers */}
          <div className="mt-10 space-y-4">
            {sportsEntries.map((sport) => {
              const isActive = activeCategory === sport.category;
              
              return (
                <button
                  key={sport.title}
                  onClick={() => setActiveCategory(sport.category)}
                  className={`group relative w-full text-left overflow-hidden rounded-md border p-6 transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/[0.03] shadow-[0_0_30px_var(--accent-primary-glow)]" 
                      : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon indicator */}
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                      isActive 
                        ? "border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" 
                        : "border-white/10 bg-white/[0.04] text-white/60"
                    }`}>
                      {sport.category === "badminton" ? (
                        <Flame className="h-5 w-5" />
                      ) : (
                        <Dumbbell className="h-5 w-5" />
                      )}
                    </span>

                    {/* Metadata */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-[0.62rem] uppercase tracking-[0.24em] ${
                          isActive ? "text-[var(--accent-primary-light)]" : "text-white/40"
                        }`}>
                          {sport.category === "badminton" ? "Active Play" : "Conditioning"}
                        </span>
                        <span className="h-px flex-1 bg-white/5" />
                        <ChevronRightIcon className={`h-4 w-4 transition-transform duration-300 ${
                          isActive ? "text-[var(--accent-primary)] translate-x-1" : "text-white/20"
                        }`} />
                      </div>
                      <h3 className="mt-2 text-xl font-black uppercase leading-tight text-white">
                        {sport.title}
                      </h3>
                      <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/36 leading-none">
                        {sport.level}
                      </p>
                      
                      {/* Show active highlights directly inside the expanded card */}
                      {isActive && (
                        <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 transition-all duration-500">
                          {sport.highlights.map((highlight) => (
                            <div key={highlight} className="flex items-start gap-2 text-xs text-white/60 leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

// Simple Helper for right arrow icon
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
