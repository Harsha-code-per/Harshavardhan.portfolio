# 🌌 HARSHAVARDHAN K // CINEMATIC PORTFOLIO SYSTEM

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-orange?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=for-the-badge&logo=turbopack&logoColor=white)](https://turbo.build/)

An elite, high-performance creative portfolio blending deep AI engineering diagnostics, real-time WebGL rendering, and physics-based motion choreography. Built with a responsive cyber-hud aesthetic, it seamlessly pivots between an immersive 3D space and a highly structured, print-friendly recruiter layout.

> 🌐 **Production Gateway:** [www.harshavardhan-k.me](https://www.harshavardhan-k.me)

---

## ⚡ Core Philosophy & Layout Pivoting

This system is engineered as an interactive **Cinematic Interface Layer**. The UX features a unified audio-visual feedback model that allows developers and recruiters to shift layout paradigms instantly:

```
               ┌─────────────────────────────────────────────────┐
               │    IMMERSIVE MODE // 3D HUD (CREATIVE SCREEN)   │
               └───────────────────────┬─────────────────────────┘
                                       │
                         [ sound toggle / store state ]
                                       │
               ┌───────────────────────▼─────────────────────────┐
               │     RECRUITER MODE // TELEMETRY GRID (CLEAN)    │
               └─────────────────────────────────────────────────┘
```

*   **Immersive Mode:** Scroll-locked 3D canvas triggers, interactive particle grids, real-time biometric SVG streams, and canvas stardust warp animations.
*   **Recruiter Mode:** High-contrast, clean reading layouts stripped of complex animations, offering instant access to profile parameters and a dynamic, standalone HTML resume compiler.

---

## 🚀 Key Performance Architectures (60 FPS Locked)

Achieving smooth 60 FPS performance on lower-powered devices was achieved through strict DOM-decoupling and compositor-acceleration:

### 1. Scroll State Decoupling (Timeline Experience)
*   **The Issue:** Custom scroll paths calculate velocity and stardust coordinates on scroll. Doing this via React state hooks forces 100+ virtual DOM re-renders during a single scroll, causing CPU stutter.
*   **The Fix:** Removed state hooks. Scroll coordinates write directly to the SVG probe node (`probeRef.current.setAttribute("transform")`), and speed metrics are injected directly into the DOM text (`velocityTextRef.current.textContent`). React re-renders are reduced from **100+ to exactly 3** per section scroll.

### 2. GPU Compositor-Accelerated Hovers (Bento & Contact)
*   **The Issue:** Magnetic card tilting and hover mouse tracking originally fired `gsap.to` tweens on high-frequency `mousemove` events, creating thread-blocking queues.
*   **The Fix:** Refactored hovers to write `translate3d` and `rotate3d` inline styles with native cubic-bezier transitions. Calculations run entirely on the GPU compositor thread, consuming zero JS animation cycles.

### 3. Canvas Paint Optimization (Dual-Pass Halo Glow)
*   **The Issue:** Setting `ctx.shadowBlur` inside canvas drawing loops (particles, stars, waves) forces the browser to run CPU-bound Gaussian blurs, dropping mobile frame rates.
*   **The Fix:** Removed all canvas shadow blurs. Glowing elements render using **dual-pass circle drawing** (a large, soft outer halo circle with low opacity, followed by the solid inner core), which is fully GPU-accelerated.

---

## 🔒 Security Gate & Server Actions

The contact transceiving gateway features robust validation and anti-spam measures:
*   **Honeypot Trap:** Visual-hidden inputs (`botField`) catch automated spam bots. If populated, payloads are instantly discarded.
*   **Size Cappings:** Strict length limits on inputs (Name <= 100, Email <= 256, Message <= 5000) protect server memory and SMTP allocations.
*   **Format Verification:** Strict RFC 5322-compliant email regex validates routing gateways.
*   **Config Resilience:** Resend SMTP clients instantiate dynamically on request, preventing server startup crashes.

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 16.2.3 (App Router) using React 19 and TypeScript 6.
*   **Bundler:** Rust-powered **Turbopack** for development compiling (eliminates Webpack memory overhead).
*   **Style Engine:** Tailwind CSS v4.0.0 with CSS-first `@theme` design tokens.
*   **Motion Dynamics:** GSAP (GreenSock) + Lenis Scroll synchronized on a unified requestAnimationFrame ticker.
*   **WebGL Graphics:** Three.js 0.182.0 + React Three Fiber 9.0 (optimized version-aligned dependency footprint to prevent internal Clock deprecation warnings).

---

## 📁 Codebase Directory Structure

```
src/
├── app/
│   ├── actions/               # Secure Server Actions (email dispatch)
│   ├── layout.tsx             # Root layout & DOM stacking context wrappers
│   └── page.tsx               # Main entry screen routing
├── components/
│   ├── canvas/                # WebGL ThreeJS meshes and R3F scene rigs
│   │   ├── HeroScene.tsx      # Interactive 3D Terminal Scene
│   │   └── RetroComputer.tsx  # gltfjsx decompressed 3D asset model
│   ├── layout/                # Root navigation overlays & scrollers
│   └── ui/                    # Fluid interactive UI interface panels
│       ├── HorizontalProjects.tsx # 3D Depth Card stack & swipe sliders
│       ├── TimelineExperience.tsx # Ref-based winding career pathway
│       ├── ResearchSection.tsx    # UAV target lines & vector canvas
│       └── SkillsBento.tsx        # Morphing AI particle canvas
├── data/                      # Structured profile dossier database
└── lib/                       # Unified gsap ticker & store configurations
```

---

## ⚙️ Local Configuration & Development

### 1. Setup Environment
Ensure [pnpm](https://pnpm.io/) is installed on your local workstation. Clone the system:
```bash
git clone https://github.com/Harsha-code-per/Harshavardhan.portfolio.git
cd Harshavardhan.portfolio
pnpm install
```

### 2. Credentials Injection
Create a `.env.local` file inside the root workspace folder:
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_TO_EMAIL=your_inbox@domain.com
```

### 3. Arm Engines (Turbopack Dev Mode)
Starts the local development server under high-performance Rust compiler compilation:
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 4. Code Verification (Lint & Production Compile)
Verify compilation and perform static optimization checks:
```bash
pnpm run lint
pnpm run build
```

---

## 🧪 Testing Suite

Run the contact security validation test suite to confirm spam filters, honeypot blocks, and character length caps are fully functional:
```bash
npx --yes tsx src/lib/run-validation-tests.ts
```

---
*Transmission Established // Harshavardhan K © 2026*
