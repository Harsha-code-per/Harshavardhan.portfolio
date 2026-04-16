# MASTER COPILOT PROMPT — Harshavardhan Portfolio: Awwwards-Level Overhaul
# READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE.
# Execute every block in sequence. Do not skip, summarize, or abbreviate any task.

---

## ROLE & ABSOLUTE MANDATE

You are a Staff-level Creative Frontend Engineer with deep expertise in GSAP, Framer Motion, 
Next.js App Router, and Awwwards-winning interaction design. You are performing a complete 
visual identity overhaul and bug remediation of this portfolio.

The site is built on Next.js 16 (App Router), React 19, Tailwind CSS v4, GSAP + ScrollTrigger, 
Lenis smooth scroll, Framer Motion, and Spline 3D. All sections exist but are buggy, misaligned, 
laggy, and visually boring (light warm-white theme). Your job is to transform this into a 
dark, cinematic, Awwwards-level experience.

**The four non-negotiable laws:**
1. NEVER animate `top`, `left`, `width`, `height`, or `margin`. Only `transform` (x, y, scale, 
   rotation) and `opacity`. Violating this causes layout thrashing and lag.
2. EVERY GSAP `useGSAP` hook MUST receive a `scope` ref AND return a cleanup via the automatic 
   context. NEVER use raw `useEffect` for GSAP.
3. EVERY ScrollTrigger that pins or scrubs MUST include `invalidateOnRefresh: true`.
4. ALL heavy components (Spline, heavy canvases) MUST use Next.js `dynamic()` with `ssr: false`.

---

## BLOCK 0 — REPOSITORY HYGIENE (Do this first, silently)

Delete these files entirely — they are unused legacy modules that cause confusion:
- `src/components/motion/CinematicStoryEngine.tsx`
- `src/components/motion/HeroQuote.tsx`
- `src/store/useGlobalStore.ts` (Zustand store — not wired into any live flow)

Do not import them anywhere. Do not replace them. Simply delete.

---

## BLOCK 1 — THE NEW DESIGN SYSTEM (globals.css + Tailwind config)

### 1A. Update `src/app/globals.css`

Replace ALL existing CSS custom property declarations in `:root` with exactly this design system.
Keep any existing Tailwind base/utilities directives. Append or replace the :root block:

