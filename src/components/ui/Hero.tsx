"use client";

import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { HeroScene } from "@/components/canvas/HeroScene";
import { gsap } from "@/lib/gsap";
import { useRef } from "react";

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!titleRef.current) {
        return;
      }

      const text = new SplitType(titleRef.current, { types: "chars,words,lines" });

      gsap.set(".hero-anim", { y: 20 });

      gsap.from(text.chars, {
        y: "100%",
        rotationZ: 10,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.02,
        delay: 0.5,
      });

      gsap.to(".hero-anim", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 1.5,
      });

      return () => {
        text.revert();
      };
    },
    { scope: container, dependencies: [] }
  );

  return (
    <section
      id="hero"
      ref={container}
      className="relative w-full h-screen overflow-hidden bg-[#050505] text-white"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <HeroScene />
      </div>
      <div className="absolute inset-0 w-full h-full z-10 flex items-center pointer-events-none">
        <div className="flex flex-col justify-center px-8 lg:px-16 z-10 h-full relative pointer-events-none max-w-2xl">
          <p className="text-cyan-400 text-xs md:text-sm tracking-widest uppercase mb-4 flex items-center gap-4 pointer-events-auto opacity-0 hero-anim">
            <span className="w-6 h-[1px] bg-cyan-400"></span>
            AI Engineer <span className="text-cyan-400/50">&bull;</span> Full-Stack Architect
          </p>

          <h1
            ref={titleRef}
            id="hero-title"
            className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black uppercase leading-[0.9] tracking-tighter w-full text-zinc-100 pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
          >
            CRAFTING
            <br />
            INTELLIGENT
            <br />
            EXPERIENCES.
          </h1>

          <p className="mt-6 text-neutral-400 text-base md:text-lg max-w-lg font-light pointer-events-auto opacity-0 hero-anim">
            I build <span className="text-white font-medium">AI-powered systems</span> and design{" "}
            <span className="text-purple-400 font-medium">cinematic web interfaces</span>  where deep engineering meets visual storytelling.
          </p>

          <div className="flex flex-wrap gap-3 mt-8 pointer-events-auto opacity-0 hero-anim">
            <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">AI / ML Engineer</span>
            <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">Full-Stack Architect</span>
            <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest bg-white/5 text-neutral-300">B.Tech 2028</span>
          </div>

          <div className="mt-8 pointer-events-auto opacity-0 hero-anim">
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors shadow-[0_0_20px_rgba(124,58,237,0.3)] pointer-events-auto"
            >
              View My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
