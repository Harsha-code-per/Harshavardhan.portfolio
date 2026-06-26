export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  summary: string;
  impact: string;
  stack: string[];
  accent: string;
  repoUrl: string;
  siteUrl: string;
};

export const projects: Project[] = [
  {
    slug: "spectravein",
    title: "Spectravein",
    oneLiner: "Orbital mining intelligence with live NEO analytics.",
    summary:
      "Production-grade orbital intelligence platform combining a Next.js enterprise frontend with a modular FastAPI backend for live NEO analytics, mission economics, and interactive 3D telemetry.",
    impact: "Hardened security with rate limiting, optimized 3D assets with dynamic imports, and live ML ingestion.",
    stack: ["Next.js", "FastAPI", "React Three Fiber", "Python", "Vercel"],
    accent: "from-cyan-400/50 to-indigo-500/40",
    repoUrl: "https://github.com/Harsha-code-per/Spectravein",
    siteUrl: "https://spectravein.vercel.app",
  },
  {
    slug: "securechat",
    title: "SecureChat",
    oneLiner: "Real-time, resilient communication for high-trust collaboration.",
    summary:
      "A modern monorepo for secure, real-time messaging and WebRTC voice/video. Features an offline IndexedDB message queue, End-to-end encryption readiness, and room-scoped JWT auth.",
    impact: "Robust offline resilience with automatic reconnection and exponential backoff ensuring zero message loss.",
    stack: ["Next.js", "Hono", "WebRTC", "PostgreSQL", "Redis", "WebSocket"],
    accent: "from-fuchsia-400/45 to-rose-500/35",
    repoUrl: "https://github.com/Harsha-code-per/SecureChat-nextjs",
    siteUrl: "https://securechat18.app",
  },
  {
    slug: "decode-somnia",
    title: "Decode Somnia",
    oneLiner: "Immersive WebGL narrative about overthinking, release, and rest.",
    summary:
      "A deeply interactive, scroll-driven WebGL experience driven by GSAP and React Three Fiber. Features dynamic anxiety curves that map scroll progress to audio and visual post-processing effects.",
    impact: "Highly optimized rendering pipeline with Zustand state synchronization and seamless Lenis scrolling.",
    stack: ["Next.js", "Three.js", "GSAP", "Zustand", "Howler"],
    accent: "from-emerald-400/45 to-cyan-500/35",
    repoUrl: "https://github.com/Harsha-code-per/decode-somnia",
    siteUrl: "https://decode-somnia.vercel.app",
  },
  {
    slug: "aura",
    title: "Aura",
    oneLiner: "India's Localized Carbon Footprint Platform",
    summary:
      "A full-stack, AI-powered carbon footprint tracker and ecosystem feed built specifically for India. Empowering households to measure, analyze, and offset daily emissions with natural language logs.",
    impact: "Engineered a 6-stage model cascade fallback, offline regex heuristics, and server-side memory caching.",
    stack: ["Next.js", "Firebase", "Gemini", "Tailwind CSS", "Vitest"],
    accent: "from-teal-400/45 to-emerald-500/35",
    repoUrl: "https://github.com/Harsha-code-per/Aura",
    siteUrl: "https://auracarbonai.vercel.app/",
  },
];
