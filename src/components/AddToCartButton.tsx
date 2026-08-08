"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import WarehouseCanvas from "@/components/warehouse/WarehouseCanvas";
import Actor from "@/components/warehouse/Actor";

const PLAY_MS = 1900;

type Phase = "idle" | "playing" | "closing";

export default function AddToCartButton({ product, accentColor }: { product: Product; accentColor: string }) {
  const { addItem } = useCart();
  const [phase, setPhase] = useState<Phase>("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    addItem(product);
    setPhase("playing");
    window.setTimeout(() => setPhase("closing"), PLAY_MS);
    window.setTimeout(() => setPhase("idle"), PLAY_MS + 450);
  };

  const expanded = phase !== "idle";

  return (
    <motion.button
      onClick={handleClick}
      className="relative w-full rounded-xl font-semibold text-sm uppercase tracking-wider text-white overflow-hidden"
      style={{ backgroundColor: expanded ? "#1c1c20" : accentColor }}
      animate={{ height: expanded ? 64 : 56 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      whileHover={!expanded ? { scale: 1.02, filter: "brightness(1.1)" } : undefined}
      whileTap={!expanded ? { scale: 0.98 } : undefined}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.span
            key="label"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Add to Cart
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
                  url="/models/twelve-robot.glb"
                  fromX={-1.7}
                  toX={0.3}
                  y={-0.42}
                  z={0.15}
                  scale={0.08}
                  rotationY={Math.PI / 2}
                  durationMs={1400}
                  delayMs={150}
                />
                <Actor
                  url="/models/mitaside-dummy.glb"
                  fromX={-2.0}
                  toX={0.1}
                  y={-0.5}
                  z={-0.15}
                  scale={0.4}
                  rotationY={Math.PI / 2}
                  durationMs={1400}
                  delayMs={300}
                />
              </WarehouseCanvas>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ShoppingCart className="w-5 h-5 text-white/60" strokeWidth={1.5} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
