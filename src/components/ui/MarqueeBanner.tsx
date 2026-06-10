"use client";

// Trailing " · " makes the loop seam invisible at the animation reset point
const WORDS =
  "SIGNAL · DISCIPLINE · RESILIENCE · FOCUS · EXECUTION · INTELLIGENCE · PERFORMANCE · ";

export function MarqueeBanner() {
  return (
    /*
     * h-32/h-40 container gives the rotated strip breathing room so neither the
     * Research nor Sports section backgrounds appear to overlap it.
     * overflow-hidden clips the rotated corners cleanly.
     * bg-[var(--bg-base)] fills the space above/below the strip with the page background.
     */
    <div className="relative z-20 my-0 flex h-32 w-full items-center justify-center overflow-hidden bg-[var(--bg-base)] md:h-40">
      {/* Strip is absolutely positioned so it stays centred regardless of container height */}
      <div
        className="pointer-events-none absolute -left-[5vw] w-[110vw] border-y border-black/20 bg-[var(--accent-secondary)] py-3 shadow-2xl"
        style={{ transform: "rotate(-2deg)" }}
      >
        {/* 4 identical spans → seamless translateX(-50%) loop at all viewport widths */}
        <div
          className="flex whitespace-nowrap text-2xl font-black uppercase tracking-[0.1em] text-[var(--bg-base)]"
          style={{ animation: "marquee 20s linear infinite" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>{WORDS}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
