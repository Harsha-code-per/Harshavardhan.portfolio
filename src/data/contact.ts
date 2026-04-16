import {
  GITHUB_URL,
  LINKEDIN_URL,
  PRIMARY_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/data/profile";

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  external: boolean;
};

export type ContactContent = {
  title: string;
  description: string;
  availability: string;
  links: ContactLink[];
};

export const contactContent: ContactContent = {
  title: "Let’s Build Something Outstanding",
  description:
    "I collaborate on AI-powered products, high-performance interfaces, and full-stack systems engineered for measurable impact.",
  availability: "Open to internships, freelance builds, and full-time engineering opportunities.",
  links: [
    {
      label: "Email",
      value: PRIMARY_EMAIL,
      href: `mailto:${PRIMARY_EMAIL}`,
      external: false,
    },
    {
      label: "LinkedIn",
      value: "Connect professionally",
      href: LINKEDIN_URL,
      external: true,
    },
    {
      label: "GitHub",
      value: "Explore source projects",
      href: GITHUB_URL,
      external: true,
    },
    {
      label: "WhatsApp",
      value: WHATSAPP_DISPLAY,
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      external: true,
    },
  ],
};
