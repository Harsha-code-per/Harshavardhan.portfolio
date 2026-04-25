"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PLACEHOLDER_ADDRESS,
  PRIMARY_EMAIL,
  PROFILE_NAME,
  WHATSAPP_NUMBER,
} from "@/data/profile";
import { gsap, setupGsap } from "@/lib/gsap";

const footerLinks = [
  { href: `mailto:${PRIMARY_EMAIL}`, label: "Email", Icon: FaEnvelope },
  { href: LINKEDIN_URL, label: "LinkedIn", Icon: FaLinkedin },
  { href: GITHUB_URL, label: "GitHub", Icon: FaGithub },
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    label: "WhatsApp",
    Icon: FaWhatsapp,
  },
] as const;

const footerNavLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export function Footer() {
  setupGsap();
  const footerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!footerRef.current) {
        return;
      }

      gsap.from(footerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          invalidateOnRefresh: true,
        },
      });

      /* Magnetic footer links */
      const links = gsap.utils.toArray<HTMLElement>("[data-footer-magnetic]");
      const cleanup: Array<() => void> = [];

      links.forEach((element) => {
        let rafId: number | null = null;

        const onMove = (event: MouseEvent) => {
          // Skip if a RAF is already pending — collapses burst events into one frame
          if (rafId !== null) return;
          rafId = requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.25;
            gsap.to(element, { x, y, duration: 0.4, ease: "power2.out", overwrite: true });
            rafId = null;
          });
        };
        const onLeave = () => {
          if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: true,
          });
        };

        element.addEventListener("mousemove", onMove);
        element.addEventListener("mouseleave", onLeave);

        cleanup.push(() => {
          if (rafId !== null) cancelAnimationFrame(rafId);
          element.removeEventListener("mousemove", onMove);
          element.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => {
        cleanup.forEach((handler) => handler());
      };
    },
    { scope: footerRef, dependencies: [] }
  );

  return (
    <footer
      ref={footerRef}
      className="relative z-20 mt-8 border-t border-[var(--border-default)] py-14"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background text */}
      <p className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 select-none text-center text-[clamp(4rem,10vw,8rem)] font-black uppercase leading-none text-white opacity-[0.03]">
        Available For Work
      </p>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:px-10 lg:px-12">
        <div>
          <p className="font-mono text-lg tracking-[0.2em] text-[var(--accent-primary-light)]">
            HV
          </p>
          <p className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            {PROFILE_NAME}
          </p>
          <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            Building AI-first products and cinematic interfaces with
            production-grade engineering.
          </p>
          <p className="mt-5 text-sm text-[var(--text-muted)]">
            {PRIMARY_EMAIL}
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {PLACEHOLDER_ADDRESS}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          {footerNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor="hover"
              data-footer-magnetic
              className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="md:col-span-2 mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-default)] pt-5 text-sm text-[var(--text-muted)]">
          <p>© 2026 {PROFILE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {footerLinks.map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={label}
                data-cursor="hover"
                className="inline-flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Icon />
                <span>{label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
