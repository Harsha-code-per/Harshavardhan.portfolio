"use client";

import { Component, type ReactNode, useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import { Model as RetroComputer } from "./RetroComputer";
import { gsap, setupGsap } from "@/lib/gsap";

function RenderTrigger() {
  const { invalidate } = useThree();
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      invalidate();
      count++;
      if (count > 15) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [invalidate]);
  return null;
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const { invalidate, viewport } = useThree();
  const target = [isMobile ? 0 : 0.5, isMobile ? -2 : 0, 0] as const;
  const modelRigRef = useRef<THREE.Group>(null);

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
      // #hero-master-container is placed at the top of the viewport (top of document),
      // so heroTop is statically 0. This completely eliminates forced DOM reflows.
      const heroTop = 0;
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

    const handlePreloaderComplete = () => {
      let count = 0;
      const interval = setInterval(() => {
        invalidate();
        count++;
        if (count > 25) clearInterval(interval);
      }, 50);
    };
    window.addEventListener("preloaderComplete", handlePreloaderComplete);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      modelRig.position.set(startX, startY, startZ);
      modelRig.rotation.y = startRotationY;
      modelRig.scale.set(startScale, startScale, startScale);
    };
  }, [invalidate, isMobile, viewport.width]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#222222" />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow={false} />
      <directionalLight position={[-5, 5, 5]} intensity={0.8} />
      <group ref={modelRigRef}>
        <Center position={target}>
          <RetroComputer scale={isMobile ? 0.25 : 0.4} rotation={[0, -0.15, 0]} />
        </Center>
      </group>
      <Suspense fallback={null}>
        <Environment preset="city" background={false} />
        <RenderTrigger />
      </Suspense>
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
    <div ref={containerRef} className="w-full h-full relative bg-[#050505]">
      {isHeroVisible && (
        <>
          <Canvas
            // Lower DPR cap on mobile to reduce GPU load significantly
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            performance={{ min: 0.5 }}
            frameloop="demand"
            gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
            camera={{ position: [10, 7, 14], fov: 45 }}
            className="pointer-events-auto"
          >
            <Suspense fallback={null}>
              <SceneContent isMobile={isMobile} />
            </Suspense>
          </Canvas>
          <div
            className="absolute bottom-[20%] left-1/2 w-[60%] max-w-[500px] h-8 rounded-full pointer-events-none opacity-40"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
              transform: `translateX(${isMobile ? "-50%" : "10%"})`,
            }}
          />
        </>
      )}
    </div>
  );
}
