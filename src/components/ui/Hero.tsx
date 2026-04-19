"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";
import { LiveClock } from "@/components/ui/LiveClock";

const SplineScene = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full" style={{ background: "transparent" }} />,
});

export function Hero() {
  setupGsap();

  const scopeRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (
        !titleRef.current ||
        !subtitleRef.current ||
        !labelRef.current ||
        !statsRef.current ||
        !ctaRef.current ||
        !leftColRef.current
      ) {
        return;
      }

      const split = new SplitType(titleRef.current, {
        tagName: "span",
        types: "words,chars",
      });

      gsap.set(split.chars, { display: "inline-block" });

      /* ── Phase 1: Staggered character reveal ─────────────────────── */
      const revealTimeline = gsap.timeline({ delay: 0.6 });

      revealTimeline.from(split.chars, {
        opacity: 0,
        y: 80,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.9,
        ease: "back.out(1.7)",
      });

      revealTimeline.from(
        subtitleRef.current,
        { opacity: 0, y: 24, duration: 0.75, ease: "power2.out" },
        "-=0.5"
      );

      /* ── Supporting elements fade in ─────────────────────────────── */
      gsap.from(
        [labelRef.current, statsRef.current, ctaRef.current],
        {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.4,
        }
      );

      /* ── Phase 2: Scroll-out left column ─────────────────────────── */
      gsap.to(leftColRef.current, {
        opacity: 0,
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "70% top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      /* ── Parallax on 3D scene ─────────────────────────────────────── */
      gsap.to("[data-hero-parallax]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        cancelAnimationFrame(refreshFrame);
        split.revert();
      };
    },
    { scope: scopeRef, dependencies: [] }
  );

  const handleSplineLoad = () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    /* Attempt to hide shadow-DOM watermarks via JS */
    const removeWatermark = () => {
      document.querySelectorAll<HTMLElement>(
        '[class*="preact-border"], [class*="spline-watermark"]'
      ).forEach((h) => {
        h.style.setProperty("display", "none", "important");
      });

      document.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) {
          const hasSpline = el.shadowRoot.querySelector('a[href*="spline"]');
          if (hasSpline) {
            (el as HTMLElement).style.setProperty("display", "none", "important");
          }
        }
      });
    };

    removeWatermark();
    setTimeout(removeWatermark, 500);
    setTimeout(removeWatermark, 2000);
  };

  return (
    <section
      id="hero"
      ref={scopeRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="relative grid min-h-screen w-full grid-cols-1 overflow-visible lg:grid-cols-2">
        {/* ── Text column ─────────────────────────────────────────── */}
        <div
          ref={leftColRef}
          className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 z-10 relative h-full py-24"
        >
          <span
            ref={labelRef}
            className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em]"
            style={{ color: "var(--accent-tertiary)" }}
          >
            <span
              className="inline-block h-[1px] w-4"
              style={{ background: "var(--accent-tertiary)" }}
            />
            AI Engineer · Full-Stack Architect
          </span>

          <h1
            ref={titleRef}
            id="hero-title"
            className="text-white whitespace-normal break-words max-w-full relative z-10"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 5.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              maxWidth: "14ch",
              wordBreak: "break-word",
              textTransform: "uppercase",
            }}
          >
            Crafting
            <br className="hidden lg:inline" />
            Intelligent
            <br className="hidden lg:inline" />
            Experiences.
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
          >
            I build{" "}
            <span className="text-gradient-warm font-semibold">
              AI-powered systems
            </span>{" "}
            and design{" "}
            <span className="text-gradient-warm font-semibold">
              cinematic web interfaces
            </span>{" "}
            — where deep engineering meets visual storytelling.
          </p>

          <div ref={statsRef} className="mt-8 flex flex-wrap gap-3">
            {["AI / ML Engineer", "Full-Stack Architect", "B.Tech 2026"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border px-4 py-2 text-sm"
                  style={{
                    background: "var(--bg-elevated)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  {item}
                </span>
              )
            )}
          </div>

          <div ref={ctaRef} className="mt-9">
            <motion.button
              type="button"
              data-cursor="hover"
              onClick={() => {
                document.getElementById("work")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="rounded-full px-8 py-4 font-semibold text-white transition"
              style={{ background: "var(--accent-primary)" }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 40px var(--accent-primary-glow)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              View My Work
            </motion.button>
          </div>
        </div>

        {/* ── 3D Scene column ─────────────────────────────────────── */}
        {/*
          overflow-hidden clips the model to the column bounds.
          Gradients: only a very subtle left fade + top/bottom to blend.
          We deliberately remove the right-side gradient so the model
          isn't clipped in the center of the viewport.
        */}
        <div className="relative w-full h-[60vh] lg:h-screen flex items-center justify-center overflow-hidden">

          {/* Left fade — blends where text column meets 3D scene */}
          <div
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{
              width: "80px",
              background: "linear-gradient(to right, var(--bg-base) 0%, transparent 100%)",
            }}
          />

          {/* Top fade */}
          <div
            className="absolute inset-x-0 top-0 z-10 pointer-events-none"
            style={{
              height: "80px",
              background: "linear-gradient(to bottom, var(--bg-base) 0%, transparent 100%)",
            }}
          />

          {/* Bottom fade — blends model into next section */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: "80px",
              background: "linear-gradient(to top, var(--bg-base) 0%, transparent 100%)",
            }}
          />

          <div data-hero-parallax className="absolute inset-0">
            <SplineScene
              scene="/workspace.splinecode"
              className="w-full h-full absolute inset-0 pointer-events-auto"
              onLoad={handleSplineLoad}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom-left: solid cover over Spline "N" watermark ─────── */}
      {/*
        The Spline "N" is roughly 40×40px at the very bottom-left corner.
        We cover it with a solid bg-base block at max z-index.
      */}
      <div
        className="fixed bottom-0 left-0"
        style={{
          zIndex: 2147483647,
          width: "64px",
          height: "64px",
          background: "var(--bg-base)",
        }}
      />

      {/* ── Bottom-right: Live Clock as feature element ─────────────── */}
      {/*
        Positioned over the "Built with Spline" badge.
        The lg LiveClock shows time + date and is large enough to fully
        obscure the badge while adding a premium feel to the hero.
      */}
      <div
        className="fixed bottom-0 right-0 flex items-end justify-end px-5 py-3"
        style={{
          zIndex: 2147483647,
          background: "var(--bg-base)",
          minWidth: "240px",
          minHeight: "52px",
        }}
      >
        <LiveClock size="lg" />
      </div>
    </section>
  );
}
