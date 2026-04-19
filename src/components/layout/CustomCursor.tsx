"use client";

import { useEffect, useRef, useCallback } from "react";

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

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return;
    }

    const SELECTOR = 'a, button, [data-cursor="hover"], input, textarea, [role="button"]';

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

    /* Observe DOM for dynamically added interactive elements */
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(SELECTOR)) {
              bindElement(node);
            }
            node.querySelectorAll<HTMLElement>(SELECTOR).forEach(bindElement);
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
