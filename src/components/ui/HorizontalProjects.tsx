"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import {
  Satellite,
  ShieldCheck,
  Activity,
  ExternalLink,
  Leaf
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project, projects } from "@/data/projects";
import { gsap, setupGsap } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";
import { sound } from "@/lib/sound";
import { useModeStore } from "@/lib/store";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
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

const dossierPalettes = [
  {
    primary: "#fcd34d", // Orbital Gold
    secondary: "#b2ff05", // Bioluminescent Green
    glow: "rgba(252, 211, 77, 0.16)",
    field: "rgba(252, 211, 77, 0.06)",
  },
  {
    primary: "#00f2fe", // Deep Azure
    secondary: "#4facfe", 
    glow: "rgba(0, 242, 254, 0.16)",
    field: "rgba(0, 242, 254, 0.05)",
  },
  {
    primary: "#ff4560", // Sleep Rose
    secondary: "#8e2de2", 
    glow: "rgba(255, 69, 96, 0.18)",
    field: "rgba(255, 69, 96, 0.05)",
  },
  {
    primary: "#00f5a0", // Eco Mint
    secondary: "#00b4d8", // Water Teal
    glow: "rgba(0, 245, 160, 0.18)",
    field: "rgba(0, 245, 160, 0.05)",
  },
] as const;
 
const projectDossiers = [
  {
    codename: "Orbital Intelligence Platform",
    signal: "Live Telemetry & ML Engine",
    metric: "99.9%",
    metricLabel: "API UPTIME",
    Icon: Satellite,
  },
  {
    codename: "Encrypted WebRTC Channel",
    signal: "Offline-first resilience queue",
    metric: "E2EE",
    metricLabel: "ENCRYPTION READY",
    Icon: ShieldCheck,
  },
  {
    codename: "WebGL Anxiety Narrative",
    signal: "Scroll-bound shader curves",
    metric: "60 FPS",
    metricLabel: "RENDER TARGET",
    Icon: Activity,
  },
  {
    codename: "AI Carbon Engine Platform",
    signal: "Cascading LLM & Offline Heuristics",
    metric: "6-STAGE",
    metricLabel: "CASCADE FALLBACK",
    Icon: Leaf,
  },
] as const;

function MagneticButton({ children, href, primaryColor }: { children: React.ReactNode; href: string; primaryColor: string }) {
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

  const handleClick = () => {
    sound.playClick();
  };

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="magnetic-btn relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-black/40 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-all hover:bg-white/5 cursor-pointer"
      style={{ boxShadow: `0 0 15px color-mix(in srgb, ${primaryColor} 15%, transparent)` }}
    >
      {children}
    </a>
  );
}

