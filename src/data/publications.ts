export type Publication = {
  year: string;
  title: string;
  publisher: string;
  summary: string;
  url?: string;
};

export const publications: Publication[] = [
  {
    year: "Oct 15th - 17th 2025",
    title: "Development of an IoT-based UAV Platform for Intelligent 360° Aerial Security Surveillance",
    publisher: "Academic Publication",
    summary:
      "Presented an integrated architecture combining aerial imaging, IoT connectivity, and intelligent surveillance behaviors.",
    url: "https://ieeexplore.ieee.org/document/11308390",
  },
];
