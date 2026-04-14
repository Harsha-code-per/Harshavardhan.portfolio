"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";
import Spline from "@splinetool/react-spline";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Hero() {
  const scopeRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const text = new SplitType("#hero-title", { types: "chars" });

      gsap.from(text.chars, {
        opacity: 0,
        x: "random(-200, 200)",
        y: "random(-200, 200)",
        rotationZ: "random(-45, 45)",
        stagger: 0.02,
        duration: 1.5,
        ease: "power4.out",
      });

      gsap.to(text.chars, {
        y: -8,
        rotationZ: "random(-2, 2)",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.05,
          from: "random",
        },
        duration: 2,
        ease: "sine.inOut",
        delay: 1.5,
      });

      gsap.to(text.chars, {
        y: -200,
        opacity: 0,
        stagger: 0.01,
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          immediateRender: false,
        },
      });

      return () => {
        text.revert();
      };
    },
    { scope: scopeRef }
  );

  return (
    <section
      id="hero"
      ref={scopeRef}
      className="hero-container relative h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white"
    >
      <div className="flex flex-col justify-center px-8 lg:px-24 z-10 h-full">
        <h1
          id="hero-title"
          className="text-3xl md:text-4xl lg:text-[2.35vw] xl:text-[2.6vw] font-black tracking-tighter uppercase leading-[1.08] text-zinc-950 relative z-10 w-full whitespace-nowrap"
        >
          Engineering Intelligent Systems<br/>& Immersive Digital Experiences.
        </h1>
        <h2 className="text-sm md:text-base lg:text-lg xl:text-xl font-medium text-neutral-600 mt-4 tracking-tight flex items-center gap-3 relative z-10">
          <span className="w-6 lg:w-10 h-0.5 bg-neutral-900 shrink-0"></span> AI, ML & Full Stack Engineer
        </h2>
      </div>

      <div className="relative h-[50vh] lg:h-full w-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <Spline scene="/workspace.splinecode" className="w-full h-full" />
        <div className="absolute bottom-2 right-4.75 w-44 h-16 bg-white z-50 pointer-events-none rounded-tl-lg"></div>
      </div>
    </section>
  );
}
