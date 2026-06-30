"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Mail } from "lucide-react";

import {
  GITHUB_URL,
  LINKEDIN_URL,
  PRIMARY_EMAIL,
  PROFILE_NAME,
} from "@/data/profile";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

const GithubIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const footerLinks = [
  { href: `mailto:${PRIMARY_EMAIL}`, label: "Email", Icon: Mail },
  { href: LINKEDIN_URL, label: "LinkedIn", Icon: LinkedinIcon },
  { href: GITHUB_URL, label: "GitHub", Icon: GithubIcon },
] as const;

export function Footer() {
  setupGsap();

  const footerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      gsap.from("[data-footer-reveal]", {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 34,
        duration: prefersReducedMotion ? 0.01 : 0.82,
        stagger: prefersReducedMotion ? 0 : 0.08,
        ease: cinematicEase.out,
        scrollTrigger: {
          trigger: footer,
          start: "top 86%",
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: footerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <footer
      ref={footerRef}
      className="relative z-20 overflow-hidden border-t border-white/10 px-[clamp(1rem,5vw,4rem)] py-12 text-white"
      style={{ background: "var(--bg-base)" }}
    >
      <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 select-none text-center text-[clamp(3.7rem,13vw,11rem)] font-black uppercase leading-none text-white opacity-[0.035]">
        Available
      </p>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div data-footer-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent-primary-light">
            End Of Transmission
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.7rem)] font-black uppercase leading-[0.82] text-white">
            {PROFILE_NAME}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
            AI-first products, cinematic interfaces, and production-minded engineering.
          </p>
        </div>

        <div data-footer-reveal className="hud-panel rounded-md p-5 md:w-88">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
            Signal Status
          </p>
          <p className="mt-3 text-2xl font-black uppercase leading-tight text-accent-primary-light">
            Available For First Team
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/50">
            Open to internships, fresher roles, and product teams that value speed,
            clarity, and craft.
          </p>
        </div>

        <div data-footer-reveal className="border-t border-white/10 pt-5 md:col-span-2">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/38">© 2026 {PROFILE_NAME}. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              {footerLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={label}
                  title={label}
                  data-cursor="hover"
                  className="inline-flex items-center justify-center p-2.5 rounded-full border border-white/5 bg-white/2 text-white/44 transition-all duration-200 hover:text-accent-primary-light hover:border-accent-primary/30 hover:bg-accent-primary/5 hover:-translate-y-0.5 hover:scale-105 motion-reduce:transform-none"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
