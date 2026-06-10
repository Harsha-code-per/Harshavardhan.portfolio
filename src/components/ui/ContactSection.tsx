"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { 
  RadioTower, 
  Mail, 
  MessageSquare, 
  Send, 
  Cpu, 
  ShieldCheck, 
  Globe 
} from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { contactContent } from "@/data/contact";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicEase } from "@/lib/motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotion";

// Custom SVG Brand Icons since they are missing/renamed in this Lucide version
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

export function ContactSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.from("[data-contact-reveal]", {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 38,
        duration: prefersReducedMotion ? 0.01 : 0.78,
        stagger: prefersReducedMotion ? 0 : 0.08,
        ease: cinematicEase.out,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          invalidateOnRefresh: true,
        },
      });

      const links = gsap.utils.toArray<HTMLElement>("[data-magnetic-link]", section);
      const cleanup: Array<() => void> = [];

      links.forEach((element) => {
        let rafId: number | null = null;

        const onMove = (event: MouseEvent) => {
          if (prefersReducedMotion || rafId !== null) return;
          rafId = requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
            gsap.to(element, { x, y, duration: 0.35, ease: "power2.out", overwrite: true });
            rafId = null;
          });
        };

        const onLeave = () => {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
        };

        element.addEventListener("mousemove", onMove);
        element.addEventListener("mouseleave", onLeave);
        cleanup.push(() => {
          if (rafId !== null) cancelAnimationFrame(rafId);
          element.removeEventListener("mousemove", onMove);
          element.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanup.forEach((handler) => handler());
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  // Helper to get matching icon for contact labels
  const getContactIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4" />;
      case "github":
        return <GithubIcon className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full scroll-mt-24 flex-col justify-center overflow-hidden px-[clamp(1rem,5vw,4rem)] py-20 text-white"
      style={{
        background:
          "radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--accent-primary) 18%, transparent), transparent 58%), radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--accent-tertiary) 10%, transparent), transparent 34%), var(--bg-base)",
      }}
    >
      <div className="cinematic-grid pointer-events-none absolute inset-0 opacity-[0.16]" />
      
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 lg:block">
        <span className="absolute inset-[18%] rounded-full border border-white/5" />
        <span className="absolute inset-[36%] rounded-full border border-[var(--accent-primary)]/20" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        
        {/* Left Side Panel: Transceiver Details */}
        <div data-contact-reveal className="flex min-h-[38rem] flex-col justify-between rounded-md border border-white/10 bg-black/36 p-6 backdrop-blur-md md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.045]">
                <RadioTower className="h-5 w-5 text-[var(--accent-primary-light)] animate-pulse" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent-primary-light)]">
                Secure Transmission
              </p>
            </div>
            
            <h2 className="mt-8 max-w-[9ch] text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.78] text-white">
              Send The Signal
            </h2>
            
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/62 md:text-lg">
              {contactContent.description}
            </p>
            
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--accent-primary)]/70 font-mono">
              {contactContent.availability}
            </p>

            {/* Transmitter Diagnostics Log Box */}
            <div className="mt-8 border border-white/5 bg-white/[0.01] rounded-sm p-4 font-mono text-[10px] space-y-2.5 text-white/40">
              <div className="flex justify-between border-b border-white/5 pb-2 text-white/60">
                <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /> TELEMETRY SOURCE</span>
                <span>HARSHA-TX-09</span>
              </div>
              <div className="flex justify-between">
                <span>CONNECTION SECURITY</span>
                <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> SSL-SHIELDED</span>
              </div>
              <div className="flex justify-between">
                <span>DEFAULT TARGET PORT</span>
                <span className="text-[var(--accent-primary-light)]">443 / HTTPS</span>
              </div>
              <div className="flex justify-between">
                <span>ROUTING PROTOCOL</span>
                <span>RESEND QUANTUM ACTION</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3">
            {contactContent.links.map((link) => (
              <a
                key={link.label}
                data-contact-reveal
                data-magnetic-link
                data-cursor="hover"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group flex min-h-14 min-w-0 flex-col items-start justify-center gap-1 rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/[0.01] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0"
              >
                <span className="inline-flex shrink-0 items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/78">
                  {getContactIcon(link.label)}
                  {link.label}
                </span>
                <span className="block max-w-full truncate text-left text-xs uppercase tracking-[0.14em] text-white/40 group-hover:text-[var(--accent-primary-light)] sm:text-right transition-colors">
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Panel: Contact Console */}
        <div data-contact-reveal className="rounded-md border border-white/10 bg-black/48 p-5 shadow-[0_34px_120px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-white/38">
                  Transceiver Console
                </p>
                <p className="mt-2 text-xl font-black uppercase text-white">Mission Brief</p>
              </div>
              <Send className="h-5 w-5 text-[var(--accent-primary-light)]" />
            </div>
            
            <ContactForm />
          </div>
        </div>

      </div>
    </section>
  );
}
