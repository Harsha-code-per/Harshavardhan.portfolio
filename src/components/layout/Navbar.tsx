"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, setupGsap } from "@/lib/gsap";

const navigationItems = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Journey", id: "journey" },
  { label: "Research", id: "research" },
  { label: "Sports", id: "sports" },
  { label: "Contact", id: "contact" },
] as const;

export function Navbar() {
  setupGsap();

  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");

  const normalizedPath = useMemo(() => {
    if (!pathname) {
      return "/";
    }

    if (pathname.length > 1 && pathname.endsWith("/")) {
      return pathname.slice(0, -1);
    }

    return pathname;
  }, [pathname]);

  const isHomePage = normalizedPath === "/";

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      router.push(id === "hero" ? "/" : `/#${id}`);
      return;
    }

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      window.history.replaceState(null, "", `#${id}`);
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }
  };

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const syncFromHash = () => {
      const hashSection = window.location.hash.replace("#", "");
      requestAnimationFrame(() => {
        setActiveSection(hashSection || "hero");
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [isHomePage]);

  useGSAP(
    () => {
      if (!isHomePage) {
        return;
      }

      const sectionIds = navigationItems.map((item) => item.id);
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
    { dependencies: [isHomePage] }
  );

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 py-4 md:px-8 md:py-5">
      <div className="pointer-events-none mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-neutral-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-neutral-600 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="pointer-events-auto text-sm text-zinc-950 font-bold tracking-tight md:text-base"
          aria-label="Go to landing page"
        >
          Harshavardhan K
        </button>
        <nav className="pointer-events-auto hidden gap-4 text-[0.68rem] uppercase tracking-[0.15em] lg:flex xl:gap-5 xl:text-xs xl:tracking-[0.18em]">
          {navigationItems.map((item) => {
            const isActive = isHomePage
              ? activeSection === item.id
              : (item.id === "hero" && normalizedPath === "/") ||
                normalizedPath === `/${item.id}`;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={
                  isActive
                    ? "text-zinc-950 font-semibold opacity-100"
                    : "text-neutral-500 hover:text-zinc-900 transition-colors"
                }
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
