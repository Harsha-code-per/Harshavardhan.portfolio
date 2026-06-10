"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import { Model as RetroComputer } from "./RetroComputer";
import { gsap, setupGsap } from "@/lib/gsap";

/**
 * Lightweight inline error boundary — catches HDR fetch failures from drei's
 * <Environment preset> and renders nothing instead of crashing the scene.
 * (React error boundaries must be class components.)
 */
class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

// Stops rendering when hero is off-screen to free the GPU.
// Hooks into GSAP's shared ticker so both animation systems share one RAF loop
// instead of competing setInterval vs RAF.
function RenderController({ isVisible }: { isVisible: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!isVisible) return;
    // Drive R3F invalidation from GSAP's ticker (shared RAF — zero extra loops)
    const onTick = () => invalidate();
    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [isVisible, invalidate]);
  return null;
}

/**
 * EnvironmentWithFallback — wraps drei's <Environment preset> in an error
 * boundary so that a failed HDR fetch (common on mobile / restricted networks)
 * degrades gracefully instead of crashing the whole scene.
 */
function EnvironmentWithFallback() {
  return (
    <SceneErrorBoundary fallback={null}>
      <Environment preset="city" background={false} />
    </SceneErrorBoundary>
  );
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const { invalidate, viewport } = useThree();
  const target = [isMobile ? 0 : 0.5, isMobile ? -2 : 0, 0] as const;
  const modelRigRef = useRef<Group>(null);

  useEffect(() => {
    const modelRig = modelRigRef.current;
    if (!modelRig) return;

    const startX = modelRig.position.x;
    const startY = modelRig.position.y;
    const startZ = modelRig.position.z;
    const startRotationY = modelRig.rotation.y;
    const startScale = modelRig.scale.x;
    const handoffScale = startScale * 0.8;
    let rafId: number | null = null;
    let lastSpinProgress = -1;
    let lastTravelProgress = -1;

    const updateFromScroll = () => {
      const hero = document.getElementById("hero-master-container");
      const heroTop = hero?.offsetTop ?? 0;
      const spinDistance = window.innerHeight * 1.1;
      const progress = Math.min(Math.max((window.scrollY - heroTop) / spinDistance, 0), 1);
      const travelProgress = Math.min(Math.max((window.scrollY - heroTop) / (window.innerHeight * 1.65), 0), 1);
      if (progress === lastSpinProgress && travelProgress === lastTravelProgress) {
        return;
      }
      lastSpinProgress = progress;
      lastTravelProgress = travelProgress;
      
      const targetX = isMobile ? 0 : 2.2;
      const targetY = isMobile ? -0.35 : -0.25;
      const targetZ = isMobile ? -0.2 : -0.75;

      modelRig.rotation.y = startRotationY + progress * Math.PI * 2;
      modelRig.position.set(
        startX + (targetX - startX) * travelProgress,
        startY + (targetY - startY) * travelProgress,
        startZ + (targetZ - startZ) * travelProgress
      );
      const scale = startScale + (handoffScale - startScale) * travelProgress;
      modelRig.scale.set(scale, scale, scale);
      invalidate();
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateFromScroll();
      });
    };

    updateFromScroll();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      modelRig.position.set(startX, startY, startZ);
      modelRig.rotation.y = startRotationY;
      modelRig.scale.set(startScale, startScale, startScale);
    };
  }, [invalidate, isMobile, viewport.width]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow={false} />
      <pointLight position={[-4, 3, 6]} intensity={1.6} color="#f97316" distance={18} />
      <pointLight position={[6, -2, -4]} intensity={1.2} color="#00f2fe" distance={16} />
      <group ref={modelRigRef}>
        <Center position={target}>
          <RetroComputer scale={isMobile ? 0.25 : 0.4} rotation={[0, -0.15, 0]} />
        </Center>
      </group>
      {/* HDR environment — wrapped in error boundary so mobile fetch failures
          degrade to ambient light only instead of crashing the scene */}
      <EnvironmentWithFallback />
    </>
  );
}

export function HeroScene() {
  setupGsap();

  const [isMobile, setIsMobile] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Stop rendering 3D scene when user scrolls away — eliminates permanent GPU drain
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        // Lower DPR cap on mobile to reduce GPU load significantly
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="demand"
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        camera={{ position: [10, 7, 14], fov: 45 }}
        className="pointer-events-auto"
      >
        <RenderController isVisible={isHeroVisible} />
        <SceneContent isMobile={isMobile} />
      </Canvas>
      <div
        className="absolute bottom-[20%] left-1/2 w-[60%] max-w-[500px] h-8 rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
          transform: `translateX(${isMobile ? "-50%" : "10%"})`,
        }}
      />
    </div>
  );
}
