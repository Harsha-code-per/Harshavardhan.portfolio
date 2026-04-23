"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, setupGsap, gsap } from "@/lib/gsap";
import { useLenis } from "./SmoothScroller";

export default function ScrollCoordinator() {
  const pathname = usePathname();
  const lenis = useLenis();
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    setupGsap();

    /* Velocity-driven skew effect */
    const skewSetter = gsap.quickTo('[data-skew]', 'skewY', { duration: 0.8, ease: 'power3' });
    const clamp = gsap.utils.clamp(-6, 6);
    let ticking = false;

    const onScroll = () => {
      if (ticking && lenis) {
        const velocity = lenis.velocity;
        skewSetter(clamp(-velocity / 600));
      }
    };

    const handleScrollStart = () => {
      ticking = true;
    };

    const handleScrollEnd = () => {
      skewSetter(0);
      ticking = false;
    };

    ScrollTrigger.addEventListener('scrollStart', handleScrollStart);
    ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd);
    gsap.ticker.add(onScroll);

    const scheduleRefresh = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });

      timeoutRef.current = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    };

    // Removed ResizeObserver on site-shell to prevent infinite loop with ScrollTrigger.refresh()

    const handleLoad = () => {
      scheduleRefresh();
    };

    const handlePreloaderComplete = () => {
      scheduleRefresh();
    };

    const handleResize = () => {
      scheduleRefresh();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh();
      }
    };

    window.addEventListener("load", handleLoad, { once: true });
    window.addEventListener("preloaderComplete", handlePreloaderComplete);
    document.addEventListener("visibilitychange", handleVisibility);

    if (document.fonts?.ready) {
      void document.fonts.ready.then(scheduleRefresh);
    }

    scheduleRefresh();

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      gsap.ticker.remove(onScroll);
      ScrollTrigger.removeEventListener('scrollStart', handleScrollStart);
      ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd);
      // resizeObserverRef.current?.disconnect();
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname, lenis]);

  return null;
}
