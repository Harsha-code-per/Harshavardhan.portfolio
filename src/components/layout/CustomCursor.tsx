"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 pointer-events-none z-[9999999]"
      style={{ transform: "translate(-2px, -2px)" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="var(--accent-primary)"
        stroke="white"
        strokeWidth="1.5"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
      >
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" />
      </svg>
    </div>
  );
}
