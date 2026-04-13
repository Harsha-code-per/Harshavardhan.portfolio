// src/data/skills.ts

export type SkillCategory = {
  title: string;
  technologies: string[];
};

export const engineeringSkills: SkillCategory[] = [
  {
    title: "Frontend & Architecture",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Aceternity UI"],
  },
  {
    title: "WebGL & Motion Engineering",
    technologies: ["Three.js", "React Three Fiber", "GSAP", "Framer Motion", "Lenis Smooth Scroll"],
  },
  {
    title: "Backend, AI & Real-Time",
    technologies: ["Python", "Java","C++", "WebRTC", "REST API Integration"],
  },
  {
    title: "Systems & Dev Workflow",
    technologies: ["Arch Linux", "Bash/Zsh", "Git"],
  },
  {
    title: "Domain Knowledge",
    technologies: ["Artificial Intelligence", "Data Science", "Machine Learning"],
  }
];