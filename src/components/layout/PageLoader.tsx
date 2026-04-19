"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [, setProgress] = useState(0);

  useGSAP(
    () => {
      if (
        !loaderRef.current ||
        !barRef.current ||
        !textRef.current ||
        !counterRef.current
      ) {
        return;
      }

      document.body.style.overflow = "hidden";

      const counter = counterRef.current;
      const proxy = { val: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          if (loaderRef.current) {
            gsap.set(loaderRef.current, { display: "none" });
          }
        },
      });

      /* Count up from 0 to 100 */
      tl.to(proxy, {
        val: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(proxy.val);
          setProgress(v);
          counter.textContent = `${v}`;
        },
      });

      /* Scale progress bar in sync */
      tl.to(
        barRef.current,
        { scaleX: 1, duration: 1.4, ease: "power2.inOut" },
        0
      );

      /* Fade out text and counter */
      tl.to(
        [textRef.current, counter],
        { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
        "-=0.2"
      );

      /* Collapse bar */
      tl.to(barRef.current, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.5,
        ease: "power2.in",
      });

      /* Slide loader out */
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      });

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: loaderRef, dependencies: [] }
  );

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        ref={textRef}
        className="mb-4 text-sm font-mono uppercase tracking-[0.3em]"
        style={{ color: "var(--text-secondary)" }}
      >
        Harshavardhan K
      </div>
      <div
        ref={counterRef}
        className="mb-8 font-mono text-4xl font-black tracking-wider text-[var(--accent-primary-light)]"
      >
        0
      </div>
      <div
        className="h-[1px] w-48 overflow-hidden"
        style={{ background: "var(--border-hover)" }}
      >
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{
            background:
              "linear-gradient(to right, var(--accent-primary), var(--accent-tertiary))",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
