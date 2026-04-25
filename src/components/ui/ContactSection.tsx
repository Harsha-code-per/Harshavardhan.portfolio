"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ContactForm } from "@/components/ui/ContactForm";
import { contactContent } from "@/data/contact";
import { gsap, setupGsap } from "@/lib/gsap";

export function ContactSection() {
  setupGsap();

  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from("[data-contact-shell]", {
        opacity: 0,
        y: 42,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          invalidateOnRefresh: true,
        },
      });

      gsap.from("[data-contact-link-row]", {
        opacity: 0,
        x: -24,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 66%",
          invalidateOnRefresh: true,
        },
      });

      /* Magnetic links */
      const links = gsap.utils.toArray<HTMLElement>("[data-magnetic-link]");
      const leaveHandlers: Array<() => void> = [];

      links.forEach((element) => {
        let rafId: number | null = null;

        const onMove = (event: MouseEvent) => {
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
        leaveHandlers.push(() => {
          if (rafId !== null) cancelAnimationFrame(rafId);
          element.removeEventListener("mousemove", onMove);
          element.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => {
        leaveHandlers.forEach((cleanup) => cleanup());
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col justify-center px-[clamp(1rem,5vw,4rem)] py-20 overflow-hidden"
      style={{ 
        backgroundColor: "var(--bg-base)",
        backgroundImage: "radial-gradient(circle at 50% 100%, var(--accent-primary-subtle) 0%, transparent 70%)"
      }}
    >
      <div
        data-contact-shell
        className="animated-border mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 rounded-3xl bg-[var(--bg-surface)] p-7 md:grid-cols-2 md:gap-10 md:p-10"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent-primary-light)]">
            Contact
          </p>
          <h2 className="mt-3 text-[clamp(2.5rem,5vw,5rem)] font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Let&apos;s Build Something.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            {contactContent.description}
          </p>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            {contactContent.availability}
          </p>

          <div className="mt-7 space-y-3">
            {contactContent.links.map((link) => (
              <a
                key={link.label}
                data-contact-link-row
                data-magnetic-link
                data-cursor="hover"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3 transition-all hover:border-[var(--accent-primary)] hover:shadow-[0_0_20px_var(--accent-primary-glow)]"
              >
                <span className="text-base font-medium text-[var(--text-primary)]">
                  {link.label}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-primary-light)]">
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
