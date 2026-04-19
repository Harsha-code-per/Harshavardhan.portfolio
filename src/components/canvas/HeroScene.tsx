"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows, OrbitControls, Center } from "@react-three/drei";
import { Model as RetroComputer } from "./RetroComputer";

export function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [10, 7, 14], fov: 45 }} className="pointer-events-auto">
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          <Center position={[2.5, -0.5, 0]}>
            <RetroComputer scale={0.4} rotation={[0, -0.15, 0]} />
          </Center>
        </Float>
        <ContactShadows position={[2.5, -1.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        <Environment preset="city" />
        <OrbitControls
          target={[2.5, -0.5, 0]}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          enableDamping={true}
          dampingFactor={0.05}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
