"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface WarehouseCanvasProps {
  children: React.ReactNode;
  cameraY?: number;
  cameraZ?: number;
  fov?: number;
  lightBoost?: number;
}

export default function WarehouseCanvas({ children, cameraY = 2.4, cameraZ = 6, fov = 32, lightBoost = 1 }: WarehouseCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, cameraY, cameraZ], fov }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.8 * lightBoost} />
      <directionalLight position={[3, 5, 3]} intensity={1.2 * lightBoost} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35 * lightBoost} color="#8ab4ff" />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
