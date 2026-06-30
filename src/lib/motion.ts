export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const cinematicEase = {
  out: "expo.out",
  inOut: "expo.inOut",
  scrub: "none",
} as const;

export const cinematicDuration = {
  fast: 0.45,
  base: 0.8,
  slow: 1.2,
  chapter: 1.6,
} as const;


export const cinematicChapters = [
  {
    id: "hero",
    label: "Boot",
    tone: "#050505",
    palette: { primary: "#ffffff", secondary: "#e2e8f0", tertiary: "#94a3b8" },
  },
  {
    id: "about",
    label: "Signal",
    tone: "#0b0908",
    palette: { primary: "#ff8a3d", secondary: "#f97316", tertiary: "#fcd34d" },
  },
  {
    id: "work",
    label: "Proof",
    tone: "#05070a",
    palette: { primary: "#00f2fe", secondary: "#4facfe", tertiary: "#7dd3fc" },
  },
  {
    id: "projects",
    label: "Missions",
    tone: "#060805",
    palette: { primary: "#b2ff05", secondary: "#00b09b", tertiary: "#74ff00" },
  },
  {
    id: "skills",
    label: "Stack",
    tone: "#070706",
    palette: { primary: "#fcd34d", secondary: "#f97316", tertiary: "#fff7ad" },
  },
  {
    id: "journey",
    label: "Path",
    tone: "#05070a",
    palette: { primary: "#00f2fe", secondary: "#4facfe", tertiary: "#00c6ff" },
  },
  {
    id: "research",
    label: "Frontier",
    tone: "#090608",
    palette: { primary: "#ff4560", secondary: "#ff0844", tertiary: "#ffb199" },
  },
  {
    id: "sports",
    label: "Discipline",
    tone: "#07050a",
    palette: { primary: "#8b5cf6", secondary: "#3b82f6", tertiary: "#c4b5fd" },
  },
  {
    id: "contact",
    label: "Transmit",
    tone: "#080605",
    palette: { primary: "#f97316", secondary: "#ea580c", tertiary: "#fcd34d" },
  },
] as const;


export const cinematicChapterPalettes = cinematicChapters.reduce(
  (palettes, chapter) => {
    palettes[chapter.id] = chapter.palette;
    return palettes;
  },
  {} as Record<(typeof cinematicChapters)[number]["id"], (typeof cinematicChapters)[number]["palette"]>
);

export function getShouldReduceMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(reducedMotionQuery).matches;
}
