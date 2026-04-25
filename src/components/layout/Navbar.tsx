"use client";

import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap, setupGsap } from "@/lib/gsap";

const navigationItems = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Journey", id: "journey" },
  { label: "Research", id: "research" },
  { label: "Sports", id: "sports" },
  { label: "Contact", id: "contact" },
] as const;

const sectionPalettes: Record<string, { primary: string; secondary: string; tertiary: string; }> = {
  hero: { primary: "#ffffff", secondary: "#e2e8f0", tertiary: "#94a3b8" },
  about: { primary: "#ff00ff", secondary: "#4a00e0", tertiary: "#b000ff" },
  work: { primary: "#00f2fe", secondary: "#4facfe", tertiary: "#00c6ff" },
  projects: { primary: "#b2ff05", secondary: "#00b09b", tertiary: "#74ff00" },
  skills: { primary: "#b2ff05", secondary: "#00b09b", tertiary: "#74ff00" },
  journey: { primary: "#00f2fe", secondary: "#4facfe", tertiary: "#00c6ff" },
  research: { primary: "#ff0844", secondary: "#ffb199", tertiary: "#ff4560" },
  sports: { primary: "#7c3aed", secondary: "#3b82f6", tertiary: "#8b5cf6" },
  contact: { primary: "#f97316", secondary: "#ea580c", tertiary: "#fcd34d" },
};

export function Navbar() {
  setupGsap();
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      router.push(`/#${id}`);
      setIsMenuOpen(false);
      return;
    }

    const target = `#${id}`;
    if (lenis) {
      lenis.scrollTo(target, { offset: -88 });
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  const docHeightRef = useRef(0);

  // Cache scroll height — only recompute on resize, not on every scroll event
  useEffect(() => {
    const updateHeight = () => {
      docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    updateHeight();
    window.addEventListener("resize", updateHeight, { passive: true });
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section tracker ────────────────────────────────────── */
  useEffect(() => {
    if (!isHomePage) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      // The section must cross the exact vertical center of the screen to become active
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    });

    // Let the DOM settle from GSAP Hero pins or framer-motion animations
    const initTimer = setTimeout(() => {
      const allSections = ["hero", ...navigationItems.map(i => i.id)];
      allSections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }, 500);

    return () => {
      clearTimeout(initTimer);
      observer.disconnect();
    };
  }, [isHomePage]);

  /* ── Global Color Engine (zero-tween version) ─────────────────────── */
  // style.setProperty() + CSS @property in globals.css handles smooth
  // color transitions natively — no GSAP tweens that accumulate over time.
  useEffect(() => {
    const palette = sectionPalettes[activeSection] ?? sectionPalettes.hero;
    const el = document.documentElement;
    el.style.setProperty("--accent-primary", palette.primary);
    el.style.setProperty("--accent-secondary", palette.secondary);
    el.style.setProperty("--accent-tertiary", palette.tertiary);
  }, [activeSection]);

  /* ── Mobile menu animations ────────────────────────────────────── */
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay || !isMenuOpen) {
        return;
      }

      const links =
        overlay.querySelectorAll<HTMLElement>("[data-mobile-link]");
      if (links.length === 0) {
        return;
      }

      gsap.fromTo(
        links,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
        }
      );
    },
    { scope: overlayRef, dependencies: [isMenuOpen] }
  );

  return (
    <header
      ref={navRef}
      className={`fixed left-0 top-0 z-1000 w-full px-4 py-5 transition-all duration-500 ${
        isScrolled
          ? "nav-scrolled border-b"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{
        borderColor: isScrolled ? "color-mix(in srgb, var(--accent-primary) 25%, transparent)" : "transparent",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (isHomePage && lenis) {
              lenis.scrollTo(0);
            } else {
              router.push("/");
            }
          }}
          className="font-mono text-lg font-bold tracking-[0.18em] text-white transition-all duration-300 hover:opacity-80"
          style={{ textShadow: "0 0 15px color-mix(in srgb, var(--accent-primary) 60%, transparent)" }}
          aria-label="Go to top"
        >
          Harshavardhan K
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <div key={item.id} className="relative px-3 py-1">
              <button
                type="button"
                data-cursor="hover"
                onClick={() => scrollToSection(item.id)}
                className={`relative z-10 text-sm font-medium uppercase tracking-[0.16em] transition-colors duration-200 ${
                  activeSection === item.id
                    ? "text-foreground"
                    : "text-(--text-secondary) hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
              {/* Animated active indicator glow */}
              <AnimatePresence>
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full pointer-events-none border"
                    style={{
                      boxShadow: "0 0 20px 2px color-mix(in srgb, var(--accent-primary) 40%, transparent)",
                      background: "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
                      borderColor: "color-mix(in srgb, var(--accent-primary) 30%, transparent)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="text-foreground lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-990 flex flex-col items-center justify-center gap-8 bg-background transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-mobile-link
            onClick={() => scrollToSection(item.id)}
            className={`text-3xl font-black uppercase tracking-widest transition-colors ${
              activeSection === item.id
                ? "text-(--accent-primary-light)"
                : "text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
