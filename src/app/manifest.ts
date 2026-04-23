import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Harshavardhan K - AI & Full Stack Engineer",
    short_name: "HV Portfolio",
    description: "AI, ML & Full Stack Engineer portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b0a",
    theme_color: "#e65f2b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
