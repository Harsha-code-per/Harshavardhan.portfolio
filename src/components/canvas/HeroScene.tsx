"use client";

import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows, OrbitControls, Center } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { Model as RetroComputer } from "./RetroComputer";
import { gsap, setupGsap } from "@/lib/gsap";

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const target = [isMobile ? 0 : 2.5, isMobile ? -2 : -0.5, 0] as const;
  const modelRigRef = useRef<Group>(null);

  useGSAP(
    () => {
      const modelRig = modelRigRef.current;
      if (!modelRig) {
        return;
      }

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
        .to(
          modelRig.rotation,
          {
            y: Math.PI * 2,
            duration: 0.75,
            ease: "none",
          },
          0.25
        )
        .to(
          modelRig.scale,
          {
            x: handoffScale,
            y: handoffScale,
            z: handoffScale,
            duration: 0.75,
            ease: "none",
          },
          0.25
        );

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
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <group ref={modelRigRef}>
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          <Center position={target}>
            <RetroComputer scale={isMobile ? 0.25 : 0.4} rotation={[0, -0.15, 0]} />
          </Center>
        </Float>
      </group>
      <ContactShadows
        position={[target[0], target[1] - 1, target[2]]}
        opacity={0.5}
        scale={isMobile ? 7 : 10}
        blur={2.5}
        far={4}
      />
      <Environment preset="city" />
      <OrbitControls
        target={target}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        enableDamping={true}
        dampingFactor={0.05}
        makeDefault
      />
    </>
  );
}

export function HeroScene() {
  setupGsap();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 2]} camera={{ position: [10, 7, 14], fov: 45 }} className="pointer-events-auto">
        <SceneContent isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
