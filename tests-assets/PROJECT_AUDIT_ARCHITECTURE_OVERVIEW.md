# Harshavardhan Portfolio — Complete Codebase Audit & Architecture Overview

**Audit date:** 2026-04-16  
**Repository type:** Next.js App Router portfolio (single-scroll narrative + section routes)  
**Primary goal observed in code:** Recruiter-first, Awwwards-style immersive storytelling with performance-safe motion.

---

## 1. Executive Summary

The project is now a **modern, animation-heavy single-page storytelling portfolio** on `/`, supported by optional route pages (`/about`, `/work`, etc.).  

The architecture is strong in these areas:
- Data-driven content modules in `src/data/*`
- Shared GSAP setup and Lenis synchronization
- Sectionized component architecture for cinematic storytelling
- Dynamic loading of Spline to avoid server rendering issues

The top remaining architecture risks are:
1. **UX consistency split** between canonical single-scroll home and legacy route-per-section pages.
2. **Contact toast visibility issue** likely present (`toast()` used, but no `<Toaster />` mounted in layout).
3. **Unused legacy motion modules** still in repo (`CinematicStoryEngine`, `HeroQuote`, Zustand store) that can confuse future development.
4. **Manifest theme/background colors** still black while site theme is now light warm-white.

---

## 2. Tech Stack & Runtime Contracts

## Core stack
- **Framework:** Next.js `16.2.3` + App Router
- **React:** `19.2.5`
- **TypeScript:** strict mode enabled
- **Styling:** Tailwind CSS v4 + custom globals
- **Animation:** GSAP + ScrollTrigger + `@gsap/react`, Framer Motion
- **Smooth scrolling:** Lenis (`@studio-freight/react-lenis` + `lenis`)
- **3D layer:** Spline (`@splinetool/react-spline`)
- **Messaging:** Resend via server action
- **State package present:** Zustand (currently not integrated into live flows)

## Validation scripts
- `pnpm lint`
- `pnpm build`

Both currently pass.

---

## 3. Repository Architecture (Practical Map)

## App shell (`src/app`)
- `layout.tsx`: global HTML/body shell, font setup, navbar, smooth scroller wrapper.
- `page.tsx`: **main storytelling spine** with chapter progression and background tone transitions.
- `template.tsx`: route transition wrapper (Framer Motion fade/blur).
- `manifest.ts`: PWA manifest (currently black theme colors, mismatching current visual identity).
- `actions/sendEmail.ts`: server action for contact form via Resend.

## Layout layer (`src/components/layout`)
- `Navbar.tsx`: section-based navigation, hash sync, and active-section tracking via ScrollTrigger.
- `SmoothScroller.tsx`: Lenis + GSAP ticker synchronization.
- `Footer.tsx`: profile/contact links, static personal metadata.

## Narrative UI chapters (`src/components/ui`)
- `Hero.tsx` + `LiveClock.tsx`
- `MaskedAbout.tsx`
- `WorkShowcase.tsx`
- `HorizontalProjects.tsx`
- `SkillsBento.tsx`
- `TimelineExperience.tsx`
- `ResearchSection.tsx`
- `SportsSection.tsx`
- `ContactSection.tsx` + `ContactForm.tsx`
- `badge.tsx`

## Data layer (`src/data`)
- `about.ts`, `skills.ts`, `sports.ts`, `publications.ts`, `projects.ts`, `work.ts`, `research.ts`, `contact.ts`, `profile.ts`
- Content is typed and consumed by UI sections as intended.

## Shared utility
- `src/lib/gsap.ts`: one-time GSAP plugin registration helper.

## Legacy / currently unused modules
- `src/components/motion/CinematicStoryEngine.tsx` (image-sequence scrub engine)
- `src/components/motion/HeroQuote.tsx`
- `src/store/useGlobalStore.ts`

---

## 4. Runtime Architecture & Scroll Orchestration

## Global rendering flow
1. `layout.tsx` mounts `Navbar` and wraps route content with `SmoothScroller`.
2. `SmoothScroller` creates Lenis instance and forwards time to GSAP ticker.
3. Home `page.tsx` builds chapter-level triggers:
   - active chapter tracking
   - chapter-based background tone interpolation
   - right-side progress rail fill

## Motion strategy by scope
- **Global orchestration:** `src/app/page.tsx`
- **Chapter choreography:** each section component with local `useGSAP` scope
- **Micro-interactions:** Framer Motion in skills cards + route transitions

This separation is architecturally good and scalable.

---

## 5. Section-by-Section Functional Audit

## Hero (`Hero.tsx`)
- White two-column layout (text left, Spline right)
- SplitType heading reveal + scroll-driven exit
- Dynamic Spline import (`ssr: false`)
- Live clock overlay used as watermark cloak
- Scroll cue indicator present

**Status:** visually aligned with current direction; structurally clean.

## About (`MaskedAbout.tsx`)
- Pinned cinematic card reveal with scale/rotate normalization
- Profile image and highlight cards sourced from data

**Status:** strong chapter entry; good data usage.

## Work (`WorkShowcase.tsx`)
- Pinned stacked cards with progressive reveal/exit timeline
- Recruiter-readable outcomes + stack badges