function InteractiveVisualizer({
  slug,
  palette,
  isActive,
}: {
  slug: string;
  palette: typeof dossierPalettes[number];
  isActive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive || !isVisible) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // --- Visualizer-specific state ---
    interface SpectraveinParticle {
      radius: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
      orbitTilt: number;
      angleOffset: number;
    }
    interface SecureChatParticle {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      size: number;
    }
    interface DecodeSomniaParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
    }
    interface AuraParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      alpha: number;
    }
    type VisualizerParticle = SpectraveinParticle | SecureChatParticle | DecodeSomniaParticle | AuraParticle;
    const particles: VisualizerParticle[] = [];
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    
    if (slug === "spectravein") {
      for (let i = 0; i < 35; i++) {
        particles.push({
          radius: 50 + Math.random() * 110,
          angle: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.009,
          size: 1 + Math.random() * 1.5,
          color: Math.random() > 0.4 ? palette.primary : palette.secondary,
          orbitTilt: -0.35 + Math.random() * 0.7,
          angleOffset: Math.random() * Math.PI,
        } as SpectraveinParticle);
      }
    } else if (slug === "securechat") {
      // Net nodes
      for (let i = 0; i < 12; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: -0.3 + Math.random() * 0.6,
          vy: -0.3 + Math.random() * 0.6,
        });
      }
      // Binary falling streams
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 1 + Math.random() * 2.5,
          chars: Array.from({ length: 6 }, () => Math.random() > 0.5 ? "1" : "0"),
          size: 9 + Math.random() * 5,
        } as SecureChatParticle);
      }
    } else if (slug === "decode-somnia") {
      // Floating dream bubbles (more particles, slightly larger, higher visibility)
      for (let i = 0; i < 28; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 40,
          radius: 4 + Math.random() * 16,
          speedY: 0.15 + Math.random() * 0.55,
          speedX: -0.12 + Math.random() * 0.24,
          alpha: 0.5 + Math.random() * 0.45,
        } as DecodeSomniaParticle);
      }
    } else if (slug === "aura") {
      // Drifting carbon-bond molecular structures
      for (let i = 0; i < 18; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 5 + Math.random() * 6,
          speedY: -0.15 - Math.random() * 0.45,
          speedX: -0.2 + Math.random() * 0.4,
          orbitRadius: 10 + Math.random() * 12,
          orbitSpeed: 0.02 + Math.random() * 0.04,
          orbitAngle: Math.random() * Math.PI * 2,
          alpha: 0.4 + Math.random() * 0.5,
        } as AuraParticle);
      }
    }

    let frame = 0;
    const render = () => {
      if (!isActive) return;

      frame++;
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      if (slug === "spectravein") {
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = palette.primary;
        
        const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 35);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.3, palette.primary);
        grad.addColorStop(1, "transparent");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        (particles as SpectraveinParticle[]).forEach((p) => {
          p.angle += p.speed;
          
          let dx = 0;
          let dy = 0;
          if (mouseRef.current.active) {
            const mDistX = mouseRef.current.x - centerX;
            const mDistY = mouseRef.current.y - centerY;
            dx = mDistX * 0.12;
            dy = mDistY * 0.12;
          }

          // Project coordinates in rotated 3D orbit
          const rx = Math.cos(p.angle) * p.radius;
          const ry = Math.sin(p.angle) * p.radius * p.orbitTilt;
          
          const x = centerX + rx * Math.cos(p.angleOffset) - ry * Math.sin(p.angleOffset) + dx;
          const y = centerY + rx * Math.sin(p.angleOffset) + ry * Math.cos(p.angleOffset) + dy;
          
          // Draw inclined orbit path line (subtle)
          ctx.beginPath();
          ctx.ellipse(centerX + dx, centerY + dy, p.radius, p.radius * Math.abs(p.orbitTilt), p.angleOffset, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw orbital dust
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Trail
          ctx.beginPath();
          ctx.arc(x - Math.cos(p.angle) * 3, y - Math.sin(p.angle) * 3 * p.orbitTilt, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `color-mix(in srgb, ${p.color} 40%, transparent)`;
          ctx.fill();
        });

        // Overlay Telemetry
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText(`ORBITAL_PLANE: Inclined ${Math.round(((particles[0] as SpectraveinParticle) || {}).orbitTilt * 90)}deg`, 24, 28);
        ctx.fillText(`TELEMETRY_SYNC: 100%`, 24, 40);
        ctx.fillText(`NEO_COUNT: ${particles.length}`, 24, 52);
        
      } else if (slug === "securechat") {
        // Draw grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const grid = 45;
        for (let x = 0; x < width; x += grid) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += grid) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Update and draw network nodes
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `color-mix(in srgb, ${palette.primary} 40%, transparent)`;
          ctx.fill();
        });

        // Connection lines between nodes
        ctx.lineWidth = 1;
        nodes.forEach((n1, i) => {
          nodes.forEach((n2, j) => {
            if (i >= j) return;
            const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            if (dist < 130) {
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              let alpha = (1 - dist / 130) * 0.15;
              if (mouseRef.current.active) {
                const mDist = Math.hypot((n1.x + n2.x)/2 - mouseRef.current.x, (n1.y + n2.y)/2 - mouseRef.current.y);
                if (mDist < 90) alpha += (1 - mDist/90) * 0.3;
              }
              ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} ${alpha * 100}%, transparent)`;
              ctx.stroke();
            }
          });
        });

        // Binary code streams
        (particles as SecureChatParticle[]).forEach((p) => {
          p.y += p.speed;
          if (p.y > height + 15) {
            p.y = -15;
            p.x = Math.random() * width;
          }

          let hovered = false;
          if (mouseRef.current.active) {
            const dist = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
            if (dist < 80) {
              hovered = true;
              p.x += (mouseRef.current.x - p.x) * 0.03;
            }
          }

          ctx.font = `${p.size}px monospace`;
          p.chars.forEach((c: string, idx: number) => {
            const charY = p.y - idx * p.size;
            const alpha = Math.max(0, 1 - idx * 0.15);
            ctx.fillStyle = hovered 
               ? `rgba(255, 255, 255, ${alpha})`
              : `color-mix(in srgb, ${palette.primary} ${alpha * 70}%, transparent)`;
            
            if (frame % 25 === 0 && Math.random() > 0.8) {
              p.chars[idx] = Math.random() > 0.5 ? "1" : "0";
            }
            ctx.fillText(c, p.x, charY);
          });
        });

        // Overlay Telemetry
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText(`RTC_PEERS: Connected`, 24, 28);
        ctx.fillText(`TUNNEL_SECURE: E2EE AES-GCM`, 24, 40);

      } else if (slug === "decode-somnia") {
        // Floating dream bokeh particles
        (particles as DecodeSomniaParticle[]).forEach((p) => {
          p.y -= p.speedY;
          p.x += p.speedX;

          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }

          if (mouseRef.current.active) {
            const dist = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
            if (dist < 100) {
              const angle = Math.atan2(p.y - mouseRef.current.y, p.x - mouseRef.current.x);
              const force = (100 - dist) * 0.04;
              p.x += Math.cos(angle) * force;
              p.y += Math.sin(angle) * force;
            }
          }

          // Glowing bubble body gradient
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, "#ffffff"); // White-hot center
          grad.addColorStop(0.2, `color-mix(in srgb, ${palette.primary} 90%, #ffffff)`);
          grad.addColorStop(0.75, `color-mix(in srgb, ${palette.primary} ${p.alpha * 70}%, transparent)`);
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Bubble stroke outline for crisp glass-like definition and glowing halo
          ctx.save();
          ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} ${p.alpha * 85}%, transparent)`;
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 6;
          ctx.shadowColor = palette.primary;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.95, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

        // Draw secondary wave (fainter, phase-shifted, using secondary purple accent)
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = palette.secondary;
        ctx.strokeStyle = `color-mix(in srgb, ${palette.secondary} 60%, transparent)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          let yOffset = 0;
          if (mouseRef.current.active) {
            const dist = Math.abs(x - mouseRef.current.x);
            if (dist < 120) {
              yOffset = Math.sin((x - mouseRef.current.x) * 0.03 - frame * 0.06) * (120 - dist) * 0.15;
            }
          }
          const y = height * 0.7 + Math.sin(x * 0.018 - frame * 0.02) * 12 + yOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Draw primary wave (Sleep Rose accent) with triple-layer neon glow
        const getWaveY = (x: number) => {
          let yOffset = 0;
          if (mouseRef.current.active) {
            const dist = Math.abs(x - mouseRef.current.x);
            if (dist < 140) {
              yOffset = Math.sin((x - mouseRef.current.x) * 0.04 - frame * 0.08) * (140 - dist) * 0.22;
            }
          }
          return height * 0.65 + Math.sin(x * 0.012 + frame * 0.015) * 16 + yOffset;
        };

        // Layer 1: Broad Outer Glow
        ctx.save();
        ctx.shadowBlur = 25;
        ctx.shadowColor = palette.primary;
        ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} 40%, transparent)`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = getWaveY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Layer 2: Medium Glow
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = palette.primary;
        ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} 85%, transparent)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = getWaveY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Layer 3: High-Intensity White-Hot Core
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} 35%, #ffffff)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = getWaveY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Overlay Telemetry
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText(`SOMNIA_FREQ: 8.5 Hz`, 24, 28);
        ctx.fillText(`ANXIETY_VECTORS: Calming`, 24, 40);

      } else if (slug === "aura") {
        // Draw eco-grid lines
        ctx.strokeStyle = "rgba(0, 245, 160, 0.02)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const grid = 50;
        for (let x = 0; x < width; x += grid) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += grid) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Drifting carbon molecules
        (particles as AuraParticle[]).forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.orbitAngle += p.orbitSpeed;

          // Wrap boundaries
          if (p.y < -30) {
            p.y = height + 30;
            p.x = Math.random() * width;
          }
          if (p.x < -30 || p.x > width + 30) {
            p.x = Math.random() * width;
          }

          if (mouseRef.current.active) {
            const dist = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
            if (dist < 110) {
              const angle = Math.atan2(p.y - mouseRef.current.y, p.x - mouseRef.current.x);
              const force = (110 - dist) * 0.05;
              p.x += Math.cos(angle) * force;
              p.y += Math.sin(angle) * force;
            }
          }

          // Draw bonds to neighboring molecules
          (particles as AuraParticle[]).forEach((p2) => {
            if (p === p2) return;
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} ${(1 - dist / 85) * 15}%, transparent)`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          });

          // Draw main carbon nucleus (glowing green/mint sphere)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.3, `color-mix(in srgb, ${palette.primary} 90%, #ffffff)`);
          grad.addColorStop(0.8, `color-mix(in srgb, ${palette.primary} ${p.alpha * 45}%, transparent)`);
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Draw outer ring
          ctx.save();
          ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} ${p.alpha * 65}%, transparent)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.orbitRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Draw orbiting hydrogen/oxygen nodes (1 to 2 small nodes)
          const orbitX1 = p.x + Math.cos(p.orbitAngle) * p.orbitRadius;
          const orbitY1 = p.y + Math.sin(p.orbitAngle) * p.orbitRadius;
          ctx.fillStyle = palette.secondary;
          ctx.shadowBlur = 4;
          ctx.shadowColor = palette.secondary;
          ctx.beginPath();
          ctx.arc(orbitX1, orbitY1, 2, 0, Math.PI * 2);
          ctx.fill();

          const orbitX2 = p.x + Math.cos(p.orbitAngle + Math.PI) * p.orbitRadius;
          const orbitY2 = p.y + Math.sin(p.orbitAngle + Math.PI) * p.orbitRadius;
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#ffffff";
          ctx.beginPath();
          ctx.arc(orbitX2, orbitY2, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw an aura pulse ring around the mouse if active
        if (mouseRef.current.active) {
          ctx.save();
          const pulseRadius = (frame % 90) * 1.5;
          const pulseAlpha = Math.max(0, 1 - pulseRadius / 135);
          ctx.strokeStyle = `color-mix(in srgb, ${palette.primary} ${pulseAlpha * 35}%, transparent)`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = palette.primary;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, pulseRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Overlay Telemetry
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText(`GHG_METRICS: Calibrated`, 24, 28);
        ctx.fillText(`CASCADING_PARSER: Active`, 24, 40);
        ctx.fillText(`TARGET_THRESHOLD: 5.2 kg`, 24, 52);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [slug, palette, isActive, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
}

function InteractiveVisualizerCard({
  project,
  palette,
  isActive,
}: {
  project: Project;
  palette: typeof dossierPalettes[number];
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !cursorRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.2,
      ease: "power2.out"
    });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;
    
    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseEnter = () => {
    sound.playStaticHover();
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !cursorRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
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
      className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl cursor-none w-full h-full bg-[#050507]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div 
        ref={cursorRef} 
        className="pointer-events-none absolute left-0 top-0 z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-[9px] font-bold tracking-[0.2em] text-white backdrop-blur-sm opacity-0 scale-50 transition-colors border border-white/20"
        style={{ boxShadow: `0 0 30px ${palette.glow}` }}
      >
        INTERACT
      </div>
      
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
      
      <InteractiveVisualizer slug={project.slug} palette={palette} isActive={isActive} />
    </div>
  );
}

function ProjectDossierCard({
  project,
  index,
  isActive,
}: {
  project: Project;
  index: number;
  isActive: boolean;
}) {
  const palette = dossierPalettes[index % dossierPalettes.length];
  const dossier = projectDossiers[index % projectDossiers.length];
  const Icon = dossier.Icon;

  return (
    <article
      data-project-card-depth
      className="absolute inset-0 flex items-center justify-center px-6 py-10"
      style={{
        background: `radial-gradient(circle at 75% 35%, ${palette.field}, transparent 45%), radial-gradient(circle at 20% 75%, color-mix(in srgb, ${palette.glow} 25%, transparent), transparent 45%), #050508`,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div
        className="pointer-events-none absolute right-[-15vw] top-1/2 aspect-square w-[42vw] -translate-y-1/2 rounded-full opacity-20 blur-[140px]"
        style={{ background: palette.primary }}
      />
      <span
        className="absolute left-0 top-0 h-full w-px"
        style={{ background: palette.primary, boxShadow: `0 0 25px ${palette.primary}` }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-325 flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20">
        
        {/* Left Info Column */}
        <div className="flex flex-col w-full lg:max-w-[45%]">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/4 transition-all"
              style={{ color: palette.primary, boxShadow: `0 0 10px ${palette.glow}` }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              MISSION 0{index + 1}
            </span>
            <span 
              className="h-px min-w-12 flex-1 bg-[linear-gradient(90deg,var(--accent-primary),transparent)]" 
              style={{'--accent-primary': palette.primary} as React.CSSProperties} 
            />
          </div>

          <p
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: palette.primary }}
          >
            {dossier.codename}
          </p>

          <h2
            className="mt-3 text-[clamp(2.5rem,4.5vw,5rem)] font-black uppercase leading-[0.88] text-white tracking-tighter"
            style={{ textShadow: `0 15px 45px color-mix(in srgb, ${palette.primary} 25%, transparent)` }}
          >
            {project.title}
          </h2>

          <p className="mt-6 text-sm md:text-base leading-relaxed text-zinc-400 font-light">
            {project.summary}
          </p>

          {/* HUD Info panels */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="hud-panel rounded p-4 bg-white/1 border border-white/5 backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                SIGNAL STREAM
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-zinc-300">{dossier.signal}</p>
            </div>
            <div className="hud-panel rounded p-4 bg-white/1 border border-white/5 backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                IMPACT MEASURED
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-zinc-300">{project.impact}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge
                key={tech}
                className="border-white/5 bg-white/4 px-3 py-1 text-[9px] text-white/60 hover:bg-white/8 transition-colors font-mono"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Buttons & Metrics */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <MagneticButton href={project.repoUrl} primaryColor={palette.primary}>
                  <GithubIcon className="h-4.5 w-4.5" /> Code
                </MagneticButton>
              )}
              {project.siteUrl && (
                <MagneticButton href={project.siteUrl} primaryColor={palette.secondary}>
                  Launch <ExternalLink className="h-4 w-4" style={{ color: palette.secondary }} />
                </MagneticButton>
              )}
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-end gap-2.5">
              <p className="text-3xl font-black leading-none text-white font-mono" style={{ color: palette.primary }}>
                {dossier.metric}
              </p>
              <div className="pb-0.5">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40 leading-none">
                  OUTCOME
                </p>
                <p className="text-[9px] uppercase tracking-widest text-white/50 leading-none mt-1 font-mono">
                  {dossier.metricLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tilt Visualizer Card */}
        <div className="w-full lg:w-[48%] max-w-170 aspect-[1.3] h-auto max-h-120 select-none">
          <InteractiveVisualizerCard project={project} palette={palette} isActive={isActive} />
        </div>
      </div>
    </article>
  );
}

function MobileProjectStack() {
  return (
    <div className="relative px-4 py-20">
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="relative z-10 mb-8 border-l-2 border-accent-primary pl-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
          04 // MISSIONS
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
          SELECTED DEPLOYED SYSTEMS
        </h2>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {projects.map((project, index) => {
          const palette = dossierPalettes[index % dossierPalettes.length];
          const dossier = projectDossiers[index % projectDossiers.length];
          const Icon = dossier.Icon;
          
          return (
            <article 
              key={project.slug} 
              className="rounded-xl border border-white/5 px-5 py-8 bg-black/40 backdrop-blur"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${palette.field}, transparent 40%), #07070a`,
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4.5 w-4.5" style={{ color: palette.primary }} />
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/45">
                  MISSION 0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase text-white tracking-tight">{project.title}</h3>
              <p className="mt-4 text-xs text-white/60 leading-relaxed">{project.summary}</p>
              
              <div className="mt-6 space-y-2">
                <div className="bg-white/2 border border-white/5 rounded p-3 text-[11px]">
                  <span className="font-mono text-[8px] uppercase text-white/30 tracking-wider">Outcome</span>
                  <p className="mt-1 text-white/70 font-semibold">{project.impact}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.stack.map(s => (
                  <Badge key={s} className="bg-white/4 text-white/50 text-[8px] border-white/5 font-mono">{s}</Badge>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 rounded border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 text-white">
                    Code
                  </a>
                )}
                {project.siteUrl && (
                  <a href={project.siteUrl} target="_blank" rel="noreferrer" className="flex-1 text-center py-2.5 rounded border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-black" style={{ backgroundColor: palette.primary }}>
                    Launch
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DesktopDepthProjects() {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prefersReducedMotion = useReducedMotionPreference();

  // Sync index ref
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useGSAP(
    () => {
      const pinSection = pinSectionRef.current;
      const stack = stackRef.current;
      if (!pinSection || !stack || prefersReducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card-depth]", stack);
      if (cards.length === 0) return;

      // Position all cards absolutely stacked on top of each other.
      // Initially, Card 0 is active (scale 1, opacity 1)
      // Cards 1 and 2 start deep in background (scale 0.6, opacity 0, blur, translate Y)
      gsap.set(cards, { transformOrigin: "center center" });
      
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { scale: 1, opacity: 1, zIndex: 10 - i });
        } else {
          gsap.set(card, { scale: 0.6, opacity: 0, yPercent: 40, zIndex: 10 - i });
        }
      });

      // Z-depth timeline animation dynamically calculated for any card length
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          start: "top top",
          end: () => `+=${window.innerHeight * (cards.length - 0.2)}`,
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const segment = 1 / cards.length;
            let currentActive = Math.floor(progress / segment);
            if (currentActive >= cards.length) {
              currentActive = cards.length - 1;
            }

            if (currentActive !== activeIndexRef.current) {
              setActiveIndex(currentActive);
              sound.playBeep(); // Audio feedback when shifting cards!

              // Dynamically update document accent colors
              const palette = dossierPalettes[currentActive % dossierPalettes.length];
              const el = document.documentElement;
              el.style.setProperty("--accent-primary", palette.primary);
              el.style.setProperty("--accent-secondary", palette.secondary);
            }
          }
        }
      });

      // Dynamically sequence zoom-outs and zoom-ins
      for (let i = 0; i < cards.length - 1; i++) {
        const timeOffset = i * 1.2;
        tl.to(cards[i], {
          scale: 2.2,
          opacity: 0,
          yPercent: -20,
          duration: 1,
          ease: "power2.inOut"
        }, timeOffset)
        .to(cards[i + 1], {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2.inOut"
        }, timeOffset + 0.15);
      }

      // Brief settle time at the very end
      tl.to({}, { duration: 0.3 });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: pinSectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={pinSectionRef} className="relative w-full h-screen overflow-hidden bg-[#050508] select-none">
      
      {/* Chapter Indicator Sidebar */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-10 font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
        <div className="[writing-mode:vertical-rl] flex items-center gap-3">
          <span className="w-px h-12 bg-white/10" />
          <p className="text-white/40">CHAPTER 03 // MISSION DOSSIERS</p>
        </div>
        <div className="flex flex-col gap-5 items-center">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                i === activeIndex 
                  ? "border-accent-primary text-accent-primary-light text-[8px] font-bold" 
                  : "border-white/10 text-white/20 text-[8px]"
              }`}
            >
              0{i + 1}
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay Status Bar */}
      <div className="absolute top-24 left-8 right-8 z-30 hidden sm:flex items-center justify-between border-b border-white/5 pb-2 text-[9px] font-mono tracking-widest text-white/30">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
          <span>DIRECT TELEMETRY FEED ACTIVE // TARGET: STACK_LOG_0{activeIndex + 1}</span>
        </div>
        <span>SECTOR: ACTIVE_WORKBENCH</span>
      </div>

      {/* Editorial Section Header */}
      <div className="absolute top-36 left-8 z-30 hidden xl:block border-l-2 border-accent-primary pl-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-accent-primary-light">
          04 // MISSIONS
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white tracking-tight">
          SELECTED DEPLOYED SYSTEMS
        </h2>
      </div>

      {/* Pinned Stack Cards Container */}
      <div ref={stackRef} className="relative w-full h-full">
        {projects.map((project, index) => (
          <ProjectDossierCard
            key={project.slug}
            project={project}
            index={index}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      {/* Segment lines decorative */}
      <div className="absolute bottom-6 left-8 right-8 z-30 hidden sm:flex items-center justify-between text-[9px] font-mono text-white/25">
        <span>MISSION COUNT: 0{projects.length}</span>
        <span>INDEX: 0{activeIndex + 1} {"//"} 0{projects.length}</span>
      </div>
    </div>
  );
}

export function HorizontalProjects() {
  setupGsap();

  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotionPreference();
  const isRecruiterMode = useModeStore((state) => state.isRecruiterMode);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024); // Use 1024px boundary for 3D Z-zoom
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Recruiter mode bypasses cinematic sections
  if (isRecruiterMode) return null;

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden w-full"
    >
      {isMobile || prefersReducedMotion ? <MobileProjectStack /> : <DesktopDepthProjects />}
    </section>
  );
}
