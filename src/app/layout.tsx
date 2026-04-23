import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import CustomCursor from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import ScrollCoordinator from "@/components/layout/ScrollCoordinator";
import SmoothScroller from "@/components/layout/SmoothScroller";
import { Preloader } from "@/components/ui/Preloader";
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
  authors: [{ name: "Harshavardhan K" }],
  openGraph: {
    title: "Harshavardhan K | AI Engineer & Full-Stack Architect",
    description:
      "Building AI-powered systems and cinematic web interfaces — where deep engineering meets visual storytelling.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harshavardhan K",
              jobTitle: "AI Engineer & Full-Stack Architect",
              url: "https://harshavardhan.dev",
              sameAs: [
                "https://www.linkedin.com/in/harshavardhan-k-5bb7112b7",
                "https://github.com/Harsha-code-per",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} bg-[#0c0b0a] text-[#f4f0ea] font-sans antialiased overflow-x-hidden`}
        data-preloader-state="loading"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <Preloader />
        <CustomCursor />
        <div id="site-shell" className="relative w-full">
          <main className="relative w-full max-w-full">
            <Navbar />
            <SmoothScroller>{children}</SmoothScroller>
            <ScrollCoordinator />
          </main>
          <Toaster theme="dark" richColors position="bottom-right" />
        </div>
      </body>
    </html>
  );
}
