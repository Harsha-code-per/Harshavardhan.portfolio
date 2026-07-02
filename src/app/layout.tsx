import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import SmoothScroller from "@/components/layout/SmoothScroller";
import { Preloader } from "@/components/ui/Preloader";
import { GITHUB_URL, LINKEDIN_URL, PROFILE_NAME, SITE_URL } from "@/data/profile";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Harshavardhan K | AI Engineer & Full-Stack Architect",
  description:
    "AI Engineer and Full-Stack Architect specializing in intelligent systems, cinematic web interfaces, and high-performance application architecture.",
  keywords: [
    "AI Engineer",
    "Full-Stack Developer",
    "Machine Learning",
    "Next.js",
    "React",
    "Portfolio",
    "Harshavardhan",
  ],
  authors: [{ name: PROFILE_NAME }],
  openGraph: {
    title: "Harshavardhan K | AI Engineer & Full-Stack Architect",
    description:
      "Building AI-powered systems and cinematic web interfaces — where deep engineering meets visual storytelling.",
    url: SITE_URL,
    type: "website",
    locale: "en_US",
    siteName: "Harshavardhan K Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshavardhan K | AI Engineer & Full-Stack Architect",
    description:
      "Building AI-powered systems and cinematic web interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        {/* Prevent mobile browsers from auto-scaling — we handle scaling ourselves */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: PROFILE_NAME,
              jobTitle: "AI Engineer & Full-Stack Architect",
              url: SITE_URL,
              sameAs: [
                LINKEDIN_URL,
                GITHUB_URL,
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} bg-[#0a0a0f] text-[#f8fafc] font-sans antialiased overflow-x-hidden`}
      >
        <Preloader />
        <div className="relative z-10">
          <SmoothScroller>{children}</SmoothScroller>
        </div>
        <div className="relative z-[9999]">
          <Navbar />
        </div>
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
