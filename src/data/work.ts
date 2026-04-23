export type WorkEntry = {
  period: string;
  role: string;
  organization: string;
  location: string;
  overview: string;
  outcomes: string[];
  technologies: string[];
  themeColor: string;
  image: {
    src: string;
    alt: string;
  };
};

export const workHeaderQuote =
  "Awaiting my first full-time deployment. Available for 2026.";

export const workExperience: WorkEntry[] = [
  {
    period: "Jan 2025 – Apr 2025",
    role: "Full-Stack Engineering Intern",
    organization: "ResPro Labs",
    location: "Chennai, India",
    overview:
      "Designed and shipped an Employee Management System with resilient data flows and recruiter-ready operational dashboards.",
    outcomes: [
      "Architected SQL schemas for attendance, payroll, and employee lifecycle reporting.",
      "Built role-aware admin workflows that reduced manual HR operations.",
      "Delivered polished UI modules for daily management workflows and audit readiness.",
    ],
    technologies: ["TypeScript", "React", "SQL", "Node.js", "REST APIs"],
    themeColor: "#e65f2b",
    image: {
      src: "/self-1-optimized.jpg",
      alt: "ResPro Labs work preview",
    },
  },
  {
    period: "2024 – Present",
    role: "B.Tech, Artificial Intelligence & Data Science",
    organization: "R.M.K. College of Engineering and Technology",
    location: "Chennai, India",
    overview:
      "Focused on bridging machine learning concepts with full-stack deployment and interactive user-facing products.",
    outcomes: [
      "Built AI-leaning projects with end-to-end architecture ownership.",
      "Developed practical strength in production web engineering patterns.",
      "Converted theory-heavy learning tracks into recruiter-ready shipped demos.",
    ],
    technologies: ["Machine Learning", "Data Science", "Python", "Next.js"],
    themeColor: "#eab308",
    image: {
      src: "/icon-512.png",
      alt: "R.M.K. College work preview",
    },
  },
];
