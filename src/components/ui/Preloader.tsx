"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const { progress } = useProgress();
  const [isVisible, setIsVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);
  const progressValueRef = useRef<HTMLSpanElement>(null);
  const exitStartedRef = useRef(false);

  useEffect(() => {
    const preloaderWindow = window as Window & { __preloaderComplete?: boolean };
    preloaderWindow.__preloaderComplete = false;
    document.body.dataset.preloaderState = "loading";
  }, []);

  useEffect(() => {
    if (progressValueRef.current) {
      progressValueRef.current.textContent = `${Math.round(progress)}%`;
    }
  }, [progress]);

  useEffect(() => {
    if (!progressFillRef.current || !progressGlowRef.current) {
      return;
    }

    const fillValue = Math.max(0.04, progress / 100);

    gsap.to(progressFillRef.current, {
      scaleX: fillValue,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(progressGlowRef.current, {
      scaleX: fillValue,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [progress]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    gsap.ticker.lagSmoothing(1000, 16);

    const particles = loaderRef.current
      ? gsap.utils.toArray<HTMLElement>(".loader-particle", loaderRef.current)
      : [];
    const orbs = loaderRef.current
      ? gsap.utils.toArray<HTMLElement>(".loader-orb", loaderRef.current)
      : [];

    const introTimeline = gsap.timeline({
      defaults: { ease: "expo.out" },
    });

    introTimeline
      .fromTo(
        ".loader-copy",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.12
      )
      .fromTo(
        ".loader-progress-track",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.75 },
        0.22
      )
      .fromTo(
        ".loader-meta",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.3
      );

    particles.forEach((particle, index) => {
      gsap.to(particle, {
        x: index % 2 === 0 ? 28 : -28,
        y: index % 3 === 0 ? -22 : 22,
        scale: index % 2 === 0 ? 1.15 : 0.9,
        opacity: index % 2 === 0 ? 0.95 : 0.65,
        duration: 5 + index * 0.45,
        repeat: -1,
        yoyo: true,
        delay: index * 0.12,
        ease: "sine.inOut",
      });
    });

    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        x: index === 0 ? 20 : -18,
        y: index === 1 ? 16 : -14,
        rotation: index === 1 ? -8 : 10,
        duration: 7 + index * 0.6,
        repeat: -1,
        yoyo: true,
        delay: index * 0.18,
        ease: "sine.inOut",
      });
    });

    return () => {
      introTimeline.kill();
      gsap.killTweensOf([...particles, ...orbs]);
    };
  }, [isVisible]);

  // PHASE 3: Cinematic GSAP Exit
  function completeLoading() {
    if (!loaderRef.current) return;

    const preloaderWindow = window as Window & {
      __preloaderComplete?: boolean;
    };

    document.body.dataset.preloaderState = "revealing";
    preloaderWindow.__preloaderComplete = true;
    window.dispatchEvent(new CustomEvent("preloaderComplete"));

    const exitTimeline = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        document.body.dataset.preloaderState = "done";
        document.body.style.overflow = "";
        setIsVisible(false);
      },
    });

    // Step 1: Fade out text and progress
    exitTimeline.to(
      [".loader-copy", ".loader-progress-track", ".loader-meta"],
      {
        opacity: 0,
        y: -20,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.in",
      },
      0
    );

    // Step 2: Slide entire preloader UP and out
    exitTimeline.to(
      loaderRef.current,
      {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
      },
      0.3
    );
  }

  // PHASE 2: Exit lifecycle with hard failsafe
  useEffect(() => {
    if (exitStartedRef.current || !isVisible) {
      return;
    }

    let isTriggered = false;
    let normalTimer: number | null = null;

    const exitSequence = () => {
      if (isTriggered || exitStartedRef.current) {
        return;
      }

      isTriggered = true;
      exitStartedRef.current = true;
      completeLoading();
    };

    if (progress >= 100) {
      normalTimer = window.setTimeout(exitSequence, 500);
    }

    const failsafe = window.setTimeout(exitSequence, 3000);

    return () => {
      if (normalTimer !== null) {
        window.clearTimeout(normalTimer);
      }
      window.clearTimeout(failsafe);
    };
  }, [progress, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const particles = [
    { top: "14%", left: "16%", size: "0.55rem", delay: "0s" },
    { top: "22%", left: "78%", size: "0.8rem", delay: "0.2s" },
    { top: "48%", left: "12%", size: "0.45rem", delay: "0.4s" },
    { top: "62%", left: "84%", size: "0.7rem", delay: "0.6s" },
    { top: "76%", left: "28%", size: "0.35rem", delay: "0.8s" },
    { top: "84%", left: "66%", size: "0.5rem", delay: "1s" },
  ];

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-[#0c0b0a] text-white"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 loader-shell">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(230,95,43,0.24),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(234,179,8,0.16),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(192,132,87,0.12),transparent_24%),linear-gradient(135deg,#0c0b0a_0%,#0c0b0a_100%)]" />
        <div className="absolute inset-0 opacity-[0.16] mix-blend-screen [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,11,10,0.16)_72%,rgba(12,11,10,0.5)_100%)]" />
        <div className="loader-orb absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#e65f2b]/25 blur-3xl" />
        <div className="loader-orb absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-[#eab308]/20 blur-3xl" />
        <div className="loader-orb absolute bottom-[-6rem] left-1/3 h-64 w-64 rounded-full bg-[#c08457]/20 blur-3xl" />

        {particles.map((particle) => (
          <span
            key={`${particle.top}-${particle.left}`}
            className="loader-particle absolute rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.45)]"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size,
              filter: "blur(0.2px)",
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-[min(92vw,760px)] px-6 text-center">
        <div className="loader-copy overflow-hidden">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-[#e65f2b]">
            Initializing Experience
          </p>
        </div>

        <div className="loader-copy mt-4 overflow-hidden">
          <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.06em] text-[#f4f0ea]">
            Crafting the reveal
          </h2>
        </div>

        <div className="loader-progress-track mt-10 opacity-0">
          <div className="flex items-end justify-between text-xs uppercase tracking-[0.35em] text-white/55">
            <span>Loading sequence</span>
            <span ref={progressValueRef} className="font-mono text-[#f4f0ea] tabular-nums">
              0%
            </span>
          </div>

          <div className="relative mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.24)]">
            <div
              ref={progressGlowRef}
              className="absolute inset-0 origin-left scale-x-[0.04] rounded-full bg-[linear-gradient(90deg,rgba(230,95,43,0.2),rgba(234,179,8,0.42),rgba(244,240,234,0.55))] blur-md"
            />
            <div
              ref={progressFillRef}
              className="absolute inset-y-0 left-0 origin-left scale-x-[0.04] rounded-full bg-[linear-gradient(90deg,#e65f2b_0%,#eab308_60%,#f4f0ea_100%)] shadow-[0_0_24px_rgba(230,95,43,0.45)]"
            />
          </div>
        </div>

        <div className="loader-meta mt-8 opacity-0">
          <p className="text-sm text-white/62">Loading shaders, assets, and interactions...</p>
        </div>
      </div>
    </div>
  );
}
