export type ResearchEntry = {
  title: string;
  area: string;
  summary: string;
  status: string;
  tags: string[];
};

export const researchEntries: ResearchEntry[] = [
  {
    title: "Intelligent UAV Security Surveillance",
    area: "IoT + Computer Vision",
    summary:
      "Studied UAV-based 360° surveillance systems with IoT integration for robust aerial monitoring workflows.",
    status: "Published Workstream",
    tags: ["UAV", "IoT", "Security", "Applied AI"],
  },
  {
    title: "AI-Enhanced Product Interfaces",
    area: "Human-Centered AI Experiences",
    summary:
      "Exploring design patterns that convert complex model outputs into intuitive, recruiter-friendly interaction systems.",
    status: "Active Exploration",
    tags: ["AI UX", "Interaction Design", "Explainability"],
  },
  {
    title: "Performance-First Motion Systems",
    area: "Front-End Architecture",
    summary:
      "Investigating animation orchestration strategies that preserve smoothness under dense scroll and layered visual effects.",
    status: "Continuous R&D",
    tags: ["GSAP", "Rendering", "Core Web Vitals"],
  },
];
