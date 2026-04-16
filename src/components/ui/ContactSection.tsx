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
        },
      });

      gsap.from("[data-contact-link]", {
        opacity: 0,
        x: -24,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 66%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f5eddf] px-6 pb-24 pt-20 md:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute -right-10 top-8 h-44 w-44 rounded-full bg-violet-200/25 blur-3xl" />
      <div
        data-contact-shell
        className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 rounded-3xl border border-[#e3d2bc] bg-white/92 p-7 shadow-[0_24px_62px_-40px_rgba(79,56,36,0.45)] md:grid-cols-2 md:gap-10 md:p-10"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-600/75">Contact</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4.6vw,3.4rem)] font-black uppercase leading-[0.95] tracking-tight text-zinc-900">
            {contactContent.title}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-zinc-700 md:text-base">{contactContent.description}</p>
          <p className="mt-4 text-sm text-zinc-600">{contactContent.availability}</p>

          <div className="mt-7 space-y-3">
            {contactContent.links.map((link) => (
              <a
                key={link.label}
                data-contact-link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-xl border border-[#eadbc6] bg-[#f9f4eb] px-4 py-3 transition hover:border-violet-300/55"
              >
                <span className="text-sm font-medium text-zinc-900">{link.label}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-zinc-600">{link.value}</span>
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
