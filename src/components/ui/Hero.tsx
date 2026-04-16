"use client";

import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap, setupGsap } from "@/lib/gsap";
import { LiveClock } from "@/components/ui/LiveClock";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-white" />,
});

export function Hero() {
  setupGsap();

  const scopeRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  useGSAP(
    () => {
      if (!titleRef.current || !subtitleRef.current) {
        return;
      }

      const split = new SplitType(titleRef.current, { types: "lines,words" });
      gsap.set(split.words, { willChange: "transform, opacity" });

      const revealTimeline = gsap.timeline();
      revealTimeline.from(split.words, {
        opacity: 0,
        yPercent: 120,
        rotateZ: 3,
        stagger: 0.03,
        duration: 1.05,
        ease: "power3.out",
      });

      revealTimeline.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 24,
          duration: 0.75,
          ease: "power2.out",
        },
        "-=0.65"
      );

      gsap.to(split.words, {
        yPercent: -120,
        opacity: 0,
        stagger: 0.01,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          immediateRender: false,
        },
      });

      gsap.to("[data-hero-parallax]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: scopeRef }
  );

  return (
    <section
      id="hero"
      ref={scopeRef}
      className="hero-container relative h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white text-zinc-950"
    >
      <div className="flex flex-col justify-center px-8 lg:px-16 pt-32 lg:pt-20 z-10 h-full">
        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-violet-600">
          AI · Full Stack · Motion Engineering
        </p>
        <h1
          ref={titleRef}
          id="hero-title"
          className="text-pretty text-[clamp(2.2rem,6vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]"
        >
          Building Intelligent Products <br /> & Immersive Digital Interfaces
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 flex items-center gap-3 text-sm font-medium tracking-tight text-zinc-700 md:text-base lg:text-lg"
        >
          <span className="h-0.5 w-8 shrink-0 bg-violet-500 md:w-12" />
          I design recruiter-ready experiences that merge engineering depth with
          cinematic storytelling.
        </p>
      </div>

      <div className="relative h-[50vh] lg:h-[100vh] w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible">
        <div data-hero-parallax className="w-full h-full">
          <Spline scene="/workspace.splinecode" className="w-full h-full" />
        </div>
        <LiveClock />
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center text-zinc-500">
        <p className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</p>
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white/70">
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </div>
    </section>
  );
}