```css
:root {
  /* === OBSIDIAN SPECTRUM — Dark AI/Engineering Identity === */

  /* Base surfaces */
  --bg-base:        #0a0a0f;
  --bg-surface:     #111118;
  --bg-elevated:    #1a1a26;
  --bg-overlay:     #21212e;

  /* Primary accent — Violet (AI / Intelligence) */
  --accent-primary:        #7c3aed;
  --accent-primary-light:  #a855f7;
  --accent-primary-glow:   rgba(124, 58, 237, 0.25);
  --accent-primary-subtle: rgba(124, 58, 237, 0.08);

  /* Secondary accent — Orange (Energy / Craft) */
  --accent-secondary:       #f97316;
  --accent-secondary-light: #fb923c;
  --accent-secondary-glow:  rgba(249, 115, 22, 0.20);

  /* Tertiary accent — Cyan (Data / Systems) */
  --accent-tertiary:       #06b6d4;
  --accent-tertiary-light: #22d3ee;
  --accent-tertiary-glow:  rgba(6, 182, 212, 0.18);

  /* Typography */
  --text-primary:   #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted:     #475569;
  --text-ghost:     #1e293b;

  /* Borders */
  --border-default: rgba(255, 255, 255, 0.06);
  --border-hover:   rgba(255, 255, 255, 0.12);
  --border-active:  rgba(124, 58, 237, 0.40);

  /* Motion timing */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo:   cubic-bezier(0.7, 0, 0.84, 0);
  --ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Radii */
  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  20px;
  --radius-xl:  32px;
}

/* === GLOBAL BASE === */
html {
  scroll-behavior: auto; /* Lenis handles this */
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-space), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* === NOISE GRAIN OVERLAY === */
/* Applied via ::before on a fixed element for cinematic texture */
.grain-overlay::before {
  content: '';
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.028;
  pointer-events: none;
  z-index: 9999;
  animation: grain 0.5s steps(1) infinite;
}
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10%       { transform: translate(-2%, -3%); }
  20%       { transform: translate(3%, 2%); }
  30%       { transform: translate(-1%, 4%); }
  40%       { transform: translate(2%, -1%); }
  50%       { transform: translate(-3%, 3%); }
  60%       { transform: translate(1%, -2%); }
  70%       { transform: translate(-2%, 1%); }
  80%       { transform: translate(3%, -3%); }
  90%       { transform: translate(-1%, 2%); }
}

/* === SECTION BASE === */
section {
  position: relative;
}

/* === SCROLLBAR === */
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 99px; }

/* === SELECTION === */
::selection {
  background: var(--accent-primary-glow);
  color: var(--text-primary);
}

/* === CUSTOM CURSOR === */
.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary-light);
  pointer-events: none;
  z-index: 10000;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  transition: width 0.2s var(--ease-out-expo), height 0.2s var(--ease-out-expo);
}
.cursor-ring {
  position: fixed;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(124, 58, 237, 0.6);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.3s var(--ease-out-expo), height 0.3s var(--ease-out-expo),
              border-color 0.2s ease, opacity 0.2s ease;
}
.cursor-dot.cursor-hover { width: 14px; height: 14px; }
.cursor-ring.cursor-hover {
  width: 56px; height: 56px;
  border-color: var(--accent-secondary);
}

/* === GLOW UTILITIES === */
.glow-violet { box-shadow: 0 0 40px var(--accent-primary-glow); }
.glow-orange  { box-shadow: 0 0 40px var(--accent-secondary-glow); }
.text-gradient-violet {
  background: linear-gradient(135deg, var(--accent-primary-light), var(--accent-tertiary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-warm {
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* === CARD BASE === */
.card-glass {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.card-glass:hover {
  border-color: var(--border-hover);
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.10);
}
```

### 1B. Update `tailwind.config.ts` (or `.js`)

Ensure these additions exist. Merge with existing config, do not overwrite font or content arrays:
```ts
theme: {
  extend: {
    colors: {
      bg: {
        base:     'var(--bg-base)',
        surface:  'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        overlay:  'var(--bg-overlay)',
      },
      accent: {
        primary:   'var(--accent-primary)',
        secondary: 'var(--accent-secondary)',
        tertiary:  'var(--accent-tertiary)',
      },
      ink: {
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',
      },
    },
    fontFamily: {
      space: ['var(--font-space)', 'system-ui', 'sans-serif'],
    },
    borderColor: {
      DEFAULT: 'var(--border-default)',
    },
  },
}
```

---

## BLOCK 2 — CRITICAL BUG FIXES

### 2A. `src/app/layout.tsx` — Mount Toaster + Grain + Body class

Find the `<body>` tag. Make these changes:
1. Add `className="grain-overlay"` to the body (alongside existing classes). 
   Also ensure the body background is `bg-[#0a0a0f]` and text is `text-[#f8fafc]`.
2. Import `Toaster` from `sonner` at the top of the file: `import { Toaster } from 'sonner';`
3. Render `<Toaster theme="dark" richColors position="bottom-right" />` inside `<body>`, 
   just before the closing `</body>` tag.
4. Remove `bg-white`, `bg-neutral-50`, `bg-warm`, or any light background class from the body.
5. Ensure the font variable class is still applied. Keep all providers intact.

### 2B. `src/app/manifest.ts`