**Status:** upgraded from static cards to narrative sequence.

## Projects (`HorizontalProjects.tsx`)
- Horizontal pinned track; each project as full viewport panel
- Data-driven title, summary, impact, stack, accent gradients

**Status:** premium structure, strong for “featured work” storytelling.

## Skills (`SkillsBento.tsx`)
- Grid of cards with pseudo-3D pointer tilt (Framer Motion)
- Icon mapping from tech labels to `react-icons`

**Status:** interactive and recruiter-readable; 3D illusion done without heavy WebGL cost.

## Journey (`TimelineExperience.tsx`)
- Milestone list assembled from work + publications data
- Scroll-progress spine and staged reveal

**Status:** meaningful progression; good chapter identity.

## Research (`ResearchSection.tsx`)
- Heading + card reveal choreography
- Decorative orbital motion layer

**Status:** improved depth and pacing.

## Sports (`SportsSection.tsx`)
- Alternating directional reveals
- Parallax headline strip

**Status:** adds energy shift chapter as intended.

## Contact (`ContactSection.tsx` + `ContactForm.tsx`)
- Split panel with links and form
- Server action integration for email delivery

**Status:** architecture is correct; one important UI feedback risk (see findings).

---

## 6. Data Architecture Audit

The project now follows a good content contract:
- Typed exports per domain
- UI sections map data instead of hardcoding long-form content
- Shared profile identity constants reused in footer/contact

This enables maintainability and future non-structural content edits.

---

## 7. `.github` Instructions & Skillsets (Integrated Audit)

The repository includes custom Copilot instruction assets:

## `.github/copilot-instructions.md`
Defines the project’s operating charter:
- Recruiter-first conversion focus
- Immersive but restrained Awwwards-like motion
- Data-driven content mandate (`src/data/*`)
- GSAP scoping requirements
- Performance guardrails (no layout-thrashing animation, one heavy 3D scene at a time, dynamic import heavy visuals)

## Prompt skill files (`.github/prompts/`)
1. `skill-gsap.md`
   - Enforces scoped `useGSAP`, transform/opacity-first animation, deterministic ScrollTrigger behavior.
2. `skill-webgl.md`
   - Positions Spline as preferred 3D layer, DOM-first content priority, no heavy concurrent scenes.
3. `skill-data-content.md`
   - Requires typed, modular, editable content architecture under `src/data`.
4. `skill-performance.md`
   - Frames performance auditing discipline: reduce jank, centralize smooth-scroll sync, avoid heavy assets.

**Audit verdict:** These `.github` instructions are well aligned with your current code direction and should remain the foundation for all future iterations.

---

## 8. Quality, Reliability, and Delivery Audit

## Current health
- Lint: pass
- Build: pass
- All app routes statically prerender successfully

## Service integration
- Contact form depends on:
  - `RESEND_API_KEY`
  - `RESEND_TO_EMAIL`
- Server action returns explicit success/error union (good error discipline).

---

## 9. Findings (Priority-Ordered)

## Critical / High
1. **Potential missing toast renderer**
   - `ContactForm.tsx` uses `toast` from `sonner`.
   - No `<Toaster />` mount found in layout/app shell.
   - Result: users may not see success/failure feedback visually.

2. **Experience split between `/` and section routes**
   - Home is now canonical cinematic narrative.
   - Separate route pages still exist and can dilute intended storytelling.

## Medium
3. **Manifest color mismatch**
   - `manifest.ts` still uses black `background_color`/`theme_color` while design is light warm-neutral.

4. **Legacy/unused modules**
   - `CinematicStoryEngine.tsx`, `HeroQuote.tsx`, and Zustand global store appear unused.
   - Adds maintenance noise and future direction confusion.

5. **Instruction mismatch risk in legacy component**
   - `CinematicStoryEngine.tsx` implements frame-sequence scrubbing (currently unused), which conflicts with current non-negotiable motion rule (“no video/image-sequence scrubbing”).

## Low
6. **Base README is still starter template**
   - Not reflective of architecture, setup, or project identity.

---

## 10. Recommended Next Implementation Sequence

1. **Lock canonical experience**
   - Keep `/` as primary recruiter journey.
   - Decide whether section routes remain utility mirrors or are removed/de-emphasized.

2. **Fix feedback reliability**
   - Mount `Sonner <Toaster />` globally in `layout.tsx`.

3. **Repository hygiene**
   - Remove/archive unused legacy motion/store files.
   - Update `manifest.ts` colors to match active light theme.

4. **Narrative polish pass**
   - Tune chapter handoff timings across mouse/trackpad/mobile.
   - Tighten chapter intro→peak→exit rhythm consistency.

5. **Documentation upgrade**
   - Replace default README with architecture + runbook + content-edit workflow.

---

## 11. Final Audit Conclusion

Your codebase has successfully transitioned from a fragmented prototype into a **serious cinematic portfolio architecture** with a scalable section system, typed content model, and robust motion foundation.

The project is now in the **high-potential polish phase**, not the rebuild phase.  
Once the high-priority fixes above are resolved (especially feedback reliability + canonical experience clarity), this can become a strong recruiter-facing, premium single-scroll portfolio experience.

