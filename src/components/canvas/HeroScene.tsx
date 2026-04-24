"use client";

import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { Model as RetroComputer } from "./RetroComputer";
import { gsap, setupGsap } from "@/lib/gsap";

// Stops rendering when hero is off-screen to free the GPU
function RenderController({ isVisible }: { isVisible: boolean }) {
  const { invalidate, gl } = useThree();
  useEffect(() => {
    if (isVisible) {
      const id = setInterval(() => invalidate(), 1000 / 60);
      return () => clearInterval(id);
    } else {
      gl.setAnimationLoop(null);
    }
  }, [isVisible, invalidate, gl]);
  return null;
}

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const target = [isMobile ? 0 : 0.5, isMobile ? -2 : 0, 0] as const;
  const modelRigRef = useRef<Group>(null);

  useGSAP(
    () => {
      const modelRig = modelRigRef.current;
      if (!modelRig) return;

      const startX = modelRig.position.x;
      const startY = modelRig.position.y;
      const startZ = modelRig.position.z;
      const startRotationY = modelRig.rotation.y;
      const startScale = modelRig.scale.x;
      const handoffScale = startScale * 0.8;

      const handoffTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-master-container",
          start: "top top",
          end: "+=100%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      handoffTimeline
        .to({}, { duration: 0.25 })
        .to(modelRig.rotation, { y: Math.PI * 2, duration: 0.75, ease: "none" }, 0.25)
        .to(modelRig.scale, { x: handoffScale, y: handoffScale, z: handoffScale, duration: 0.75, ease: "none" }, 0.25);

      return () => {
        handoffTimeline.scrollTrigger?.kill();
        handoffTimeline.kill();
        modelRig.position.set(startX, startY, startZ);
        modelRig.rotation.y = startRotationY;
        modelRig.scale.set(startScale, startScale, startScale);
      };
    },
    { dependencies: [isMobile] }
  );

  return (
    <>
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow={false} />
      <group ref={modelRigRef}>
        <Center position={target}>
          <RetroComputer scale={isMobile ? 0.25 : 0.4} rotation={[0, -0.15, 0]} />
        </Center>
      </group>
      <Environment preset="city" background={false} />
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
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="demand"
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
