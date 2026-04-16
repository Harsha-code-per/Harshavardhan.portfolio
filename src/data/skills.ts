export type SkillCategory = {
  title: string;
  description: string;
  technologies: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend & Architecture",
    description: "Design systems, app architecture, and high-quality production interfaces.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "App Router"],
  },
  {
    title: "Motion & Immersive UI",
    description: "Narrative-driven motion systems and high-fidelity visual choreography.",
    technologies: ["GSAP", "ScrollTrigger", "Framer Motion", "Lenis", "SplitType", "Spline"],
  },
  {
    title: "Backend, AI & Real-Time",
    description: "Practical AI pipelines and secure real-time product capabilities.",
    technologies: ["Python", "Java", "C++", "Machine Learning", "REST APIs", "WebRTC"],
  },
  {
    title: "Systems & Dev Workflow",
    description: "Reliable execution environments and disciplined shipping workflows.",
    technologies: ["Arch Linux", "Git", "Bash/Zsh", "CI/CD", "Debugging"],
  },
  {
    title: "Cloud & Product Delivery",
    description: "Translating engineering effort into recruiter-visible outcomes.",
    technologies: ["Performance Optimization", "SEO Fundamentals", "Accessibility", "Analytics Thinking"],
  },
];

export const engineeringSkills = skillCategories;
