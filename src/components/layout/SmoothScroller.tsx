"use client";

import { ReactLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState, createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

type SmoothScrollerProps = {
  children: ReactNode;
};

type LenisInstance = InstanceType<typeof import("lenis").default>;
type LenisRefApi = { lenis?: LenisInstance | null };

const LenisContext = createContext<LenisInstance | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const handleLenisScroll = useCallback(() => {
    ScrollTrigger.update();
  }, []);

  useEffect(() => {
    setupGsap();
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);

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
      mediaQuery.removeEventListener("change", applyPreference);
      if (lenisRef.current) {
        lenisRef.current.off("scroll", handleLenisScroll);
      }
    };
  }, [handleLenisScroll]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      <ReactLenis
      root
      options={{
        lerp: prefersReducedMotion ? 0.25 : 0.08,
        duration: prefersReducedMotion ? 0.8 : 1.4,
        smoothWheel: !prefersReducedMotion,
        syncTouch: false,
        touchMultiplier: prefersReducedMotion ? 1.2 : 2,
        autoResize: true,
        autoRaf: false,
        infinite: false,
      }}
      ref={(instance: LenisRefApi | null) => {
        const lenis = instance?.lenis;
        if (lenisRef.current === lenis) {
          return;
        }

        if (lenisRef.current) {
          lenisRef.current.off("scroll", handleLenisScroll);
        }

        lenisRef.current = lenis ?? null;

        if (lenis) {
          lenis.on("scroll", handleLenisScroll);
        }
      }}
      >
        {children as unknown as ComponentProps<typeof ReactLenis>["children"]}
      </ReactLenis>
    </LenisContext.Provider>
  );
}
