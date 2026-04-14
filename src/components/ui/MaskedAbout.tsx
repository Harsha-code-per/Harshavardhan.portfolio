"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MaskedAbout() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-wrapper",
          start: "top top",
          end: "+=150%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .to(".about-mask", {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          ease: "none",
        })
        .to(".inner-content", {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
        });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-wrapper relative h-screen w-full bg-white flex items-center justify-center"
    >
      <div className="about-mask w-[300px] h-[400px] rounded-[40px] bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden will-change-transform">
        <div className="inner-content w-full h-full flex flex-col md:flex-row items-center justify-center p-12 md:p-24 opacity-0 gap-12 md:gap-20">
          <div className="max-w-2xl">
            <p className="text-4xl md:text-6xl font-light leading-tight">
              Building intelligent digital systems at the intersection of AI,
              machine learning, and high-performance full-stack architecture.
            </p>
          </div>
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
            <Image
              src="/self-1.jpg"
              alt="Harshavardhan K"
              width={384}
              height={384}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
