# 🌌 Harshavardhan K // Cinematic Portfolio System

> **Awwwards-inspired portfolio blending deep AI engineering logic with ultra-fluid motion choreography and interactive WebGL simulations.**
> 
> Primary Domain: [www.harshavardhan-k.me](https://www.harshavardhan-k.me)

---

## ⚡ Core Philosophy
This system is engineered not just as a portfolio, but as a **Cinematic Interface Layer**. It is built on a custom HUD (Heads-Up Display) aesthetic that moves seamlessly across immersive experiences and responsive recruiter-first layouts.

```
                  ┌───────────────────────────────┐
                  │      Immersive Mode / 3D      │
                  └───────────────┬───────────────┘
                                  │
                       [Audio-Visual Toggles]
                                  │
                  ┌───────────────▼───────────────┐
                  │      Recruiter Mode / HUD     │
                  └───────────────────────────────┘
```

---

## 🛠️ Tech Stack & Architecture

This system uses cutting-edge web technologies, carefully optimized for fast initial load and flawless 60 FPS performance.

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org) — Static site generation (SSG) with React Server Components.
*   **Libraries:** React 19, TypeScript 6.
*   **Styling & Theme:** [Tailwind CSS v4](https://tailwindcss.com) — Leverages CSS-first `@theme` variables for lightning-fast styling compilation.
*   **Motion Choreography:** [GSAP (GreenSock)](https://gsap.com) + `@gsap/react` — Micro-interactions, timeline-based sequencing, and coordinate tracking.
*   **WebGL Rendering:** Three.js + [React Three Fiber](https://r3f.docs.pmnd.rs/) + `@react-three/drei` — High-performance 3D scene representation with adaptive mobile GPU scaling.
*   **Smooth Scroll:** [Lenis Scroll](https://lenis.darkroom.engineering) — Physics-based scroll interpolation synchronized with GSAP ScrollTrigger.
*   **State Management:** [Zustand](https://zustand.docs.pmnd.rs) — Lightweight global state hooks for sound toggles and recruiter mode routing.

---

## 💎 Features

### 1. WebGL Hero Scene (`src/components/canvas/HeroScene.tsx`)
Interactive retro-futuristic terminal rendering using custom 3D mesh pipelines. Dynamic device pixel ratio (DPR) calculation reduces mobile battery drain while preserving crystal-clear resolutions on Retina screens.

### 2. 3D Particle Morph Canvas (`src/components/ui/SkillsBento.tsx`)
Interactive HTML5 canvas displaying high-density particles that organically morph into layout grid nodes based on active competency coordinates.

### 3. Biometric Pulse Waveform (`src/components/ui/SportsSection.tsx`)
A mathematically model-generated real-time ECG biometric waveform matching active play workloads (up to 138 BPM simulation) when tracking sports conditioning categories.

### 4. Resend Telemetry Gateway (`src/app/actions/sendEmail.ts`)
Serverless contact broadcasting system using secure Next.js Server Actions linked directly to the Resend SMTP layer.

### 5. Multi-Mode Layout
*   **Immersive Mode:** Space, motion, 3D animations, and cinematic scroll triggers.
*   **Recruiter Mode:** Clear, structured grid optimizing reading flow and immediate access to print-friendly experience milestones.

---

## ⚙️ Development & Deployment

### Local Configuration

1.  **Clone & Install Dependencies:**
    ```bash
    git clone https://github.com/Harsha-code-per/Harshavardhan.portfolio.git
    cd Harshavardhan.portfolio
    pnpm install
    ```

2.  **Environment Setup:**
    Create a `.env.local` file:
    ```env
    RESEND_API_KEY=your_resend_api_key_here
    ```

3.  **Start Development Server:**
    ```bash
    pnpm run dev
    ```

4.  **Production Verification:**
    ```bash
    pnpm run build
    ```

---

## 📈 Performance & SEO Focus
*   **Asset Cleansing:** Clean project footprint with zero redundant public boilerplate logos.
*   **Favicon Routing:** Internal Next.js routing for `/icon.png` and `/apple-icon.png` mappings.
*   **JSON-LD Structured Data:** Full schema validation (`Person` type) synced directly from the global profile configuration in `profile.ts`.
*   **Vercel Optimized:** Deployed globally with optimized build caches and serverless edge functions.

---
*Transmission Established // Harshavardhan K © 2026*

