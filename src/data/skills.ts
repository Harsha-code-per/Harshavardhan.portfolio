export type SkillCategory = {
  title: string;
  description: string;
  technologies: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Architecture",
    description: "Design systems, app architecture, and high-quality production interfaces.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "App Router"],
  },
  {
    title: "Motion & Immersive UI",
    description: "Narrative-driven motion systems and high-fidelity visual choreography.",
    technologies: ["GSAP", "ScrollTrigger", "Framer Motion", "Lenis", "Three.js", "WebGL"],
  },
  {
    title: "AI & Data Science",
    description: "Practical ML pipelines, data processing, and large language model integration.",
    technologies: ["Python", "Machine Learning", "Data Science", "LLMs", "RAG", "Data Pipelines"],
  },
  {
    title: "Cloud & Systems",
    description: "Scalable infrastructure, serverless architectures, and reliable execution environments.",
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Backend & Dev Workflow",
    description: "Secure real-time product capabilities and disciplined shipping workflows.",
    technologies: ["Java", "Node.js", "REST APIs", "WebRTC", "Arch Linux", "Git"],
  },
];

export const engineeringSkills = skillCategories;
