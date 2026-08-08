"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Hand,
  ShoppingCart,
  Loader2,
  PackageSearch,
  ClipboardCheck,
  PackageCheck,
  Truck,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { useCart, OrderStage } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const STAGE_META: Record<OrderStage, { label: string; icon: LucideIcon; pulse?: boolean }> = {
  greeting: { label: "Welcome — explore the showroom", icon: Hand },
  building: { label: "Building your order", icon: ShoppingCart },
  processing: { label: "Processing your order", icon: Loader2, pulse: true },
  picking: { label: "Order being picked", icon: PackageSearch, pulse: true },
  checking: { label: "Your order is being checked", icon: ClipboardCheck, pulse: true },
  ready: { label: "Ready — awaiting driver pickup", icon: PackageCheck },
  "with-driver": { label: "With your driver — on its way", icon: Truck, pulse: true },
  delivered: { label: "Delivered — enjoy!", icon: PartyPopper },
};

const STAGE_ORDER: OrderStage[] = [
  "greeting",
  "building",
  "processing",
  "picking",
  "checking",
  "ready",
  "with-driver",
  "delivered",
];

export default function OrderStatusBar({ accentColor }: { accentColor: string }) {
  const { stage } = useCart();
  const meta = STAGE_META[stage];
  const stageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className="relative px-6 py-3.5 border-b border-white/5 bg-black/20 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
            style={{ backgroundColor: `${accentColor}1a` }}
          >
            <meta.icon
              className={cn("w-3.5 h-3.5", meta.pulse && "animate-spin")}
              style={{ color: accentColor }}
            />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/70">
            {meta.label}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-px bg-white/10" style={{ top: "50%" }} />
        <motion.div
          className="absolute left-0 h-px"
          style={{ backgroundColor: accentColor, top: "50%" }}
          initial={false}
          animate={{ width: `${(stageIndex / (STAGE_ORDER.length - 1)) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {STAGE_ORDER.map((s, i) => {
          const StepIcon = STAGE_META[s].icon;
          const done = i < stageIndex;
          const active = i === stageIndex;
          return (
            <div key={s} className="relative z-10 flex-1 flex flex-col items-center first:items-start last:items-end">
              <motion.div
                className="flex items-center justify-center rounded-full border"
                style={{
                  width: active ? 22 : 14,
                  height: active ? 22 : 14,
                  backgroundColor: done || active ? accentColor : "#0a0a0f",
                  borderColor: done || active ? accentColor : "rgba(255,255,255,0.15)",
                }}
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {active && <StepIcon className="w-3 h-3 text-black" strokeWidth={2.5} />}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
