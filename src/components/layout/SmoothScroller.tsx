"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef, useCallback, type ComponentProps, type ReactNode } from "react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

type SmoothScrollerProps = {
  children: ReactNode;
};

type LenisInstance = InstanceType<typeof import("lenis").default>;
type LenisRefApi = { lenis?: LenisInstance | null };

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const lenisRef = useRef<LenisInstance | null>(null);

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

    /* Centralized refresh once fonts are loaded */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  const setLenisRef = useCallback((instance: LenisRefApi | null) => {
    const lenis = instance?.lenis;
    if (lenis && lenis !== lenisRef.current) {
      if (lenisRef.current) {
        lenisRef.current.off("scroll", ScrollTrigger.update);
      }
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
    }
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        // Lenis v1 uses `syncTouch`; false is equivalent to disabling smoothTouch.
        syncTouch: false,
        touchMultiplier: 2,
        autoResize: true,
        autoRaf: false, // we drive RAF via gsap.ticker
      }}
      ref={setLenisRef}
    >
      {children as unknown as ComponentProps<typeof ReactLenis>["children"]}
    </ReactLenis>
  );
}
