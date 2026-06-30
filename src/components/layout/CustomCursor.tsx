"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial position offscreen
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    // Hover styles
    const onHoverEnter = () => {
      gsap.to(ring, {
        scale: 1.6,
        borderColor: "var(--accent-primary)",
        backgroundColor: "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: "var(--accent-secondary)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onHoverLeave = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.4)",
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: "var(--accent-primary)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const registerHoverEvents = () => {
      const targets = document.querySelectorAll(
        "a, button, [role='button'], [data-cursor='hover'], input, textarea, select"
      );
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverEnter);
        el.removeEventListener("mouseleave", onHoverLeave);
        el.addEventListener("mouseenter", onHoverEnter);
        el.addEventListener("mouseleave", onHoverLeave);
      });
    };

    registerHoverEvents();
    // Re-register elements periodically to capture dynamically rendered components
    const interval = setInterval(registerHoverEvents, 1200);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(interval);
      const targets = document.querySelectorAll(
        "a, button, [role='button'], [data-cursor='hover'], input, textarea, select"
      );
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverEnter);
        el.removeEventListener("mouseleave", onHoverLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Outer follow ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 h-8 w-8 rounded-full border border-white/40 pointer-events-none z-9999999 mix-blend-difference"
        style={{ willChange: "transform", pointerEvents: "none" }}
      />
      {/* Inner fast dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-2 w-2 rounded-full bg-accent-primary pointer-events-none z-9999999"
        style={{ willChange: "transform", pointerEvents: "none" }}
      />
    </>
  );
}
