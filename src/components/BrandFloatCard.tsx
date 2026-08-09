"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brand, Product, getAllProducts } from "@/lib/data";
import { PRICE_COLOR } from "@/lib/showroomConfig";

interface BrandFloatCardProps {
  brand: Brand;
  tiltDeg: number;
  floatDuration: number;
  floatDelay: string;
  isExiting: boolean;
  isOtherExiting: boolean;
  exitDurationMs: number;
  onPick: (brandId: string) => void;
}

export default function BrandFloatCard({
  brand,
  tiltDeg,
  floatDuration,
  floatDelay,
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
      className={[
        "landing-card group absolute flex flex-col overflow-hidden rounded-[20px]",
        // Opaque, and deliberately no backdrop-blur: the card runs a looping
        // transform animation, and blur-on-a-moving-layer drops the artwork
        // on some compositors. At this opacity the blur bought nothing.
        "border border-white/15 bg-[#191b23]",
        "shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)]",
        "w-[40vw] max-w-[190px] sm:w-44 md:w-60",
        "bottom-[14vh] md:bottom-[20vh]",
        tiltDeg < 0
          ? "left-[6%] sm:left-[9%] md:left-[12%]"
          : "right-[6%] sm:right-[9%] md:right-[12%]",
      ].join(" ")}
      style={{
        transformOrigin: "center",
        animationName: isExiting || isOtherExiting ? "none" : "float-bob",
        animationDuration: `${floatDuration}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDelay: floatDelay,
        ["--float-rot" as string]: `${tiltDeg}deg`,
        ["--float-rot-alt" as string]: `${tiltDeg * -0.6}deg`,
        transition: `transform ${isExiting ? exitDurationMs : 400}ms cubic-bezier(0.6,0,0.9,0.4), opacity 300ms ease`,
        transform: isExiting
          ? "scale(16) rotate(0deg)"
          : isOtherExiting
            ? "scale(0.85)"
            : `rotate(${tiltDeg}deg)`,
        opacity: isOtherExiting ? 0 : 1,
        zIndex: isExiting ? 60 : 10,
      }}
    >
      {/* Product art gets its own square. Nothing is written over it, so the
          label needs no blackout scrim and stays readable at any card size. */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#20232c]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${activeProduct.image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#191b23] to-transparent" />
      </div>

      {/* Info panel */}
      <div className="px-3 pb-3 pt-2 md:px-4 md:pb-4 text-left">
        <p className="text-[9px] md:text-[10px] text-white/45 leading-snug line-clamp-2 min-h-[2.2em]">
          {activeProduct.name}
        </p>
        <div className="flex items-baseline justify-between gap-2 mt-1.5">
          <h3 className="text-base md:text-xl font-bold tracking-tight text-white leading-none">
            {brand.logoText}
          </h3>
          <span
            className="text-[11px] md:text-sm font-bold tabular-nums leading-none"
            style={{ color: PRICE_COLOR }}
          >
            {activeProduct.currency} {activeProduct.price.toFixed(0)}
          </span>
        </div>
        <p className="text-[9px] md:text-[10px] text-white/35 mt-1 line-clamp-1">{brand.tagline}</p>
      </div>

      {/* Hover ring */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 2px ${brand.accentColor}` }}
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
