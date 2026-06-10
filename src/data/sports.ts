export type SportsMetric = {
  label: string;
  value: string;
  percentage: number;
};

export type SportsEntry = {
  title: string;
  level: string;
  summary: string;
  category: "badminton" | "gym";
  highlights: string[];
  metrics: SportsMetric[];
};

export const sportsEntries: SportsEntry[] = [
  {
    title: "Badminton Athlete",
    level: "School Competitive Representative",
    summary:
      "Engineered high-velocity court coverage, agility, and tactical precision as a school-level competitor in both singles and doubles formats.",
    category: "badminton",
    highlights: [
      "School team representative with active tournament play",
      "Specialized in explosive smashes and deception-based net play",
      "Dynamic movement drills including split-step response training"
    ],
    metrics: [
      { label: "Smash Velocity", value: "290 km/h", percentage: 88 },
      { label: "Reaction Time", value: "0.12s", percentage: 95 },
      { label: "Court Coverage", value: "94%", percentage: 94 },
      { label: "Lunge & Reach", value: "91%", percentage: 91 }
    ]
  },
  {
    title: "Gym & Conditioning",
    level: "Strength & Flexibility Routine",
    summary:
      "A systematic regimen focused on progressive overload, joint longevity, core stability, and dynamic flexibility to power athletic performance.",
    category: "gym",
    highlights: [
      "Progressive overload routine focusing on compound movements",
      "Dedicated joint mobility and flexibility routines for injury prevention",
      "Bodyweight control and calisthenics focusing on power-to-weight ratio"
    ],
    metrics: [
      { label: "Power-to-Weight", value: "1.8x Lift Ratio", percentage: 85 },
      { label: "Mobility Index", value: "92% Joint Range", percentage: 92 },
      { label: "Core Stability", value: "95% Balance", percentage: 95 },
      { label: "Flexibility Rating", value: "Elite Class", percentage: 90 }
    ]
  }
];
