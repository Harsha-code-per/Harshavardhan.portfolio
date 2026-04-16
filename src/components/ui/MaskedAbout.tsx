"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { aboutContent } from "@/data/about";
import { gsap, setupGsap } from "@/lib/gsap";

export function MaskedAbout() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mask = sectionRef.current?.querySelector<HTMLElement>("[data-about-mask]");
      const content = sectionRef.current?.querySelector<HTMLElement>("[data-about-content]");

      if (!mask || !content) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=130%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .fromTo(
          mask,
          { scale: 0.38, yPercent: 24, opacity: 0.8, transformOrigin: "center center", rotateZ: -3 },
          {
            scale: 1,
            yPercent: 0,
            opacity: 1,
            rotateZ: 0,
            ease: "none",
          }
        )
        .fromTo(
          content,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power1.out",
          },
          0.1
        )
        .to(mask, {
          yPercent: -8,
          ease: "none",
        });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-wrapper relative flex min-h-screen w-full items-center justify-center bg-[#f2e9db] px-4 py-14 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(139,92,246,0.14),transparent_33%),radial-gradient(circle_at_78%_70%,rgba(234,179,8,0.14),transparent_36%)]" />
      <div
        data-about-mask
        className="w-full max-w-6xl overflow-hidden rounded-[2.4rem] border border-[#decdb5] bg-[#fffdf9] text-zinc-900 shadow-[0_28px_80px_-44px_rgba(88,64,42,0.45)] will-change-transform"
      >
        <div
          data-about-content
          className="grid h-full w-full grid-cols-1 gap-10 p-7 opacity-0 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-12 md:p-12 lg:p-16"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-violet-600/80">
              About
            </p>
            <h2 className="mt-3 text-balance text-[clamp(1.7rem,3.8vw,3.35rem)] font-semibold leading-[1.05]">
              {aboutContent.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-zinc-700 md:text-lg">
              {aboutContent.statement}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 md:text-base">
              {aboutContent.bio}
            </p>
            <div className="mt-7 space-y-3">
              {aboutContent.highlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#e7d7c1] bg-[#f9f3ea] p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-violet-600/70">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 md:text-base">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto h-64 w-64 shrink-0 overflow-hidden rounded-full ring-1 ring-violet-200 md:h-80 md:w-80 lg:h-96 lg:w-96">
            <Image
              src={aboutContent.portrait.src}
              alt={aboutContent.portrait.alt}
              width={384}
              height={384}
              sizes="(max-width: 768px) 256px, (max-width: 1200px) 320px, 384px"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
