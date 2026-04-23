export type Project = {
  slug: string;
  title: string;
  role: string;
  oneLiner: string;
  summary: string;
  impact: string;
  stack: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "spectravein",
    title: "Spectravein",
    role: "Lead AI Systems Engineer",
    oneLiner: "Asteroid intelligence platform for decision-grade mining insights.",
    summary:
      "Built an AI-assisted exploration system combining data pipelines, orbital analytics, and immersive visual narratives for high-context scientific decisions.",
    impact: "Improved signal-to-noise in exploration insight workflows with faster analytical iteration.",
    stack: ["Python", "ML Pipelines", "Data Visualization", "Next.js", "GSAP"],
    accent: "from-[#e65f2b]/50 to-[#eab308]/35",
  },
  {
    slug: "securechat",
    title: "SecureChat",
    role: "Security-First Full-Stack Engineer",
    oneLiner: "Resilient real-time communication for high-trust collaboration.",
    summary:
      "Engineered a secure messaging experience with hardened auth flows, robust real-time delivery, and privacy-aware communication patterns.",
    impact: "Reduced friction in secure collaboration while preserving reliability under load.",
    stack: ["WebRTC", "TypeScript", "JWT", "Realtime Systems", "Tailwind CSS"],
    accent: "from-[#eab308]/45 to-[#e65f2b]/35",
  },
  {
    slug: "ems-ops",
    title: "EMS Operations Platform",
    role: "Product & Platform Engineer",
    oneLiner: "Scalable employee management workflows with real-time reporting.",
    summary:
      "Implemented a full-stack operations dashboard for HR and workforce processes, with query-level optimizations and data confidence tooling.",
    impact: "Accelerated day-to-day reporting and improved consistency in administrative operations.",
    stack: ["SQL", "Backend Services", "React", "Analytics", "Workflow Design"],
    accent: "from-[#c08457]/45 to-[#eab308]/35",
  },
];
