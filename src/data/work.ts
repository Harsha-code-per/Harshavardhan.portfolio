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
    period: "Dec 2025 - Apr 2026",
    role: "AI Engineer Intern",
    organization: "Zensphere Academy",
    location: "Online",
    overview:
      "Engineered interactive voice agents using LiveKit and Azure AI Foundry, integrating LLMs to automate complex speaking assessments and real-time linguistic feedback.",
    outcomes: [
      "Integrated Azure AI Pronunciation Assessment for high-accuracy phonetic analysis and model optimization.",
      "Deployed scalable AI features within Next.js frameworks.",
      "Ensured platform stability via Playwright E2E testing."
    ],
    technologies: ["LiveKit", "Azure AI", "LLMs", "Next.js", "Django", "Playwright"],
  },
  {
    period: "June 2nd - 25th 2025",
    role: "Intern",
    organization: "ResPro Labs",
    location: "Chennai",
    overview:
      "Engineered a modular Employee Management System (EMS) using SQL for real-time data analysis and reporting.",
    outcomes: [
      "Streamlined HR processes by developing automated features for onboarding and attendance tracking.",
      "Implemented highly efficient database schemas for robust operational reporting."
    ],
    technologies: ["SQL", "Relational Databases", "Data Architecture"],
  },
];
