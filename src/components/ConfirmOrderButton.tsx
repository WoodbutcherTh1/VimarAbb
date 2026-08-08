"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import WarehouseCanvas from "@/components/warehouse/WarehouseCanvas";
import Actor from "@/components/warehouse/Actor";

const PLAY_MS = 2100;

type Phase = "idle" | "playing" | "closing";

export default function ConfirmOrderButton({
  accentColor,
  onConfirmed,
}: {
  accentColor: string;
  onConfirmed: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("playing");
    window.setTimeout(() => setPhase("closing"), PLAY_MS);
    window.setTimeout(() => {
      setPhase("idle");
      onConfirmed();
    }, PLAY_MS + 450);
  };

  const expanded = phase !== "idle";

  return (
    <motion.button
      onClick={handleClick}
      className="relative w-full rounded-xl text-sm font-semibold uppercase tracking-wider text-white overflow-hidden"
      style={{ backgroundColor: expanded ? "#1c1c20" : accentColor }}
      animate={{ height: expanded ? 68 : 56 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      whileHover={!expanded ? { scale: 1.02 } : undefined}
      whileTap={!expanded ? { scale: 0.97 } : undefined}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.span
            key="label"
            className="absolute inset-0 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Confirm Order
            <ArrowUpRight className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.div
            key="scene"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            {phase === "playing" && (
              <WarehouseCanvas cameraY={0.75} cameraZ={2.6} fov={28}>
                <Actor
                  url="/models/forklift.glb"
                  fromX={-1.8}
                  toX={1.3}
                  y={-0.18}
                  z={0.15}
                  scale={0.00135}
                  rotationY={Math.PI / 2}
                  durationMs={1700}
                  delayMs={100}
                />
                <Actor
                  url="/models/pilot-avatar.glb"
                  fromX={1.5}
                  toX={-0.8}
                  y={-0.5}
                  z={-0.15}
                  scale={0.0256}
                  rotationY={-Math.PI / 2}
                  durationMs={1700}
                  delayMs={300}
                  bob
                />
              </WarehouseCanvas>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
