"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const { progress, active } = useProgress();
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const introPlayedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const phaseRef = useRef<HTMLParagraphElement>(null);

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

  // Smooth fake progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFakeProgress((prev) => {
        // Consider it loaded if three.js progress is 100% or it's inactive (no models to load)
        const isLoaded = progress >= 100 || !active;
        const maxFake = isLoaded ? 100 : 90; // hold at 90% until 3D is ready
        
        if (prev < maxFake) {
          // Fast initially, then slow down
          const increment = prev < 50 ? 1.5 : prev < 80 ? 0.8 : 0.4;
          return Math.min(prev + increment, maxFake);
        }
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [progress, active]);

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

      if (phaseRef.current) {
        phaseRef.current.innerText = getPhaseText(fakeProgress);
      }

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
    { dependencies: [isVisible, readyToExit, fakeProgress], scope: preloaderRef }
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
        <p className="manifesto-text text-xs md:text-sm tracking-[0.3em] text-[var(--accent-primary-light)] font-medium uppercase opacity-0 translate-y-full">
          Immersive Experiences Ahead
        </p>
      </div>
      <div className="overflow-hidden">
        <h2 className="counter-text text-[clamp(5rem,15vw,12rem)] font-black leading-none opacity-0 translate-y-full text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--accent-primary)]">
          {Math.floor(fakeProgress)}%
        </h2>
      </div>
      <div className="absolute bottom-10 left-10 text-xs font-mono text-[var(--text-secondary)] loading-details opacity-0">
        <p ref={phaseRef}>{getPhaseText(fakeProgress)}</p>
        <div className="mt-2 h-1 w-32 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--accent-primary)] transition-all duration-75 ease-linear" 
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
