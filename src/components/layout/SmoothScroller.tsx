"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import type { ReactNode } from "react";

type SmoothScrollerProps = {
  children: ReactNode;
};

export function SmoothScroller({ children }: SmoothScrollerProps) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children as never}
    </ReactLenis>
  );
}
