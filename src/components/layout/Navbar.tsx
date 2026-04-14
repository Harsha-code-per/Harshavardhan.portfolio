"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navigationItems = [
  "About",
  "Work",
  "Projects",
  "Skills",
  "Journey",
  "Research",
  "Sports",
  "Contact",
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToTop = () => {
    if (pathname !== "/") {
      router.push("/");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const syncFromHash = () => {
      const hashSection = window.location.hash.replace("#", "");
      const nextSection = hashSection || "hero";
      requestAnimationFrame(() => {
        setActiveSection(nextSection);
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (pathname !== "/") {
        return;
      }

      const sectionIds = [
        "hero",
        ...navigationItems.map((item) => item.toLowerCase()),
      ];

      const triggers = sectionIds
        .map((id) => {
          const section = document.getElementById(id);
          if (!section) {
            return null;
          }

          return ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveSection(id),
            onEnterBack: () => setActiveSection(id),
          });
        })
        .filter((trigger): trigger is ScrollTrigger => trigger !== null);

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { dependencies: [pathname] }
  );

  const highlightedSection = pathname === "/" ? activeSection : "";

  return (
    <header className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
      <button
        type="button"
        onClick={scrollToTop}
        className="pointer-events-auto font-bold tracking-tight"
        aria-label="Go to landing page"
      >
        Harshavardhan K
      </button>
      <nav className="pointer-events-auto flex gap-6 text-sm uppercase tracking-widest">
        {navigationItems.map((item) => {
          const sectionId = item.toLowerCase();
          const isActive = highlightedSection === sectionId;

          return (
            <button
              type="button"
              key={item}
              onClick={() => scrollToSection(sectionId)}
              className={
                isActive
                  ? "text-white font-bold opacity-100 transition"
                  : "text-neutral-500 hover:text-white opacity-50 transition"
              }
            >
              {item}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
