"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HorizontalProjects() {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-wrapper",
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <section
      id="projects"
      ref={wrapperRef}
      className="projects-wrapper h-screen w-full overflow-hidden bg-[#050505]"
    >
      <div
        ref={trackRef}
        className="projects-track flex flex-row w-[200vw] h-full flex-nowrap"
      >
        <article className="w-screen h-full shrink-0 flex flex-col items-center justify-center p-12 bg-zinc-900 border-r border-white/10">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              SPECTRAVEIN
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-neutral-300 md:text-lg">
              A data-driven asteroid intelligence system combining ML pipelines,
              orbital analytics, and immersive 3D visualization for
              decision-grade mining insight.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge>Python</Badge>
              <Badge>Machine Learning</Badge>
              <Badge>Data Pipelines</Badge>
              <Badge>3D Visualization</Badge>
            </div>
          </div>
        </article>

        <article className="w-screen h-full shrink-0 flex flex-col items-center justify-center p-12 bg-neutral-950">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              SecureChat
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-neutral-300 md:text-lg">
              A resilient communication platform built on secure WebRTC
              channels, hardened auth, and robust real-time messaging flows for
              high-trust collaboration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge>WebRTC</Badge>
              <Badge>Secure Messaging</Badge>
              <Badge>Authentication</Badge>
              <Badge>Real-time Systems</Badge>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
