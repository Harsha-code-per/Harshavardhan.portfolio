"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  const onEnter = useCallback(() => {
    dotRef.current?.classList.add("cursor-hover");
    ringRef.current?.classList.add("cursor-hover");
  }, []);

  const onLeave = useCallback(() => {
    dotRef.current?.classList.remove("cursor-hover");
    ringRef.current?.classList.remove("cursor-hover");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return;
    }

    const SELECTOR = 'a, button, [data-cursor="hover"], input, textarea, [role="button"], [data-magnetic]';

    const bindElement = (el: Element) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    };

    const unbindElement = (el: Element) => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };

    /* Bind existing interactive elements */
    const initialElements = document.querySelectorAll<HTMLElement>(SELECTOR);
    initialElements.forEach(bindElement);

    /* Magnetic effect for data-magnetic elements */
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (el as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left - rect.width / 2;
        const y = mouseEvent.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      });
    });

    /* Observe DOM for dynamically added interactive elements */
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) {
              bindElement(node);
            }
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach(bindElement);
            
            /* Bind magnetic effect to new elements */
            if (node.matches('[data-magnetic]')) {
              node.addEventListener('mousemove', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                const rect = node.getBoundingClientRect();
                const x = mouseEvent.clientX - rect.left - rect.width / 2;
                const y = mouseEvent.clientY - rect.top - rect.height / 2;
                gsap.to(node, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3.out' });
              });
              node.addEventListener('mouseleave', () => {
                gsap.to(node, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
              });
            }
            node.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((magneticEl) => {
              magneticEl.addEventListener('mousemove', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                const rect = magneticEl.getBoundingClientRect();
                const x = mouseEvent.clientX - rect.left - rect.width / 2;
                const y = mouseEvent.clientY - rect.top - rect.height / 2;
                gsap.to(magneticEl, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3.out' });
              });
              magneticEl.addEventListener('mouseleave', () => {
                gsap.to(magneticEl, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
              });
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const onMove = (event: MouseEvent) => {
      mousePos.current.x = event.clientX;
      mousePos.current.y = event.clientY;
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
    };

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
      initialElements.forEach(unbindElement);
    };
  }, [onEnter, onLeave]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
