"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

type SmoothScrollerProps = {
  children: ReactNode;
};

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);

  useEffect(() => {
    setupGsap();

    /* Synchronise Lenis with GSAP's ticker so both animation systems share
       a single RAF loop. This eliminates the jank caused by having two
       independent animation frame loops fighting for the same scroll data. */
    function update(time: number) {
      lenisRef.current?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        syncTouch: false,
        touchMultiplier: 2,
        autoResize: true,
        autoRaf: false, // we drive RAF via gsap.ticker
      }}
      ref={(instance: any) => {
        if (instance?.lenis) {
          lenisRef.current = instance.lenis;

          /* Every Lenis scroll event should update ScrollTrigger positions */
          instance.lenis.on("scroll", () => {
            ScrollTrigger.update();
          });
        }
      }}
    >
      {children as unknown as ComponentProps<typeof ReactLenis>["children"]}
    </ReactLenis>
  );
}
