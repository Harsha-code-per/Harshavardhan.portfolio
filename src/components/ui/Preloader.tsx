"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const { progress, active } = useProgress();
  // Use refs to read inside interval without re-creating it
  const progressRef_internal = useRef(progress);
  const activeRef_internal = useRef(active);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const introPlayedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const phaseRef = useRef<HTMLParagraphElement>(null);
  // Guard against double-interval in React StrictMode
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync refs without triggering interval recreation
  progressRef_internal.current = progress;
  activeRef_internal.current = active;

  const getPhaseText = (p: number) => {
    if (p < 30) return "BOOTING KERNEL...";
    if (p < 60) return "LOADING ASSETS...";
    if (p < 90) return "CALIBRATING EXPERIENCE...";
    return "INITIALIZING...";
  };

  useEffect(() => {
    const preloaderWindow = window as Window & { __preloaderComplete?: boolean };
    preloaderWindow.__preloaderComplete = false;
  }, []);

  // Smooth fake progress animation — single interval, guarded against double-create
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const isLoaded = progressRef_internal.current >= 100 || !activeRef_internal.current;
      const maxFake = isLoaded ? 100 : 90;
      setFakeProgress((prev) => {
        const next = prev < maxFake
          ? Math.min(prev + (prev < 50 ? 1.5 : prev < 80 ? 0.8 : 0.4), maxFake)
          : prev;
        // Update phase text directly in the interval — no GSAP hook needed
        if (phaseRef.current) {
          phaseRef.current.innerText = getPhaseText(next);
        }
        return next;
      });
    }, 50);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Empty deps — interval created once, never recreated

  const readyToExit = fakeProgress >= 100;

  useGSAP(
    () => {
      if (!isVisible) return;
      gsap.ticker.lagSmoothing(1000, 16);

      if (!introPlayedRef.current) {
        introPlayedRef.current = true;
        gsap
          .timeline()
          .to(".manifesto-text", {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: 0.2,
          })
          .to(
            ".counter-text",
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
            },
            "-=0.65"
          )
          .to(
            ".loading-details",
            {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.45"
          );
      }
      // phaseRef update moved to the interval — no DOM mutation needed here

      if (!readyToExit || exitStartedRef.current) return;

      exitStartedRef.current = true;
      gsap
        .timeline({ delay: 0.2 }) // tiny delay at 100%
        .to([".manifesto-text", ".counter-text", ".loading-details"], {
          opacity: 0,
          y: -40,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .to(
          preloaderRef.current,
          {
            y: "-100vh",
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
              (window as Window & { __preloaderComplete?: boolean }).__preloaderComplete = true;
              window.dispatchEvent(new CustomEvent("preloaderComplete"));
              setIsVisible(false);
            },
          },
          "-=0.2"
        );
    },
    // Only re-run for boolean state changes, not every fakeProgress tick
    { dependencies: [isVisible, readyToExit], scope: preloaderRef }
  );

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={preloaderRef}
      className="flex flex-col items-center justify-center text-[var(--text-primary)] overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: "var(--bg-base)",
      }}
    >
      <div className="overflow-hidden mb-4">
        <p className="manifesto-text text-xs md:text-sm tracking-[0.3em] text-white/70 font-medium uppercase opacity-0 translate-y-full">
          Immersive Experiences Ahead
        </p>
      </div>
      <div className="overflow-hidden">
        <h2 className="counter-text text-[clamp(5rem,15vw,12rem)] font-black leading-none opacity-0 translate-y-full text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          {Math.floor(fakeProgress)}%
        </h2>
      </div>
      <div className="absolute bottom-10 left-10 text-xs font-mono text-[var(--text-secondary)] loading-details opacity-0">
        <p ref={phaseRef}>{getPhaseText(fakeProgress)}</p>
        <div className="mt-2 h-1 w-32 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-75 ease-linear" 
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
