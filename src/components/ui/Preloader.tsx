"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function Preloader() {
  const { progress } = useProgress();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const introPlayedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const readyToExit = progress >= 100 && timeIsUp;

  useEffect(() => {
    const preloaderWindow = window as Window & { __preloaderComplete?: boolean };
    preloaderWindow.__preloaderComplete = false;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTimeIsUp(true);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useGSAP(
    () => {
      if (!isVisible) {
        return;
      }

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

      if (!readyToExit || exitStartedRef.current) {
        return;
      }

      exitStartedRef.current = true;
      gsap
        .timeline()
        .to([".manifesto-text", ".counter-text", ".loading-details"], {
          opacity: 0,
          y: -24,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.inOut",
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
          "-=0.1"
        );
    },
    { dependencies: [isVisible, readyToExit], scope: preloaderRef }
  );

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

  return (
    <div
      ref={preloaderRef}
      className="flex flex-col items-center justify-center text-white overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: "#050505",
      }}
    >
      <div className="overflow-hidden mb-4">
        <p className="manifesto-text text-xs md:text-sm tracking-[0.3em] text-cyan-400 font-medium uppercase opacity-0 translate-y-full">
          Immersive Experiences Ahead
        </p>
      </div>
      <div className="overflow-hidden">
        <h2 className="counter-text text-[clamp(4rem,10vw,8rem)] font-black leading-none opacity-0 translate-y-full">
          {Math.round(progress)}%
        </h2>
      </div>
      <div className="absolute bottom-10 left-10 text-xs font-mono text-neutral-500 loading-details opacity-0">
        <p>Compiling WebGL Shaders...</p>
        <p>Allocating VRAM...</p>
      </div>
    </div>
  );
}
