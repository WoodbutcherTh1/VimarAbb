"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brand, Product, getAllProducts } from "@/lib/data";
import { PRICE_COLOR_RAISED, accentOnRaised } from "@/lib/showroomConfig";

interface BrandFloatCardProps {
  brand: Brand;
  isExiting: boolean;
  isOtherExiting: boolean;
  exitDurationMs: number;
  onPick: (brandId: string) => void;
}

export default function BrandFloatCard({
  brand,
  isExiting,
  isOtherExiting,
  exitDurationMs,
  onPick,
}: BrandFloatCardProps) {
  const products = getAllProducts(brand);
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);

  useEffect(() => {
    if (products.length < 2) return;
    const id = setInterval(() => {
      setActiveProduct((prev) => {
        const pool = products.filter((p) => p.id !== prev.id);
        return pool[Math.floor(Math.random() * pool.length)] ?? prev;
      });
    }, 3800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      data-cursor-hover
      data-brand={brand.id}
      onClick={() => onPick(brand.id)}
      className="group relative flex flex-col overflow-hidden rounded-md border border-default bg-raised shadow-1 text-left w-[46vw] max-w-[200px] sm:w-52 md:w-64"
      style={{
        animationName: isExiting || isOtherExiting ? "none" : "float-bob",
        animationDuration: "7s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDelay: brand.id === "vimar" ? "0s" : "-3.5s",
        ["--float-rot" as string]: "0deg",
        ["--float-rot-alt" as string]: "0deg",
        transition: `transform ${isExiting ? exitDurationMs : 400}ms cubic-bezier(0.6,0,0.9,0.4), opacity 300ms ease`,
        transform: isExiting ? "scale(1.5)" : isOtherExiting ? "scale(0.9)" : undefined,
        opacity: isOtherExiting ? 0 : 1,
        zIndex: isExiting ? 60 : 10,
      }}
    >
      {/* Product art — nothing is written over it, so the label needs no
          blackout scrim and stays readable at any card size. */}
      <div className="relative aspect-square w-full overflow-hidden bg-default/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${activeProduct.image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-raised to-transparent" />
      </div>

      {/* Info panel */}
      <div className="px-4 pb-4 pt-3">
        <p className="text-[13px] text-secondary leading-snug line-clamp-2 min-h-[2.4em]">
          {activeProduct.name}
        </p>
        <div className="flex items-baseline justify-between gap-2 mt-2">
          <h3 className="text-xl font-bold tracking-tight text-secondary leading-none">
            {brand.logoText}
          </h3>
          <span
            className="text-sm font-semibold tabular-nums leading-none"
            style={{ color: PRICE_COLOR_RAISED }}
          >
            {activeProduct.currency} {activeProduct.price.toFixed(0)}
          </span>
        </div>
        <p className="text-[13px] text-secondary/70 mt-1.5 line-clamp-1">{brand.tagline}</p>
      </div>

      {/* Hover ring */}
      <div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 2px ${accentOnRaised(brand.id)}` }}
      />

      <div
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: brand.accentColor, color: brand.id === "vimar" ? "#1a1a2e" : "#fff" }}
      >
        →
      </div>
    </button>
  );
}