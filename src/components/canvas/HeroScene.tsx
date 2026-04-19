"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, ContactShadows, OrbitControls, Center } from "@react-three/drei";
import { Model as RetroComputer } from "./RetroComputer";

function SceneContent({ isMobile }: { isMobile: boolean }) {
  const { viewport } = useThree();
  const dynamicX = isMobile ? 0 : viewport.width / 4;
  const target = [dynamicX, isMobile ? -2 : -0.5, 0] as const;

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <Center position={target}>
          <RetroComputer scale={isMobile ? 0.25 : 0.4} rotation={[0, -0.15, 0]} />
        </Center>
      </Float>
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
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas dpr={[1, 2]} camera={{ position: [10, 7, 14], fov: 45 }} className="pointer-events-auto">
        <SceneContent isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
