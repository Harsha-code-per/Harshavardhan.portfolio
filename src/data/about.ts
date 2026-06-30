export type AboutHighlight = {
  label: string;
  value: string;
};

export type AboutContent = {
  title: string;
  statement: string;
  bio: string;
  highlights: AboutHighlight[];
};

export const aboutContent: AboutContent = {
  title: "Turning Deep Engineering Into Memorable Products",
  statement:
    "I build intelligent digital systems at the intersection of AI, machine learning, and high-performance full-stack architecture.",
  bio: "My work blends product intuition with systems thinking: prototype quickly, validate rigorously, and ship interfaces that feel cinematic without sacrificing reliability.",
  highlights: [
    { label: "Current Focus", value: "AI-first products with immersive front-end architecture" },
    { label: "Strength", value: "End-to-end execution from model logic to polished UI delivery" },
    { label: "Approach", value: "Measurable impact, resilient architecture, and performance-first motion" },
  ],
};
