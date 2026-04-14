import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroller } from "@/components/layout/SmoothScroller";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Harshavardhan K | AI & Full Stack Engineer",
  description:
    "Specializing in Artificial Intelligence, Machine Learning, and High-Performance Web Architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body
        className={`${spaceGrotesk.variable} font-sans bg-[#050505] text-neutral-50 antialiased overflow-x-hidden`}
      >
        <Navbar />
        <SmoothScroller>{children}</SmoothScroller>
      </body>
    </html>
  );
}
