export type WorkEntry = {
  period: string;
  role: string;
  organization: string;
  location: string;
  overview: string;
  outcomes: string[];
  technologies: string[];
};

export const workExperience: WorkEntry[] = [
  {
    period: "2025",
    role: "Full-Stack Engineering Intern",
    organization: "ResPro Labs",
    location: "Chennai, India",
    overview:
      "Designed and shipped an Employee Management System with scalable data architecture and reporting surfaces.",
    outcomes: [
      "Implemented SQL schema patterns for efficient operational reporting.",
      "Improved reliability of HR data workflows by tightening validation paths.",
      "Delivered production-focused UI flows for daily admin tasks.",
    ],
    technologies: ["TypeScript", "React", "SQL", "REST APIs"],
  },
  {
    period: "2024 - Present",
    role: "B.Tech, Artificial Intelligence & Data Science",
    organization: "R.M.K. College of Engineering and Technology",
    location: "Chennai, India",
    overview:
      "Focused on bridging machine learning concepts with full-stack deployment and interactive user-facing products.",
    outcomes: [
      "Built AI-leaning projects with end-to-end architecture ownership.",
      "Developed practical strength in production web engineering patterns.",
    ],
    technologies: ["Machine Learning", "Data Science", "Python", "Next.js"],
  },
];