Update the manifest theme colors to match the new dark design:
```ts
export default function manifest() {
  return {
    name: 'Harshavardhan K — AI & Full Stack Engineer',
    short_name: 'HV Portfolio',
    description: 'AI, ML & Full Stack Engineer portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#7c3aed',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

### 2C. `src/components/layout/SmoothScroller.tsx` — Validate Lenis + GSAP sync

Open this file and ensure it looks EXACTLY like this pattern. Replace the entire file if needed:
```tsx
'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, type ReactNode } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroller({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Intentionally left empty — Lenis RAF integration handled by ReactLenis root
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,          // Smoothness — lower = more responsive
        duration: 1.2,       // Scroll duration
        syncTouch: false,    // Native touch on mobile is better
        touchMultiplier: 2,
      }}
      onScroll={(e: { scroll: number }) => {
        // Sync Lenis scroll to GSAP ScrollTrigger
        ScrollTrigger.update();
      }}
    >
      {children}
    </ReactLenis>
  );
}
```
Also ensure `src/lib/gsap.ts` registers ScrollTrigger once: 
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
export { gsap, ScrollTrigger };
```

---

## BLOCK 3 — GLOBAL INTERACTIVE ELEMENTS (New files to create)

### 3A. Create `src/components/layout/CustomCursor.tsx`

Create this file from scratch:
```tsx
'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    };
    const onLeave = () => {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-cursor="hover"]')
      .forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
```

Then in `src/app/layout.tsx`, import and add `<CustomCursor />` as the very first child inside `<body>`.
Hide the default cursor only on desktop: add `style={{ cursor: 'none' }}` to the `<body>` tag,
then add `@media (pointer: coarse) { body { cursor: auto; } .cursor-dot, .cursor-ring { display: none; } }`
to globals.css.

### 3B. Create `src/components/layout/PageLoader.tsx`

