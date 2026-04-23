export type ChapterTheme = {
  id: string;
  label: string;
  bg: string;
  surface: string;
  accent: string;
  accentAlt: string;
  ink: string;
};

export const chapterThemes: ChapterTheme[] = [
  {
    id: "hero",
    label: "Intro",
    bg: "#090807",
    surface: "#121110",
    accent: "#e65f2b",
    accentAlt: "#eab308",
    ink: "#f4f0ea",
  },
  {
    id: "about",
    label: "About",
    bg: "#11100f",
    surface: "#171513",
    accent: "#c08457",
    accentAlt: "#e65f2b",
    ink: "#f4f0ea",
  },
  {
    id: "work",
    label: "Work",
    bg: "#0c0b0a",
    surface: "#121110",
    accent: "#e65f2b",
    accentAlt: "#eab308",
    ink: "#f4f0ea",
  },
  {
    id: "projects",
    label: "Projects",
    bg: "#12100e",
    surface: "#181613",
    accent: "#eab308",
    accentAlt: "#c08457",
    ink: "#f4f0ea",
  },
  {
    id: "skills",
    label: "Skills",
    bg: "#11100e",
    surface: "#171412",
    accent: "#c08457",
    accentAlt: "#e65f2b",
    ink: "#f4f0ea",
  },
  {
    id: "journey",
    label: "Journey",
    bg: "#110f0d",
    surface: "#171412",
    accent: "#e65f2b",
    accentAlt: "#c08457",
    ink: "#f4f0ea",
  },
  {
    id: "research",
    label: "Research",
    bg: "#13110f",
    surface: "#191613",
    accent: "#c08457",
    accentAlt: "#eab308",
    ink: "#f4f0ea",
  },
  {
    id: "sports",
    label: "Sports",
    bg: "#11100f",
    surface: "#171412",
    accent: "#eab308",
    accentAlt: "#e65f2b",
    ink: "#f4f0ea",
  },
  {
    id: "contact",
    label: "Contact",
    bg: "#0f0e0c",
    surface: "#151210",
    accent: "#e65f2b",
    accentAlt: "#eab308",
    ink: "#f4f0ea",
  },
];

export const chapterThemeById = Object.fromEntries(
  chapterThemes.map((theme) => [theme.id, theme])
) as Record<string, ChapterTheme>;
