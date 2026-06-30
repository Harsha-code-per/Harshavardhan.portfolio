"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const PRELOADER_STORAGE_KEY = "portfolio-preloader-complete";

const BOOT_LOGS = [
  "SYSTEM INITIALIZATION V3.5...",
  "CPU CONFIG: CORE ENGINE ENGAGED",
  "RAM MAP: CACHE STACK PARSING [256MB]",
  "SHADERS: VERTEX BUILD PIPELINE COMPILED",
  "TICKER: BINDING GSAP GLOBAL ticker LOOP",
  "CANVAS: CREATING THREE.JS WEBGL RENDER SYSTEM",
  "GLTF SOURCE: FETCHING 3D ASSET PACKETS",
  "DRACO EXTENSION: DECOMPRESSING RETRO COMPUTER DATA",
  "STATE SYNC: ZUSTAND INTERFACE STORE INITIALIZED",
  "PRELOADING SYSTEMS: LOAD COMPLETE",
  "MONITOR CALIBRATION: INITIATING DEGAUSS SEQUENCE",
  "SYSTEM ONLINE. BROADCAST CHANNELS ARMED."
];

export function Preloader() {
  const { progress, active } = useProgress();
  const progressRef = useRef(progress);
  const activeRef = useRef(active);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const introPlayedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const skipPreloaderRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLayoutEffect(() => {
    const preloaderWindow = window as Window & { __preloaderComplete?: boolean };
    const completed = window.sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "true";
    preloaderWindow.__preloaderComplete = completed;

    if (completed) {
      skipPreloaderRef.current = true;
      if (preloaderRef.current) {
        preloaderRef.current.style.display = "none";
      }
      window.dispatchEvent(new CustomEvent("preloaderComplete"));
      const hideTimer = window.setTimeout(() => setIsVisible(false), 0);
      return () => window.clearTimeout(hideTimer);
    }
  }, []);

  // Sync assets progress
  useEffect(() => {
    progressRef.current = progress;
    activeRef.current = active;
  }, [progress, active]);

  // Smooth fake progress animation
  useEffect(() => {
    if (!isVisible || skipPreloaderRef.current) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const isLoaded = progressRef.current >= 100 || !activeRef.current;
      const maxFake = isLoaded ? 100 : 95; // Cap at 95 until model is loaded
      setFakeProgress((prev) => {
        return prev < maxFake
          ? Math.min(prev + (prev < 40 ? 2.5 : prev < 75 ? 1.2 : 0.6), maxFake)
          : prev;
      });
    }, 45);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisible]);

  // Failsafe in case model stalls
  useEffect(() => {
    if (!isVisible || skipPreloaderRef.current) return;

    const failSafe = window.setTimeout(() => {
      progressRef.current = 100;
      activeRef.current = false;
      setFakeProgress(100);
    }, 4500);

    return () => window.clearTimeout(failSafe);
  }, [isVisible]);

  const readyToExit = fakeProgress >= 100;

  // Split boot logs count
  const visibleLogsCount = Math.min(
    Math.floor((fakeProgress / 100) * (BOOT_LOGS.length + 1)),
    BOOT_LOGS.length
  );
  const visibleLogs = BOOT_LOGS.slice(0, visibleLogsCount);

  useEffect(() => {
    // Auto scroll the mock console to show new lines
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [visibleLogsCount]);

  useGSAP(
    () => {
      if (!isVisible || skipPreloaderRef.current) return;
      gsap.ticker.lagSmoothing(1000, 16);

      const exitPreloader = () => {
        if (exitStartedRef.current) return;

        exitStartedRef.current = true;
        setFakeProgress(100);

        gsap
          .timeline({ delay: 0.1 })
          .to(".preloader-console", {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: "power3.inOut",
          })
          .to(
            preloaderRef.current,
            {
              y: "-100vh",
              duration: 1.1,
              ease: "expo.inOut",
              onComplete: () => {
                (window as Window & { __preloaderComplete?: boolean }).__preloaderComplete = true;
                window.sessionStorage.setItem(PRELOADER_STORAGE_KEY, "true");
                window.dispatchEvent(new CustomEvent("preloaderComplete"));
                setIsVisible(false);
              },
            },
            "-=0.2"
          );
      };

      const forcedExit = gsap.delayedCall(4.8, exitPreloader);

      if (!introPlayedRef.current) {
        introPlayedRef.current = true;
        gsap
          .timeline()
          .to(".preloader-console", {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "expo.out",
          });
      }

      if (!readyToExit) {
        return () => {
          forcedExit.kill();
        };
      }

      exitPreloader();

      return () => {
        forcedExit.kill();
      };
    },
    { dependencies: [isVisible, readyToExit], scope: preloaderRef }
  );

  useEffect(() => {
    if (!isVisible || skipPreloaderRef.current) return;
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
      className="flex flex-col items-center justify-center overflow-hidden z-9999999 bg-[#050507]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#050507",
      }}
    >
      {/* Screen Glitch overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5))] pointer-events-none z-10" />
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.12] z-0" />
      
      {/* Terminal Container */}
      <div className="preloader-console w-[90%] max-w-lg border border-white/10 rounded bg-[#0a0a0f]/90 p-5 font-mono text-xs opacity-0 scale-95 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur relative z-20">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4 text-white/50 text-[10px] uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Telemetry Link // Online</span>
          </div>
          <span>PORT_443</span>
        </div>

        {/* Logs Stream */}
        <div 
          ref={consoleRef}
          className="h-48 overflow-y-auto mb-5 space-y-1.5 scroll-smooth pr-2 select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {visibleLogs.map((log, i) => (
            <div key={i} className="flex gap-2.5 items-start text-white/70">
              <span className="text-accent-primary-light font-bold shrink-0">&gt;</span>
              <p className="leading-relaxed">{log}</p>
            </div>
          ))}
          
          {visibleLogsCount < BOOT_LOGS.length && (
            <div className="flex gap-2.5 items-center">
              <span className="text-accent-primary-light font-bold shrink-0">&gt;</span>
              <span className="h-3.5 w-2 bg-accent-primary animate-pulse" />
            </div>
          )}
        </div>

        {/* Progress Bar & Percentage */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="h-1 bg-white/5 rounded overflow-hidden">
              <div 
                className="h-full bg-accent-primary shadow-[0_0_12px_var(--accent-primary-glow)] transition-all duration-75 ease-linear"
                style={{ width: `${fakeProgress}%` }}
              />
            </div>
          </div>
           <span className="font-bold text-accent-primary-light text-sm leading-none shrink-0 min-w-10 text-right">
            {Math.floor(fakeProgress)}%
          </span>
        </div>

      </div>
    </div>
  );
}
