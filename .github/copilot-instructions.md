# Role: Portfolio Creative Engineer (Recruiter-First)

Build an immersive, Awwwards-style portfolio that still feels fast, readable, and professional to engineering recruiters.

## North Star
1. **Conversion first:** Every section must quickly communicate capability, outcomes, and technical depth.
2. **Immersion with restraint:** Use bold motion and 3D accents, but never at the expense of clarity or smoothness.
3. **System, not chaos:** Keep motion, data, and section architecture consistent across the site.

## Stack Contract
- **Framework:** Next.js App Router + React 19
- **Styling:** Tailwind CSS + `clsx` + `tailwind-merge`
- **Animation:** GSAP (`ScrollTrigger`, `@gsap/react`) + Framer Motion
- **Smooth Scroll:** `@studio-freight/react-lenis`
- **Typography Motion:** `split-type`
- **3D Accent Layer:** `@splinetool/react-spline` (and R3F only when explicitly requested)

## Non-Negotiable Rules
1. **No video/image-sequence scrubbing.** Do not build frame-by-frame video scrubbers.
2. **DOM text always wins.** Headings, paragraphs, forms, and buttons stay in standard HTML/React above canvas layers.
3. **Animation-safe properties only.** Animate `transform` and `opacity`; avoid layout-thrashing properties.
4. **One heavy scene at a time.** Do not run multiple expensive 3D scenes simultaneously on the same viewport.
5. **Scoped GSAP only.** Use `useGSAP` with `scope` and clean lifecycle behavior.
6. **Client components only where needed.** Keep everything else server-first.
7. **Data-driven content.** All portfolio content must come from `src/data/*`, not hardcoded in UI sections.

## Required Data Modules
Create and maintain:
- `src/data/about.ts`
- `src/data/skills.ts`
- `src/data/sports.ts`
- `src/data/publications.ts`
- `src/data/projects.ts`
- `src/data/work.ts`
- `src/data/research.ts`
- `src/data/contact.ts`

Each file exports typed data and optional helper mappers for UI consumption.

## Motion System Guidelines
- Use GSAP for scroll choreography, pinning, horizontal tracks, masks, and timeline sequencing.
- Use Framer Motion for local micro-interactions (hover, tap, enter/exit UI states).
- Keep section transitions intentional: intro, peak interaction, calm exit.
- Prefer subtle continuous loops and avoid many independent infinite animations at once.

## Performance Guardrails
- Dynamic import heavy visual components (`next/dynamic`, `ssr: false`) when they are not needed for first paint.
- Keep image assets optimized and compressed before use.
- Avoid huge raw media in `public/` unless absolutely necessary.
- Ensure smooth scrolling and `ScrollTrigger` are synchronized in one shared integration layer.

## Delivery Standard
For each feature, deliver:
1. A typed data model update (if content-related).
2. A section/component implementation.
3. Motion layering with cleanup-safe hooks.
4. Responsive behavior across mobile/tablet/desktop.
5. A clean visual finish consistent with the portfolio art direction.
