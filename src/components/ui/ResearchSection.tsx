"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Crosshair, Radio, Battery, Lock, Shield, Terminal, Cpu, Users, Award, BookOpen } from "lucide-react";

import { gsap, setupGsap } from "@/lib/gsap";


// Text scrambler component that shuffles text on change
function TextScrambler({ text = "", duration = 25, speed = 1 }: { text?: string; duration?: number; speed?: number }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!text) return;
    let frame = 0;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-/.<>[]{}@#$%&*+_=";
    let animationId: number;

    const tick = () => {
      frame += speed;
      if (frame < duration) {
        const progress = frame / duration;
        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n" || char === "." || char === "-" || char === "/") return char;
            if (index / text.length < progress) {
              return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setDisplay(scrambled);
        animationId = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    // Schedule the first animation frame asynchronously to satisfy React set-state-in-effect rules
    animationId = requestAnimationFrame(tick);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [text, duration, speed]);

  return <span>{display}</span>;
}

export function ResearchSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const lineHRef = useRef<HTMLDivElement | null>(null);
  const lineVRef = useRef<HTMLDivElement | null>(null);
  const coordsBoxRef = useRef<HTMLDivElement | null>(null);
  const droneContainerRef = useRef<HTMLDivElement | null>(null);
  const droneRef = useRef<SVGSVGElement | null>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState(0);


  // Paper structured details from co-authored publication context
  const paperDetails = {
    title: "Development of an IoT-based UAV Platform for Intelligent 360° Aerial Security Surveillance",
    authors: [
      "Harshavardhan K (RMK College of Engineering and Technology)",
      "Dr. E. Anna Devi (Sathyabama Institute of Science and Technology)",
      "Dr. P. Josephin Shermila (RMK College of Engineering and Technology)",
      "Gokul M, Dr. S. Sajithra Varun, Dr. C. Reeda Lenus"
    ],
    publisher: "IEEE Xplore",
    conference: "2025 International Conference on Sustainable Communication Networks and Application (ICSCN)",
    date: "15-17 October 2025",
    addedDate: "30 December 2025",
    doi: "10.1109/ICSCN67106.2025.11308390",
    abstract: "Over the past few years, with the growing interest in Unmanned Aerial Vehicles (UAVs), the development in the unmanned system has been a key technology for military and security uses. The system can perform different missions as it will assist in the monitoring in unfamiliar territories, forest conservation, spying enemy territory. Application which is designed in this research has an aim to mimic condition in war zone as a spy for enemy. After following the latest trends towards UAV creative design a light and small size UAV quad copter system was designed, assembled and tested in flight. A low cost design is targeted and make it competitive with other higher costs. Future improvements could include enhanced AI-driven automation, improved stealth capabilities, and longer battery life to further enhance mission efficiency.",
    objective: "To develop a smart Unmanned Aerial Vehicle (UAV) for military surveillance, reconnaissance, and threat detection, integrating cloud-based data processing, autonomous navigation, and secure communication systems.",
    results: [
      { parameter: "Detection Accuracy", base: "85%", proposed: "92%", improvement: "+7%" },
      { parameter: "Data Tx Speed", base: "2.0 MBps", proposed: "3.5 MBps", improvement: "+75%" },
      { parameter: "Response Latency", base: "1.2 sec", proposed: "0.8 sec", improvement: "-33%" },
      { parameter: "Operational Range", base: "500 m", proposed: "750 m", improvement: "+50%" },
      { parameter: "Battery Runtime", base: "2 hours", proposed: "3 hours", improvement: "+50%" },
      { parameter: "Tracking Efficiency", base: "78%", proposed: "88%", improvement: "+10%" }
    ]
  };

  // UAV live diagnostic logs state
  const [logs, setLogs] = useState<string[]>([
    "[SYS] UAV SURVEILLANCE CONSOLE ACTIVE",
    "[GPS] SAT LINK LOCKED // PROXIMITY ENGAGED",
    "[COM] PORT 8883 SECURE MQTT TUNNEL OPEN",
    "[NAV] IMU CALIBRATION STABLE // COMPASS MATCH",
    "[UAV] 360° SENSOR NODE STREAMING DIAGNOSTICS"
  ]);

  // Cycle diagnostic logs to simulate live feed
  useEffect(() => {
    const diagnosticPool = [
      "[SYS] UAV SECURE SATELLITE LINK ESTABLISHED",
      "[GPS] LOCKING COORDINATES: TARGET ACQUIRED",
      "[COM] PORT 8883 MQTT SSL ESTABLISHED",
      "[NAV] IMU GYROSCOPE DRIFT CALIBRATED",
      "[PWR] BATTERY DRAIN NORMAL (14.2V, 3.4A)",
      "[SEN] 360° LIDAR SENSOR RADIAL SWEEP ACTIVE",
      "[SURV] TARGET LOCK TRACKING ANGLE COMPENSATED",
      "[MEM] TELEMETRY BUFFER FLUSHED (0% PACKET LOSS)",
      "[IMG] THERMAL INFRARED CAMERA STABILIZED",
      "[ALRT] MOTION DETECTED IN PROXIMITY ZONE 3",
      "[SYS] COMPILING TELEMETRY DATA STREAM",
      "[COM] RF SIGNAL STRENGTH: 98% (EXCELLENT)",
      "[PWR] SOLAR ARRAY PANELS UNFOLDED // CHARGING",
      "[SEN] RADAR SWEEP RESOLVED 0 STATIC TARGETS"
    ];

    const interval = setInterval(() => {
      const randomLog = diagnosticPool[Math.floor(Math.random() * diagnosticPool.length)];
      setLogs((prev) => [...prev.slice(1), randomLog]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // --- Interactive Target Crosshair Tracking and Drone Tilting ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snappy custom crosshair tracking
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.1,
        ease: "power2.out",
      });
    }

    // Intersecting target lines tracking
    if (lineHRef.current) {
      gsap.to(lineHRef.current, {
        y,
        duration: 0.05,
        ease: "power1.out",
      });
    }
    if (lineVRef.current) {
      gsap.to(lineVRef.current, {
        x,
        duration: 0.05,
        ease: "power1.out",
      });
    }

    // Direct DOM injection of coordinates for best rendering performance (no React re-renders)
    if (coordsBoxRef.current) {
      const lat = (12.9716 + y / 15000).toFixed(4);
      const lon = (77.5946 + x / 15000).toFixed(4);
      const rng = Math.round(Math.sqrt(Math.pow(x - rect.width / 2, 2) + Math.pow(y - rect.height / 2, 2)));
      coordsBoxRef.current.innerHTML = `
        <div>LAT: ${lat}° N</div>
        <div>LON: ${lon}° E</div>
        <div>RNG: ${rng}m</div>
      `;
    }

    // 3D Tilting of quadcopter wireframe based on mouse position relative to panel
    if (droneContainerRef.current && droneRef.current) {
      const droneRect = droneContainerRef.current.getBoundingClientRect();
      const droneCenterX = droneRect.left + droneRect.width / 2;
      const droneCenterY = droneRect.top + droneRect.height / 2;

      const dx = e.clientX - droneCenterX;
      const dy = e.clientY - droneCenterY;

      const maxTilt = 22;
      const rx = Math.max(-maxTilt, Math.min(maxTilt, -dy / 7));
      const ry = Math.max(-maxTilt, Math.min(maxTilt, dx / 7));

      gsap.to(droneRef.current, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <section
      id="research"
      ref={sectionRef}
      className={`relative w-full overflow-y-auto lg:overflow-hidden bg-[#020202] h-auto lg:h-screen py-16 lg:py-6 flex flex-col justify-between text-white ${
        isHovering ? "cursor-none" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent-primary) 7%, transparent), transparent 70%), #020202",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes spin-rotor {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes hud-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hud-fade-up {
          opacity: 0;
          animation: hud-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .hud-fade-up {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* --- UAV Scanning Grid Background --- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-primary) 1px, transparent 1px)`,
          backgroundSize: "4.5rem 4.5rem",
        }}
      />

      {/* --- Tactical Crosshair Target Lines (Visible on Desktop hover) --- */}
      <div
        ref={lineHRef}
        className={`pointer-events-none absolute left-0 right-0 h-px border-t border-dashed border-accent-primary/15 z-40 transition-opacity duration-300 hidden lg:block ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "0px" }}
      />
      <div
        ref={lineVRef}
        className={`pointer-events-none absolute top-0 bottom-0 w-px border-l border-dashed border-accent-primary/15 z-40 transition-opacity duration-300 hidden lg:block ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: "0px" }}
      />

      {/* --- Custom HUD Viewfinder Brackets --- */}
      <div className="hud-fade-up [animation-delay:150ms] absolute left-6 top-6 h-8 w-8 border-l border-t border-accent-primary/30 pointer-events-none" />
      <div className="hud-fade-up [animation-delay:150ms] absolute right-6 top-6 h-8 w-8 border-r border-t border-accent-primary/30 pointer-events-none" />
      <div className="hud-fade-up [animation-delay:150ms] absolute left-6 bottom-6 h-8 w-8 border-l border-b border-accent-primary/30 pointer-events-none" />
      <div className="hud-fade-up [animation-delay:150ms] absolute right-6 bottom-6 h-8 w-8 border-r border-b border-accent-primary/30 pointer-events-none" />

      {/* --- Custom Targeting Crosshair & Telemetry Box (Desktop hover) --- */}
      <div
        ref={cursorRef}
        className={`pointer-events-none absolute left-0 top-0 z-50 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden lg:block ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-full border border-accent-primary opacity-25" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary" />
        <div className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-accent-primary" />
        <div className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-accent-primary" />
        <div className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-accent-primary" />
        <div className="absolute right-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-accent-primary" />
        <Crosshair className="absolute -bottom-5 -right-5 h-3.5 w-3.5 text-accent-primary opacity-40" />

        {/* Live Coordinate telemetry stats */}
        <div
          ref={coordsBoxRef}
          className="absolute font-mono text-[9px] text-accent-primary-light space-y-0.5 bg-black/75 backdrop-blur-md p-2 border border-accent-primary/20 rounded pointer-events-none z-50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-28.75"
          style={{ left: "20px", top: "20px" }}
        >
          <div>LAT: 12.9716° N</div>
          <div>LON: 77.5946° E</div>
          <div>RNG: 0m</div>
        </div>
      </div>

      {/* --- Top HUD Status Bar --- */}
      <header className="hud-fade-up [animation-delay:100ms] relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        {/* Left Side: Chapter Dossier */}
        <div className="border-l-2 border-accent-primary pl-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
            07 // FRONTIER
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
            RESEARCH & INVESTIGATIONS
          </h2>
        </div>

        {/* Right Side: UAV Camera Feeds Indicators */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-red-500">LIVE FEED // REC</span>
          </div>
          <div className="flex flex-col items-end border-l border-white/10 pl-6 font-mono text-[10px] text-accent-primary/80">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span>UAV-360-SYS</span>
              <Radio className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 tracking-wider opacity-60">
              <span>BAT 94%</span>
              <Battery className="h-3 w-3" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Center Interactive Console Area --- */}
      <div className="relative z-30 flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center my-6 overflow-visible">
        
        {/* LEFT COLUMN: UAV Telemetry Panel */}
        <div className="hud-fade-up [animation-delay:200ms] flex flex-col items-center justify-center h-auto lg:h-full w-full bg-white/1 border border-white/5 rounded-xl p-6 relative overflow-hidden group/panel hover:border-accent-primary/10 transition-colors duration-500 z-20">
          <div className="absolute top-3 left-4 font-mono text-[9px] text-white/35 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="h-3 w-3 text-accent-primary" />
            SURVEILLANCE RADAR MODULE
          </div>
          
          {/* Concentric Radar dial with 3D tilting UAV wireframe inside */}
          <div 
            ref={droneContainerRef}
            className="relative h-62.5 w-62.5 flex items-center justify-center mt-6"
            style={{ perspective: "600px" }}
          >
            {/* Compass / Outer Radar ring */}
            <div className="absolute inset-0 rounded-full border border-accent-primary/15 border-dashed scale-100" />
            <div className="absolute inset-4 rounded-full border border-accent-primary/10 scale-95" />
            <div className="absolute inset-12 rounded-full border border-accent-primary/5 border-dashed scale-75" />
            
            {/* Spinning Radar sweep */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{
                background: "conic-gradient(from 0deg, var(--accent-primary-glow) 0deg, transparent 75deg, transparent 360deg)",
                animation: "radar-sweep 5s linear infinite"
              }}
            />
            
            {/* Radar Coordinates crosshair */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/3" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/3" />

            {/* Mock Targets */}
            <div className="absolute w-2 h-2 rounded-full bg-red-500/80 animate-pulse" style={{ top: "35%", left: "68%" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-red-400/50 animate-pulse" style={{ top: "70%", left: "22%", animationDelay: "0.8s" }} />

            {/* 3D-tilting SVG Drone Wireframe */}
            <svg 
              ref={droneRef}
              viewBox="0 0 200 200" 
              className="relative w-44 h-44 z-10 transition-transform duration-300 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Camera sweep laser effect */}
              <circle cx="100" cy="100" r="32" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" className="animate-pulse" opacity="0.3" />
              
              {/* Drone Frame Arms */}
              <line x1="88" y1="88" x2="60" y2="60" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
              <line x1="112" y1="88" x2="140" y2="60" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
              <line x1="88" y1="112" x2="60" y2="140" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
              <line x1="112" y1="112" x2="140" y2="140" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />

              {/* Rotor Guards */}
              <circle cx="60" cy="60" r="22" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="140" cy="60" r="22" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="60" cy="140" r="22" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="140" cy="140" r="22" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

              {/* Spinning Rotors */}
              <ellipse cx="60" cy="60" rx="20" ry="2" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" style={{ transformOrigin: "60px 60px", animation: "spin-rotor 0.3s linear infinite" }} />
              <ellipse cx="140" cy="60" rx="20" ry="2" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" style={{ transformOrigin: "140px 60px", animation: "spin-rotor 0.25s linear infinite" }} />
              <ellipse cx="60" cy="140" rx="20" ry="2" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" style={{ transformOrigin: "60px 140px", animation: "spin-rotor 0.28s linear infinite" }} />
              <ellipse cx="140" cy="140" rx="20" ry="2" fill="none" stroke="var(--accent-primary)" strokeWidth="1.2" style={{ transformOrigin: "140px 140px", animation: "spin-rotor 0.32s linear infinite" }} />

              {/* Central Quadcopter Chassis */}
              <circle cx="100" cy="100" r="16" fill="#020202" stroke="var(--accent-primary)" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="12" fill="none" stroke="var(--accent-primary)" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="100" cy="100" r="4.5" fill="var(--accent-primary)" className="animate-ping" />
              <circle cx="100" cy="100" r="3" fill="var(--accent-primary)" />
            </svg>
          </div>

          {/* Scrolling Terminal Diagnostic Logs */}
          <div className="w-full mt-6 bg-black/60 border border-white/5 rounded-lg p-4 font-mono text-[9px] text-white/50 space-y-1.5">
            <div className="flex justify-between border-b border-white/5 pb-1 mb-2 text-white/35 font-bold">
              <span>SYSTEM DIAGNOSTICS STREAM</span>
              <span className="text-accent-primary-light">ACTIVE</span>
            </div>
            <div className="h-23.75 overflow-hidden flex flex-col justify-end space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={`truncate transition-all duration-300 ${index === logs.length - 1 ? "text-accent-primary-light font-bold pl-1 border-l border-accent-primary" : "opacity-60"}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Classified Dossier Card */}
        <article className="hud-fade-up [animation-delay:300ms] relative flex flex-col justify-between border border-accent-primary/15 bg-[#0a0a0c]/85 p-6 md:p-8 rounded-xl h-auto lg:h-full w-full shadow-[0_0_40px_var(--accent-primary-glow)] transition-all duration-300 hover:border-accent-primary/30 z-20 overflow-hidden">
          {/* Holographic scanning horizontal line overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-accent-primary/30 to-transparent animate-[pulse_2s_infinite]" />

          {/* Dossier Corner bracket highlights */}
          <div className="absolute left-4 top-4 h-3.5 w-3.5 border-l border-t border-accent-primary/40 pointer-events-none" />
          <div className="absolute right-4 top-4 h-3.5 w-3.5 border-r border-t border-accent-primary/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 h-3.5 w-3.5 border-l border-b border-accent-primary/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 h-3.5 w-3.5 border-r border-b border-accent-primary/40 pointer-events-none" />

          {/* Card Top: Security dossiers badge */}
          <div className="flex justify-between items-center mb-4">
            <div className="inline-flex items-center gap-2 border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 text-[9px] font-mono tracking-widest text-accent-primary-light uppercase">
              <Shield className="h-3 w-3" />
              CONFIDENTIAL // LEVEL 3 SECURE
            </div>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              Dossier ID: #UAV-360-113
            </span>
          </div>

          {/* Terminal Tabs bar */}
          <div className="flex gap-1.5 border-b border-white/5 pb-3 mb-4 font-mono text-[10px] tracking-wider z-20">
            {["[01 // INTEL]", "[02 // SUMMARY]", "[03 // STACK]"].map((label, index) => {
              const isActive = index === activeTab;
              return (
                <button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  className={`px-3 py-1.5 border transition-all duration-300 rounded-sm cursor-pointer ${
                    isActive
                      ? "bg-accent-primary/10 border-accent-primary/45 text-accent-primary-light shadow-[0_0_15px_var(--accent-primary-glow)]"
                      : "border-white/5 hover:border-white/15 text-white/50 hover:text-white/80"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Viewport with scrollbar custom styling */}
          <div className="flex-1 overflow-y-auto pr-2 relative z-10 flex flex-col justify-start max-h-65 lg:max-h-77.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {activeTab === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-primary-light/60 text-[9px] font-mono uppercase tracking-[0.2em]">
                  <BookOpen className="h-3.5 w-3.5 text-accent-primary" />
                  <span>Classified Publication Dossier // {paperDetails.date}</span>
                </div>
                
                <h3 className="text-md sm:text-lg font-black uppercase leading-[1.2] tracking-tight text-white">
                  <TextScrambler text={paperDetails.title} duration={35} />
                </h3>
                
                {/* Author Credentials */}
                <div className="border-t border-b border-white/5 py-3 mt-3">
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Users className="h-3 w-3 text-accent-primary" />
                    Key Investigators
                  </span>
                  <div className="space-y-1 pl-4 border-l border-white/5">
                    {paperDetails.authors.map((author, index) => (
                      <p key={index} className="text-[10px] font-mono text-white/70 tracking-wide truncate">
                        {author}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 mt-3">
                  <div className="border-l border-accent-primary/20 pl-4">
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider block">PUBLISHER PLATFORM</span>
                    <span className="text-[10px] font-mono text-white/80 block mt-1 tracking-wide">
                      <TextScrambler text={paperDetails.publisher} duration={20} />
                    </span>
                  </div>
                  <div className="border-l border-accent-primary/20 pl-4">
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider block">UAV SYSTEM INDEX</span>
                    <span className="text-[10px] font-mono text-white/80 block mt-1 tracking-wide">
                      DOI: {paperDetails.doi}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-4 font-mono">
                {/* Objective Block */}
                <div className="border-l-2 border-accent-primary bg-accent-primary/5 p-3 rounded-r-md">
                  <span className="text-[9px] text-accent-primary-light font-bold uppercase tracking-widest block mb-1">
                    [MISSION OBJECTIVE]
                  </span>
                  <p className="text-[10px] font-sans text-white/80 leading-relaxed">
                    {paperDetails.objective}
                  </p>
                </div>

                {/* Abstract Block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-primary-light/60 text-[9px] uppercase tracking-widest border-b border-white/5 pb-1">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>[ABSTRACT DIAGNOSTICS DETECTED]</span>
                  </div>
                  <p className="text-[10px] sm:text-xs leading-relaxed text-white/60 font-sans tracking-wide">
                    <TextScrambler text={paperDetails.abstract} duration={40} speed={2} />
                  </p>
                </div>

                {/* Symmetrical Results Table */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-accent-primary-light/60 text-[9px] uppercase tracking-widest border-b border-white/5 pb-1">
                    <Award className="h-3.5 w-3.5 text-accent-primary" />
                    <span>[PERFORMANCE COMPARISON VS BASE LINE]</span>
                  </div>
                  <div className="border border-white/5 rounded-md overflow-hidden bg-black/30 text-[10px] font-mono">
                    <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] bg-white/2 border-b border-white/5 p-2 text-white/40 font-bold uppercase tracking-wider">
                      <div>Parameter</div>
                      <div className="text-center">Base</div>
                      <div className="text-center">Proposed</div>
                      <div className="text-right">Gain</div>
                    </div>
                    {paperDetails.results.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-[1.8fr_1fr_1fr_1fr] p-2 border-b border-white/3 last:border-b-0 hover:bg-white/1">
                        <div className="text-white/70 truncate">{row.parameter}</div>
                        <div className="text-center text-white/50">{row.base}</div>
                        <div className="text-center text-white/90 font-bold">{row.proposed}</div>
                        <div className={`text-right font-bold ${row.improvement.startsWith("+") ? "text-emerald-400" : "text-amber-400"}`}>
                          {row.improvement}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 font-mono text-[10px] text-white/75">
                <div className="flex items-center gap-2 text-accent-primary-light/60 text-[9px] uppercase tracking-widest border-b border-white/5 pb-1">
                  <Cpu className="h-3.5 w-3.5 text-accent-primary" />
                  <span>[SURVEILLANCE NODE SYSTEM ARCHITECTURE]</span>
                </div>
                
                {/* Physical hardware breakdown */}
                <div className="space-y-2.5">
                  <div className="border-l border-accent-primary/20 pl-4 py-1">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider block">Controller Hardware</span>
                    <span className="text-[10px] text-accent-primary-light font-bold block mt-0.5">ESP32 Dual-Core (RTOS) microchip client</span>
                  </div>
                  <div className="border-l border-accent-primary/20 pl-4 py-1">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider block">Imaging Payload</span>
                    <span className="text-[10px] text-white/90 block mt-0.5">360° Panoramic camera dome, FLIR Thermal Infrared, LiDAR Rangefinder</span>
                  </div>
                  <div className="border-l border-accent-primary/20 pl-4 py-1">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider block">Edge AI Intelligence</span>
                    <span className="text-[10px] text-white/90 block mt-0.5">Onboard computer vision models for threat identification (intruders, fire detection)</span>
                  </div>
                  <div className="border-l border-accent-primary/20 pl-4 py-1">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider block">Communication Uplink</span>
                    <span className="text-[10px] text-white/90 block mt-0.5">Hybrid RF, Wi-Fi, and 5G network channels; telemetry via MQTT over Secure SSL Tunnel</span>
                  </div>
                  <div className="border-l border-accent-primary/20 pl-4 py-1">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider block">Data Protection Encryption</span>
                    <span className="text-red-400 font-bold block mt-0.5">AES-256 encrypted telemetry payloads to prevent interception</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secure link trigger button */}
          {paperDetails.doi && (
            <div className="relative z-10 mt-4 pt-4 border-t border-white/5">
              <a
                href={`https://ieeexplore.ieee.org/document/${paperDetails.doi.split(".").pop()}`}
                target="_blank"
                rel="noreferrer"
                className="group/btn relative w-full overflow-hidden border border-accent-primary bg-accent-primary/10 px-6 py-3 transition-all flex items-center justify-center hover:bg-accent-primary hover:shadow-[0_0_20px_var(--accent-primary)] rounded-md"
              >
                <span className="relative z-10 flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-accent-primary transition-colors group-hover/btn:text-black">
                  Establish Secure Link <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </div>
          )}
        </article>
      </div>

      {/* --- Bottom HUD Status Bar --- */}
      <footer className="hud-fade-up [animation-delay:400ms] relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-4 gap-2 font-mono text-[9px] text-accent-primary/50 tracking-wider">
        <div>
          <span>LOC: 12.9716° N, 77.5946° E</span>
          <span className="mx-3 opacity-30">|</span>
          <span>ALT: 400FT / SPD: 15KNOTS</span>
        </div>
        <div className="flex items-center gap-2 text-accent-primary-light">
          <Lock className="h-3 w-3 text-red-500 animate-pulse" />
          <span className="font-bold">TARGET LOCK SECURE SYSTEM LINK ENGAGED</span>
        </div>
      </footer>
    </section>
  );
}
