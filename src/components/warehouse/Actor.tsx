"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ActorProps {
  url: string;
  fromX: number;
  toX: number;
  y?: number;
  z?: number;
  scale?: number;
  rotationY?: number;
  durationMs: number;
  delayMs?: number;
  bob?: boolean;
}

export default function Actor({
  url,
  fromX,
  toX,
  y = 0,
  z = 0,
  scale = 1,
  rotationY = 0,
  durationMs,
  delayMs = 0,
  bob = false,
}: ActorProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const first = Object.values(actions)[0];
    first?.reset().play();
    return () => {
      first?.stop();
    };
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const elapsedMs = (state.clock.elapsedTime - startRef.current) * 1000 - delayMs;
    const t = Math.min(1, Math.max(0, elapsedMs / durationMs));
    const eased = 1 - Math.pow(1 - t, 3);
    group.current.position.x = fromX + (toX - fromX) * eased;
    group.current.position.y = y + (bob ? Math.abs(Math.sin(t * Math.PI * 6)) * 0.08 : 0);
    group.current.position.z = z;
    group.current.visible = elapsedMs >= 0;
  });

  return <primitive ref={group} object={scene} scale={scale} rotation={[0, rotationY, 0]} />;
}

useGLTF.preload("/models/twelve-robot.glb");
useGLTF.preload("/models/mitaside-dummy.glb");
useGLTF.preload("/models/pilot-avatar.glb");
useGLTF.preload("/models/forklift.glb");
