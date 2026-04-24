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
    period: "2024",
    role: "Full-Stack Developer Intern",
    organization: "Zensphere Academy",
    location: "Chennai, India",
    overview:
      "Engineered an interactive e-learning platform focusing on seamless user experience and scalable backend architecture.",
    outcomes: [
      "Architected dynamic course delivery modules using React and Next.js.",
      "Optimized API response times for heavy media streaming workflows.",
      "Integrated secure authentication and role-based access controls.",
    ],
    technologies: ["React", "Next.js", "Node.js", "MongoDB"],
  },
];
