"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { aboutContent } from "@/data/about";
import { gsap, setupGsap } from "@/lib/gsap";

export function About() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const card = cardRef.current;
      const image = imageRef.current;
      if (!section || !card || !image) {
        return;
      }

      const heading = section.querySelector<HTMLElement>("[data-about-heading]");
      if (!heading) {
        return;
      }

      const splitText = new SplitType(heading, { types: "lines,words" });
      const headingTargets =
        splitText.lines && splitText.lines.length > 0 ? splitText.lines : splitText.words ?? [];
      const featureCards = gsap.utils.toArray<HTMLElement>("[data-about-card]", section);
      const aboutBody = section.querySelector<HTMLElement>("[data-about-copy]");
      const imageWrap = section.querySelector<HTMLElement>("[data-about-image-wrap]");

      if (!imageWrap || !aboutBody) {
        splitText.revert();
        return;
      }

      gsap.set(headingTargets, { opacity: 0, y: 40 });
      gsap.set(aboutBody, { opacity: 0, y: 28 });
      gsap.set(imageWrap, { opacity: 0, y: 40 });
      gsap.set(image, { scale: 1.3 });
      gsap.set(featureCards, { opacity: 0, y: 30 });

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 35%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      const imageParallaxTween = gsap.to(image, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      revealTimeline
        .to(headingTargets, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
        })
        .to(
          aboutBody,
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
          },
          "-=0.8"
        )
        .to(
          imageWrap,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.9"
        )
        .to(
          featureCards,
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "expo.out",
          },
          "-=0.8"
        );

      return () => {
        imageParallaxTween.scrollTrigger?.kill();
        imageParallaxTween.kill();
        revealTimeline.scrollTrigger?.kill();
        revealTimeline.kill();
        splitText.revert();
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden rounded-t-[3rem] bg-[#0a0a0a] shadow-2xl"
    >
      <article
        ref={cardRef}
        className="relative w-full border-t border-white/5 px-[clamp(1rem,5vw,4rem)] pb-20 pt-32 text-[var(--text-primary)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(139,92,246,0.14),transparent_45%),radial-gradient(circle_at_85%_35%,rgba(6,182,212,0.09),transparent_48%)]" />

        <div className="relative z-10 grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="about-header lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-primary-light)]">
              About
            </p>
            <h2
              data-about-heading
              className="about-heading mt-4 max-w-[18ch] text-balance text-[clamp(2.2rem,5.8vw,5.3rem)] font-[var(--font-space)] font-semibold leading-[0.95] text-zinc-100"
            >
              {aboutContent.title}
            </h2>
            <div data-about-copy className="mt-10 max-w-[42rem] space-y-5">
              <p className="text-[clamp(1rem,1.55vw,1.32rem)] leading-relaxed text-zinc-300">
                {aboutContent.statement}
              </p>
              <p className="text-[clamp(0.96rem,1.35vw,1.16rem)] leading-relaxed text-zinc-400">
                {aboutContent.bio}
              </p>
            </div>
          </div>

          <div data-about-image-wrap className="about-image-wrap lg:col-span-5 lg:translate-y-10">
            <div className="ml-auto w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-[0_40px_80px_rgba(0,0,0,0.45)] aspect-[3/4] max-w-[28rem]">
              <Image
                ref={imageRef}
                src={aboutContent.portrait.src}
                alt={aboutContent.portrait.alt}
                width={700}
                height={934}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="about-image h-full w-full scale-[1.3] object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {aboutContent.highlights.map((item) => (
            <div key={item.label} data-about-card className="about-card rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200 md:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
