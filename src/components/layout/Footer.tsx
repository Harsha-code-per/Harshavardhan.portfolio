"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Mail, MessageCircle } from "lucide-react";

const GithubIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.39-3.5 4.9 4.9 0 0 0-.13-3.4s-1.14-.36-3.7 1.36a12.5 12.5 0 0 0-6.8 0c-2.56-1.72-3.7-1.36-3.7-1.36a4.9 4.9 0 0 0-.13 3.4A5.2 5.2 0 0 0 3 12.04c0 5.22 3 6.42 6 6.76a4.8 4.8 0 0 0-1 3.24v4" />
  </svg>
);

const LinkedinIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PRIMARY_EMAIL,
  PROFILE_NAME,
  WHATSAPP_NUMBER,
} from "@/data/profile";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

const footerLinks = [
  { href: `mailto:${PRIMARY_EMAIL}`, label: "Email", Icon: Mail },
  { href: LINKEDIN_URL, label: "LinkedIn", Icon: LinkedinIcon },
  { href: GITHUB_URL, label: "GitHub", Icon: GithubIcon },
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, label: "WhatsApp", Icon: MessageCircle },
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
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-primary-light)]">
            End Of Transmission
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.7rem)] font-black uppercase leading-[0.82] text-white">
            {PROFILE_NAME}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
            AI-first products, cinematic interfaces, and production-minded engineering.
          </p>
        </div>

        <div data-footer-reveal className="hud-panel rounded-md p-5 md:w-[22rem]">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
            Signal Status
          </p>
          <p className="mt-3 text-2xl font-black uppercase leading-tight text-[var(--accent-primary-light)]">
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
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 text-sm text-white/44 transition-all duration-200 hover:text-white hover:-translate-y-0.5 hover:scale-105 motion-reduce:transform-none"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
