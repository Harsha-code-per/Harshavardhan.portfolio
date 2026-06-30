"use client";

import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";

import { Menu, X, Volume2, VolumeX, Briefcase, Compass } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, setupGsap } from "@/lib/gsap";
import { cinematicChapterPalettes } from "@/lib/motion";
import { sound } from "@/lib/sound";
import { useModeStore } from "@/lib/store";

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
  
  const { isRecruiterMode, isAudioMuted, toggleRecruiterMode, setAudioMuted } = useModeStore();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";

  // Hydrate audio settings from localStorage on client-side mount
  useEffect(() => {
    const saved = localStorage.getItem("sys_audio_muted");
    if (saved !== null) {
      setAudioMuted(saved === "true");
    } else {
      setAudioMuted(true);
    }
  }, [setAudioMuted]);

  // Synchronize initial sound system mute state
  useEffect(() => {
    sound.setMute(isAudioMuted);
  }, [isAudioMuted]);

  const handleNavHover = () => {
    sound.playStaticHover();
  };

  const handleNavClick = (id: string) => {
    sound.playClick();
    scrollToSection(id);
  };

  const handleAudioToggle = () => {
    const nextMuted = !isAudioMuted;
    setAudioMuted(nextMuted);
    sound.setMute(nextMuted);
    if (!nextMuted) {
      // Small verification chirp
      sound.playClick();
    }
  };

  const handleRecruiterToggle = () => {
    toggleRecruiterMode();
    sound.playClick();
  };

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
    if (!isHomePage || isRecruiterMode) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id === "hero-tracker" ? "hero" : entry.target.id;
          setActiveSection(id);
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
      const allSections = ["hero-tracker", ...navigationItems.map(i => i.id)];
      allSections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }, 500);

    return () => {
      clearTimeout(initTimer);
      observer.disconnect();
    };
  }, [isHomePage, isRecruiterMode]);

  /* ── Global Color Engine (zero-tween version) ─────────────────────── */
  // style.setProperty() + CSS @property in globals.css handles smooth
  // color transitions natively — no GSAP tweens that accumulate over time.
  useEffect(() => {
    if (isRecruiterMode) {
      const el = document.documentElement;
      el.style.setProperty("--accent-primary", "#fcd34d"); // Slate + Cyber Gold
      el.style.setProperty("--accent-secondary", "#f59e0b");
      el.style.setProperty("--accent-tertiary", "#d97706");
      return;
    }

    const palette =
      cinematicChapterPalettes[
        activeSection as keyof typeof cinematicChapterPalettes
      ] ?? cinematicChapterPalettes.hero;
    const el = document.documentElement;
    el.style.setProperty("--accent-primary", palette.primary);
    el.style.setProperty("--accent-secondary", palette.secondary);
    el.style.setProperty("--accent-tertiary", palette.tertiary);
  }, [activeSection, isRecruiterMode]);

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
      <div className="mx-auto flex w-full max-w-full px-8 lg:px-12 items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (isHomePage && lenis) {
              lenis.scrollTo(0);
            } else {
              router.push("/");
            }
          }}
          className="font-mono text-lg font-bold tracking-[0.18em] text-white transition-all duration-300 hover:opacity-80 whitespace-nowrap"
          style={{ textShadow: "0 0 15px color-mix(in srgb, var(--accent-primary) 60%, transparent)" }}
          aria-label="Go to top"
        >
          Harshavardhan K
        </button>

        {!isRecruiterMode && (
          <nav className="hidden items-center gap-1 lg:flex">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative px-3 py-1">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={handleNavHover}
                  className={`relative z-10 text-sm font-medium uppercase tracking-[0.16em] transition-colors duration-200 ${
                    activeSection === item.id
                      ? "text-foreground"
                      : "text-(--text-secondary) hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
                {/* Animated active indicator glow */}
                {activeSection === item.id && (
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none border animate-in fade-in zoom-in-95 duration-300"
                    style={{
                      boxShadow: "0 0 20px 2px color-mix(in srgb, var(--accent-primary) 40%, transparent)",
                      background: "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
                      borderColor: "color-mix(in srgb, var(--accent-primary) 30%, transparent)",
                    }}
                  />
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {/* Recruiter / Immersive Toggle */}
          <button
            type="button"
            onClick={handleRecruiterToggle}
            onMouseEnter={handleNavHover}
            className={`relative inline-flex h-9 items-center gap-2 rounded-full border px-4 font-mono text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
              isRecruiterMode
                ? "border-accent-primary bg-accent-primary/10 text-white shadow-[0_0_15px_var(--accent-primary-glow)]"
                : "border-white/10 bg-white/3 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            title={isRecruiterMode ? "Switch to Immersive Mode" : "Switch to Recruiter Resume Mode"}
          >
            {isRecruiterMode ? (
              <>
                <Briefcase className="h-3.5 w-3.5 text-accent-primary-light" />
                <span className="hidden sm:inline">Resume Active</span>
                <span className="sm:hidden">Resume</span>
              </>
            ) : (
              <>
                <Compass className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Immersive Mode</span>
                <span className="sm:hidden">Immersive</span>
              </>
            )}
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={handleAudioToggle}
            onMouseEnter={handleNavHover}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/3 text-white/70 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            title={isAudioMuted ? "Unmute System Audio" : "Mute System Audio"}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4 text-white/50" /> : <Volume2 className="h-4 w-4 text-accent-primary-light animate-pulse" />}
          </button>
          
          {!isRecruiterMode && (
            <button
              type="button"
              className="text-foreground lg:hidden cursor-pointer"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {!isRecruiterMode && (
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
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={handleNavHover}
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
      )}
    </header>
  );
}
