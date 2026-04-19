"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const quotes = [
  "Initializing WebGL Engine...",
  "Compiling Shaders...",
  "Loading Neural Pathways...",
  "Constructing Digital Interfaces...",
  "Ready."
];

export function Preloader() {
  const { progress } = useProgress();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let index = 0;
    if (progress < 20) index = 0;
    else if (progress < 50) index = 1;
    else if (progress < 80) index = 2;
    else if (progress < 100) index = 3;
    else index = 4;

    if (index !== quoteIndex) {
      gsap.to(".quote-text", {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setQuoteIndex(index);
          gsap.to(".quote-text", { opacity: 1, duration: 0.3 });
        }
      });
    }
  }, [isVisible, progress, quoteIndex]);

  useGSAP(
    () => {
      if (!isVisible || progress < 100) {
        return;
      }

      gsap.to(".progress-text", { y: "-100%", duration: 0.5, ease: "power3.in" });
      gsap.to(".preloader", {
        y: "-100vh",
        duration: 1,
        ease: "expo.inOut",
        delay: 0.4,
        onComplete: () => setIsVisible(false),
      });
    },
    { dependencies: [isVisible, progress] }
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
    <div className="preloader fixed inset-0 z-[2000] bg-[#050505] flex flex-col items-center justify-center text-white pointer-events-auto">
      <div className="text-[10vw] font-black overflow-hidden">
        <span className="progress-text inline-block">{Math.round(progress)}%</span>
      </div>
      <div className="w-64 h-[2px] bg-white/20 mt-8 overflow-hidden rounded-full">
        <div className="progress-bar h-full bg-cyan-400 transition-all duration-300 ease-out" style={{ width: progress + "%" }}></div>
      </div>
      <div className="mt-6 text-sm text-neutral-400 font-mono tracking-widest h-6">
        <span className="quote-text opacity-100 block">{quotes[quoteIndex]}</span>
      </div>
    </div>
  );
}
