"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

type SmoothScrollerProps = {
  children: ReactNode;
};

export function SmoothScroller({ children }: SmoothScrollerProps) {
  useEffect(() => {
    setupGsap();

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
