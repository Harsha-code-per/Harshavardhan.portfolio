"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function HeroQuote() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-hero-line]",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1.5,
          ease: "power4.out",
        }
      );
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="flex h-screen w-full flex-col items-center justify-center text-center"
    >
      <div className="overflow-hidden">
        <h1
          data-hero-line
          className="text-6xl font-bold tracking-tight text-white opacity-0 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:text-8xl"
        >
          Engineering Intelligence. Architecting Reality.
        </h1>
      </div>

      <div className="mt-6 overflow-hidden">
        <p
          data-hero-line
          className="text-xl uppercase tracking-widest text-gray-200 opacity-0 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:text-2xl"
        >
          AI, ML & Full Stack Engineer
        </p>
      </div>
    </div>
  );
}