Create this file:
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const bar    = barRef.current;
    const text   = textRef.current;
    if (!loader || !bar || !text) return;

    // Prevent scroll during load
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        gsap.set(loader, { display: 'none' });
      },
    });

    tl.to(bar, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' })
      .to(text, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '-=0.2')
      .to(bar,  { scaleX: 0, transformOrigin: 'right center', duration: 0.5, ease: 'power2.in' })
      .to(loader, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div ref={textRef} className="mb-8 text-sm font-mono tracking-[0.3em] uppercase" style={{ color: 'var(--text-secondary)' }}>
        Harshavardhan K
      </div>
      <div className="w-48 h-[1px] overflow-hidden" style={{ background: 'var(--border-hover)' }}>
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{ background: 'var(--accent-primary)', transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
```

Add `<PageLoader />` as the second child inside `<body>` in `layout.tsx` (after `<CustomCursor />`).

---

## BLOCK 4 — NAVBAR (`src/components/layout/Navbar.tsx`)

Fully rewrite the Navbar. Requirements:
- Fixed top, full width, high z-index (z-[1000])
- Background: `rgba(10, 10, 15, 0)` → transitions to `rgba(10, 10, 15, 0.85)` with `backdrop-filter: blur(20px)` when scrolled past 60px. Use a GSAP ScrollTrigger or a simple `window.scroll` listener to add a class `nav-scrolled` to the nav, then handle via CSS.
- Left side: Text logo "HV" in monospace font, color var(--accent-primary-light). On click → smooth scroll to top.
- Right side: Navigation links array: `['About', 'Work', 'Projects', 'Skills', 'Journey', 'Research', 'Contact']`. Each maps to a section id (lowercase). On click, use `lenis.scrollTo('#sectionId')` — import lenis via `useLenis` from `@studio-freight/react-lenis`.
- Active link state: track via ScrollTrigger. The active link gets `color: var(--accent-primary-light)` and a tiny dot below.
- Mobile: hamburger menu. On mobile, show a full-screen overlay menu (dark, same bg-base color). Menu links in large text, staggered in with GSAP on open.
- Add CSS: `.nav-scrolled { background: rgba(10,10,15,0.85) !important; backdrop-filter: blur(20px); }`

---

## BLOCK 5 — HERO (`src/components/ui/Hero.tsx`)

The Hero must be a dramatic dark experience. Rewrite it completely.

Layout:
- Section: `min-h-screen w-full relative overflow-hidden flex items-center` with background `var(--bg-base)`.
- Two columns on desktop (lg:grid lg:grid-cols-2), single column stacked on mobile.
- Left column: `flex flex-col justify-center pl-8 lg:pl-20 z-10 relative`
- Right column: Spline 3D model (keep existing dynamic import pattern)

Left column content (maintain existing data/text, only restyle):
1. A small label above the heading: 
   `<span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase mb-6" style={{color:'var(--accent-tertiary)'}}>`
   `<span className="w-4 h-[1px] inline-block" style={{background:'var(--accent-tertiary)'}}></span>AI & Full Stack Engineer</span>`
2. The main `<h1>` with `id="hero-title"`:
   - font-size: clamp(2.8rem, 6vw, 5.5rem)
   - font-weight: 900
   - letter-spacing: -0.03em
   - line-height: 1.0
   - color: var(--text-primary)
   - Keep the SplitType + scatter animation you already have. Reduce scatter range: x `random(-150,150)`, y `random(-150,150)`
   - After intro animates in, start a subtle continuous float: gsap.to each char individually with `yoyo:true, repeat:-1, y:'random(-3,3)', duration:'random(2,4)', ease:'sine.inOut'`
3. Below heading: role subtitle with `text-gradient-warm` class on key words
4. A row of 3 stats (e.g. "3+ Projects", "2026 B.Tech", "AI/ML Focus") each in a small pill: 
   `bg: var(--bg-elevated), border: 1px solid var(--border-default), px-4 py-2 rounded-full text-sm`
5. A CTA button: "View My Work" → scrolls to `#work`. Styled:
   `bg: var(--accent-primary), color: white, px-8 py-4, rounded-full, font-weight:600`
   On hover: `background: var(--accent-primary-light), box-shadow: 0 0 30px var(--accent-primary-glow)`
   Framer Motion `whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}`

GSAP on this component:
- Keep your existing SplitType scatter intro.
- Keep your scroll-driven exit (chars fly off on scroll).
- Add: the `<span>` label, stats pills, and CTA button should animate in with `gsap.from([labelRef, statsRef, ctaRef], { opacity:0, y:30, stagger:0.1, duration:0.8, ease:'power3.out', delay:1.6 })` after the title scatter completes.
- On scroll (ScrollTrigger scrub), the LEFT column translates `y: -60` as user scrolls down 100vh.

Right column — Spline:
- Keep the dynamic import. 
- Wrap in `<div className="relative h-[50vh] lg:h-full">`.
- Add a radial gradient overlay at the left edge of this div to blend the Spline into the dark bg:
  `position:absolute, left:0, top:0, width:80px, height:100%, background: linear-gradient(to right, var(--bg-base), transparent), z-index:1, pointerEvents:none`

LiveClock: keep it, but restyle: position absolute, bottom-right of the hero section, font-mono, text-xs, color var(--text-muted).

---

## BLOCK 6 — MASKED ABOUT (`src/components/ui/MaskedAbout.tsx`)

This is a pinned scroll section where a dark card expands to fill the screen. Fix the bugs and 
add the dark theme.

Critical GSAP fix — find your ScrollTrigger pin definition and ensure it has ALL of these:
```ts
ScrollTrigger.create({
  trigger: containerRef.current,
  start: 'top top',
  end: '+=200%',  // 2x viewport height of scroll distance
  pin: true,
  scrub: 1,
  invalidateOnRefresh: true,  // ← THIS is what fixes the misalignment
  anticipatePin: 1,
});
```

For the card itself, the animation timeline should:
1. Start: card at `scale(0.85)`, `borderRadius: 32px`, `opacity: 0.5`, centered small
2. On scroll progress 0→0.6: card scales to `scale(1)`, opacity 1, borderRadius stays
3. On scroll progress 0.6→1: borderRadius animates from 32px to 0, card expands to full viewport (`width: 100vw, height: 100vh`) using transform-based scale, NOT actual width/height changes.

The card background must be `var(--bg-surface)`. The card content (profile, highlights) uses:
- Name: `text-gradient-violet` class
- Highlight stat cards: `card-glass` class, with accent-colored numbers

Add a subtle animated background inside the card: a CSS `radial-gradient` that slowly shifts 
position using a CSS animation (`@keyframes bgshift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }`)
applied to the card's pseudo-element. Colors: shift between `var(--accent-primary-subtle)` and transparent.

---

## BLOCK 7 — WORK SHOWCASE (`src/components/ui/WorkShowcase.tsx`)

This is a stacked pinned card reveal. Fix the z-index fight and restyle.

Fix: Each card in the stack must have an explicit `zIndex` that increments: 
`style={{ zIndex: index + 1 }}`. The GSAP timeline that pins and reveals them must use 
`immediateRender: false` on all but the first tween. Add `invalidateOnRefresh: true` to the ScrollTrigger.

Visual redesign of each card:
- Background: `var(--bg-surface)` with a unique left-border accent color per card:
  - Card 1: `border-left: 3px solid var(--accent-primary)`
  - Card 2: `border-left: 3px solid var(--accent-secondary)`
  - Card 3+: `border-left: 3px solid var(--accent-tertiary)`
- Company name: large, bold, color var(--text-primary)
- Role: smaller, color var(--text-secondary)
- Key outcomes: Use a bullet list with accent-colored bullets (use `::before` with content `'→'`)
- Tech stack: pill badges — `background: var(--bg-elevated), border: 1px solid var(--border-default), color: var(--text-secondary), font-size: 12px, border-radius: 99px`

On each card entrance (as scroll reveals it): stagger animate `opacity:0 → 1` and `y:30 → 0` for 
the internal text elements using GSAP within the scrub timeline (`immediateRender:false`).

---

## BLOCK 8 — HORIZONTAL PROJECTS (`src/components/ui/HorizontalProjects.tsx`)

This is the most critical bug fix. The horizontal scroll is broken. Replace the GSAP logic entirely.

Here is the EXACT corrected implementation pattern for the GSAP scroll:
```tsx
const trackRef = useRef<HTMLDivElement>(null);
const wrapperRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  const track   = trackRef.current;
  const wrapper = wrapperRef.current;
  if (!track || !wrapper) return;

  // Horizontal scroll distance = total track width minus one viewport width
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start:   'top top',
      end:     () => `+=${track.scrollWidth}`,
      scrub:   1,
      pin:     true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
}, { scope: wrapperRef });
```

Critical CSS that MUST be on the elements:
- Wrapper: `className="projects-wrapper relative overflow-hidden"` — `height: 100vh`
- Track: `className="projects-track flex flex-nowrap h-full"` — width determined by children
- Each panel `<article>`: `className="w-screen h-full shrink-0 flex flex-col justify-center px-12 lg:px-24 relative overflow-hidden"`

Each project panel redesign:
- Background: use the `accentGradient` or a dark variant from your projects data, but ensure 
  the base is always dark: `background: linear-gradient(135deg, var(--bg-surface) 0%, [accentColor]15 100%)`
- Project number: giant ghost text, absolute, top-right, `font-size: clamp(8rem, 20vw, 18rem)`, 
  `opacity: 0.04`, font-weight 900, color white, pointer-events none, select-none
- Project title: `font-size: clamp(3rem, 8vw, 7rem)`, weight 900, tight tracking, color var(--text-primary)
- Under title: 1-2 line summary, color var(--text-secondary)
- Left bar: `position:absolute, left:0, top:0, width:3px, height:100%, background: [accentColor]`
- Stack badges: `card-glass` class + small text
- "View Project" button: `background: transparent, border: 1px solid var(--border-hover), 
  color: var(--text-primary), padding: 12px 32px, border-radius: 99px`
  On hover: border-color changes to accent, slight background tint

Add a horizontal scroll progress indicator: a thin bar at the bottom of the wrapper that fills 
left-to-right as the user scrolls through projects. Use a `useRef` div and update its `scaleX` 
via the ScrollTrigger `onUpdate` callback.

---

## BLOCK 9 — SKILLS BENTO (`src/components/ui/SkillsBento.tsx`)

Keep the grid structure but completely restyle it. Use the `card-glass` base class.

Section header redesign:
- Large label: `class="text-gradient-violet"`, font-size clamp(3rem, 7vw, 6rem), font-weight 900
- Subtitle below: smaller, color var(--text-secondary)

Each skill card redesign:
- Base: `card-glass` class + `p-6 lg:p-8`
- Category header: small mono text, color var(--accent-tertiary), tracking wide, uppercase
- Icon: use `react-icons`, size 32px, color matching the card's accent (use the first skill's color). 
  Display icons in a row, not stacked.
- Skill names: `color: var(--text-primary), font-weight: 500`
- On hover: the card's `border-color` transitions to `var(--accent-primary)` AND a subtle 
  `box-shadow: 0 0 40px var(--accent-primary-glow)` appears
- The Framer Motion tilt: keep it. Adjust sensitivity: `rotateX: [-8, 8], rotateY: [-8, 8]`, 
  spring stiffness 200, damping 20

GSAP section reveal: when `#skills` enters viewport:
```ts
gsap.from('.skill-card', {
  opacity: 0, y: 60, scale: 0.95,
  stagger: 0.07, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '#skills', start: 'top 75%' },
});
```

---

## BLOCK 10 — TIMELINE EXPERIENCE (`src/components/ui/TimelineExperience.tsx`)

Fix the scroll spine and restyle for the dark theme.

The scroll spine (the vertical progress line):
- The spine track: `width: 1px, background: var(--border-default), position: absolute, left: 32px (or center on desktop)`
- The filled progress bar: same position, same width, `background: linear-gradient(to bottom, var(--accent-primary), var(--accent-tertiary))`, starts at `height: 0`, animated by a ScrollTrigger that scrubs `height` from 0 to 100%.
  **IMPORTANT**: use a `motionValue` or a direct GSAP `to` on the `height` CSS property OF THE SPINE ELEMENT itself (not via React state). Do this:
  ```ts
  gsap.to(spineRef.current, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
    },
  });
  ```
- Each milestone dot: small circle, initially `background: var(--border-default)`. When its milestone card enters the viewport, the dot animates to `background: var(--accent-primary)` with a glow pulse.

Milestone card redesign (map over your existing data):
- `card-glass` base, `p-6`, `ml-16 lg:ml-24`
- Date/year: `color: var(--accent-primary-light), font-mono, font-size: 0.8rem, uppercase, tracking-wide`
- Title: `color: var(--text-primary), font-weight: 700, font-size: 1.1rem`
- Description: `color: var(--text-secondary), line-height: 1.7`
- Each card animates in from `x: 40, opacity: 0` → `x: 0, opacity: 1` as it enters viewport 
  (individual ScrollTrigger per card, `start: 'top 85%'`, duration 0.7, ease `power3.out`)

---

## BLOCK 11 — RESEARCH SECTION (`src/components/ui/ResearchSection.tsx`)

Restyle with dark theme. Fix the orbital layer performance issue.

Section: background `var(--bg-surface)` for visual contrast break between Timeline and Sports.

The orbital decorative layer (if it uses SVG circles orbiting): ensure it uses CSS animation NOT JS animation for the orbit. Replace any JS-driven orbital with:
```css
@keyframes orbit {
  from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
}
.orbital-dot { animation: orbit 8s linear infinite; }
.orbital-dot:nth-child(2) { animation-duration: 12s; animation-direction: reverse; }
```

Research card redesign:
- A large card with `card-glass` base, left-accent border: `border-left: 3px solid var(--accent-tertiary)`
- Publication title: bold, large, `text-gradient-violet`
- Journal/venue: small, font-mono, color var(--accent-tertiary)
- Description: color var(--text-secondary)
- A "View Publication" link styled as an underline-on-hover text link with arrow icon

---

## BLOCK 12 — SPORTS SECTION (`src/components/ui/SportsSection.tsx`)

This section needs a strong visual identity as the "energy shift" chapter.

Background: use a VERY subtle diagonal stripe pattern via CSS: 
```css
background: repeating-linear-gradient(
  -45deg,
  var(--bg-base),
  var(--bg-base) 10px,
  var(--bg-surface) 10px,
  var(--bg-surface) 11px
);
```

Fix the parallax strip misalignment: add a `ScrollTrigger.addEventListener('refreshInit', ...)` 
that clears and re-creates the parallax trigger. Or simpler: add `invalidateOnRefresh: true` to 
the parallax ScrollTrigger and call `ScrollTrigger.refresh()` on window resize.

The headline strip:
- Large, bold, overflowing text (wider than viewport): `white-space: nowrap, font-size: clamp(4rem, 12vw, 10rem), font-weight: 900, color: var(--text-primary), opacity: 0.06` — this is a ghost watermark.
- The actual content cards: use `card-glass` with orange accent: `border-left: 3px solid var(--accent-secondary)`
- Sport name: bold, `color: var(--text-primary)`
- Achievement: `color: var(--accent-secondary)`, font-weight 600
- Detail: `color: var(--text-secondary)`

Directional reveal: items from the left slide in from `x:-40`, items from the right from `x:40`. 
Keep your alternating direction logic.

---

## BLOCK 13 — CONTACT SECTION (`src/components/ui/ContactSection.tsx` + `ContactForm.tsx`)

The Toaster is now fixed globally (Block 2A). Restyle the section.

Section: background `var(--bg-base)`. This is the final chapter — make it feel like a landing.

Left panel:
- Large heading: "Let's Build Something." — `text-gradient-violet`, clamp(2.5rem, 5vw, 5rem), weight 900
- Tagline: `color: var(--text-secondary)`
- Social/contact links: render as large text links with a magnetic hover effect (GSAP). 
  On hover, the link slightly magnetically follows the cursor:
  ```ts
  const onHover = (e: MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
  };
  const onLeave = (el: HTMLElement) => gsap.to(el, { x:0, y:0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  ```

Right panel — Contact Form (`ContactForm.tsx`):
- Form inputs: restyle. Remove any light backgrounds. 
  Input styling: `background: var(--bg-elevated), border: 1px solid var(--border-default), 
  color: var(--text-primary), border-radius: var(--radius-md), padding: 14px 18px`
  On focus: `border-color: var(--accent-primary), box-shadow: 0 0 0 3px var(--accent-primary-glow)`
  Use CSS: `input:focus, textarea:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-primary-glow); }`
  Placeholder color: `var(--text-muted)`
- Submit button: full-width, `background: var(--accent-primary), color: white, border-radius: var(--radius-md), padding: 16px, font-weight: 600`
  On hover: `background: var(--accent-primary-light), box-shadow: 0 0 30px var(--accent-primary-glow)`
  Loading state: existing spinner is fine, but tint it with the accent color

---

## BLOCK 14 — FOOTER (`src/components/layout/Footer.tsx`)

The footer is static. Bring it to life.

Complete rewrite of the Footer styles (keep existing data/content):
- Background: `var(--bg-base)`, top border: `1px solid var(--border-default)`
- Top area: a large "Available for Work" or final statement in large ghost text 
  (`font-size: clamp(4rem, 10vw, 8rem), font-weight: 900, opacity: 0.04, color: white, 
  pointer-events: none, user-select: none`) — this is a background watermark
- Actual footer content sits on top at normal z-index
- Left: Logo "HV", your name, a brief tagline, color var(--text-secondary)
- Right: Navigation links with `data-cursor="hover"` on each. Style as plain text, color var(--text-muted), hover → var(--text-primary). Apply the magnetic hover from Block 13.
- Bottom bar: copyright line, links (GitHub, LinkedIn, Email), all color var(--text-muted)

GSAP entrance: when footer enters viewport:
```ts
gsap.from(footerRef.current, { opacity: 0, y: 40, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: footerRef.current, start: 'top 90%' } });
```

---

## BLOCK 15 — PAGE SPINE (`src/app/page.tsx`)

Update the background tone transitions. Currently they likely interpolate toward light colors. 
Change ALL background interpolation targets to use the dark palette:

Find any gsap/ScrollTrigger that changes `backgroundColor` on the `<main>` or `<body>` element 
and update the color map. The palette per chapter:
- hero:     `#0a0a0f` (base)
- about:    `#0d0d15` (very slightly lighter)
- work:     `#0a0a0f`
- projects: `#0c0a10` (very subtle violet tint)
- skills:   `#0a0a0f`
- journey:  `#0a0f0f` (very subtle teal tint)
- research: `#111118` (surface, strong contrast break)
- sports:   `#0a0a0f`
- contact:  `#0a0a0f`

The right-side progress rail: style it with `background: var(--accent-primary)`, `width: 2px`.

Ensure the `<main>` element has `className="relative"` and `style={{ background: 'var(--bg-base)' }}`.

---

## BLOCK 16 — SECTION ID VERIFICATION

Every section component MUST have the correct `id` attribute for Navbar scroll-to to work. 
Verify and fix these id attributes on each section's outermost `<section>` element:
- `Hero.tsx` → `id="hero"`
- `MaskedAbout.tsx` → `id="about"`
- `WorkShowcase.tsx` → `id="work"`
- `HorizontalProjects.tsx` → `id="projects"`
- `SkillsBento.tsx` → `id="skills"`
- `TimelineExperience.tsx` → `id="journey"`
- `ResearchSection.tsx` → `id="research"`
- `SportsSection.tsx` → `id="sports"`  (this can stay or be excluded from Navbar)
- `ContactSection.tsx` → `id="contact"`

---

## BLOCK 17 — FINAL VERIFICATION CHECKLIST

After all files are generated, perform this exact verification. Do NOT skip:

1. Run `pnpm lint` — fix ALL errors before presenting output.
2. Ensure zero `useState` or `useEffect` used for GSAP. All GSAP must be in `useGSAP`.
3. Ensure ALL ScrollTriggers that use `pin: true` have `invalidateOnRefresh: true`.
4. Ensure `<Toaster />` is in `layout.tsx`.
5. Ensure `<CustomCursor />` is in `layout.tsx`.
6. Ensure `<PageLoader />` is in `layout.tsx`.
7. Ensure legacy files are deleted.
8. Ensure `globals.css` has ALL design tokens from Block 1A.
9. Ensure NO component uses light background colors (`bg-white`, `bg-neutral-*`, `bg-warm-*`, etc.).
10. Ensure ALL section outer elements have the correct `id` attribute (Block 16).

---

## DELIVERY EXPECTATIONS

Generate all modified and new files completely. Do not abbreviate with "// ... rest stays the same".  
Every file must be production-complete. If a file is unchanged, skip it.  
Present files in this order: `globals.css` → `layout.tsx` → new components → section components → `page.tsx`.

---
*Generated for: Harshavardhan K Portfolio — Awwwards Overhaul Sprint*
*Stack: Next.js 16 / React 19 / Tailwind v4 / GSAP / Lenis / Spline / Framer Motion*
