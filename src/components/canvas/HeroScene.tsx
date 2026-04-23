"use client";

import React, { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Preload, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { Model } from "./RetroComputer";
import { MathUtils } from "three";

function SceneContent({ isMobile, prefersReducedMotion }: { isMobile: boolean, prefersReducedMotion: boolean }) {
  const pivotRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const proxy = useRef({
    rotationY: 0,
    scale: isMobile || prefersReducedMotion ? 0.92 : 0.88,
  });

  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-master-container",
        start: "top top",
        end: "+=120%",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // We animate a proxy object and apply it in useFrame
    proxy.current.rotationY = 0;
    proxy.current.scale = 1;
    
    timeline
      .to(proxy.current, {
        rotationY: Math.PI * 2,
        duration: 1,
        ease: "none",
      }, 0)
      .to(proxy.current, {
        scale: isMobile || prefersReducedMotion ? 0.92 : 0.88,
        duration: 1,
        ease: "none",
      }, 0);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [isMobile, prefersReducedMotion]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (pivotRef.current) {
      pivotRef.current.position.y = Math.sin(elapsed * 0.8) * 0.12 - 0.06;
      
      pivotRef.current.position.y = Math.sin(elapsed * 0.8) * 0.12 - 0.06;
      pivotRef.current.rotation.z = Math.sin(elapsed * 0.35) * 0.02;
      pivotRef.current.rotation.y = proxy.current.rotationY;
      pivotRef.current.scale.setScalar(proxy.current.scale);
    }
    if (shadowRef.current) {
      shadowRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.04);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsed * 0.04;
      particlesRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.05;
    }
  });

  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array((isMobile || prefersReducedMotion ? 48 : 92) * 3);
    for (let index = 0; index < positions.length; index += 3) {
      positions[index] = (Math.random() - 0.5) * 24;
      positions[index + 1] = (Math.random() - 0.5) * 16;
      positions[index + 2] = (Math.random() - 0.5) * 18;
    }
    return positions;
  }, [isMobile, prefersReducedMotion]);

  const modelScale = isMobile || prefersReducedMotion ? 0.18 : 0.28;

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={isMobile || prefersReducedMotion ? 1.5 : 1.8} color="#fff3e8" />
      <directionalLight
        position={[10, 12, 8]}
        intensity={isMobile || prefersReducedMotion ? 2.5 : 3.2}
        color="#ffddb4"
      >
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 0.5, 40]} />
      </directionalLight>
      <pointLight position={[-8, 4, 5]} intensity={isMobile || prefersReducedMotion ? 10 : 16} color="#e65f2b" distance={50} decay={2} />
      <pointLight position={[7, 5, -8]} intensity={isMobile || prefersReducedMotion ? 7 : 11} color="#eab308" distance={50} decay={2} />

      <group ref={pivotRef}>
        <Model 
          position={[2.8, -1.8, 0]} 
          scale={modelScale} 
          rotation={[0.15, 0.4, 0]} 
        />
      </group>



      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[2.8, -3.2, 0]} scale={[0.8, 0.6, 0.8]}>
        <circleGeometry args={[4.8, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
      </mesh>

      <Points ref={particlesRef} positions={particlePositions} position={[0, -0.4, 0]}>
        <PointMaterial
          transparent
          color="#f4f0ea"
          size={isMobile || prefersReducedMotion ? 0.03 : 0.045}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isMobile || prefersReducedMotion ? 0.16 : 0.22}
        />
      </Points>
    </>
  );
}

export function HeroScene() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches);

    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 45 }}
      dpr={isMobile ? 1 : [1, 2]}
      gl={{ antialias: !(isMobile || prefersReducedMotion), powerPreference: "high-performance" }}
      className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(230,95,43,0.18),transparent_35%),radial-gradient(circle_at_75%_35%,rgba(234,179,8,0.12),transparent_32%),linear-gradient(135deg,#0c0b0a_0%,#121110_100%)]"
    >
      <Suspense fallback={null}>
        <SceneContent isMobile={isMobile} prefersReducedMotion={prefersReducedMotion} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
