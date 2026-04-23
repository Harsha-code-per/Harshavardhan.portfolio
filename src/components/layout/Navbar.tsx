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

export function Navbar() {
  setupGsap();
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("about");
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

  /* ── Scroll state ──────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);

      /* Update progress bar */
      if (progressRef.current) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section tracker ────────────────────────────────────── */
  useGSAP(
    () => {
      if (!isHomePage) {
        return;
      }

      const triggers: ScrollTrigger[] = [];

      const initFrame = requestAnimationFrame(() => {
        navigationItems.forEach((item) => {
          const section = document.getElementById(item.id);
          if (!section) {
            return;
          }

          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "top 55%",
              end: "bottom 45%",
              invalidateOnRefresh: true,
              onEnter: () => setActiveSection(item.id),
              onEnterBack: () => setActiveSection(item.id),
            })
          );
        });
      });

      return () => {
        cancelAnimationFrame(initFrame);
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: navRef, dependencies: [] }
  );

  /* ── Mobile menu animations ────────────────────────────────────── */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !isMenuOpen) {
      return;
    }

    const links = overlay.querySelectorAll<HTMLElement>("[data-mobile-link]");
    if (links.length === 0) {
      return;
    }

    const tween = gsap.fromTo(
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

    return () => {
      tween.kill();
    };
  }, [isMenuOpen]);

  return (
    <header
      ref={navRef}
      className={`fixed left-0 top-0 z-[9999] w-full border-b border-transparent px-4 py-5 transition-all duration-300 ${
        isScrolled
          ? "nav-scrolled border-(--border-default)"
          : "bg-transparent"
      }`}
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
          className="font-mono text-lg tracking-[0.18em] text-(--accent-primary-light) transition-opacity hover:opacity-80"
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
              {/* Animated active indicator pill */}
              <AnimatePresence>
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--accent-primary-subtle)",
                      border: "1px solid var(--accent-primary)",
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

      {/* ── Scroll progress bar ────────────────────────────────── */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
        style={{
          background:
            "linear-gradient(to right, var(--accent-primary), var(--accent-tertiary))",
          transform: "scaleX(0)",
        }}
      />

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-8 bg-background transition-opacity duration-300 lg:hidden ${
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
