"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brand, Product, getAllProducts } from "@/lib/data";

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
        "landing-card group absolute rounded-2xl overflow-hidden border border-white/15 shadow-2xl",
        "w-32 h-48 sm:w-40 sm:h-56 md:w-60 md:h-80",
        "bottom-[15vh] md:bottom-[24vh]",
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
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeProduct.image})` }}
          />
        </AnimatePresence>
      </div>

      {/* Scrim: the label sits directly on the product art, so the lower half
          needs to go near-opaque or the text is unreadable on a phone. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.94) 40%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.12) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 2px ${brand.accentColor}` }}
      />

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-left">
        <p
          className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.25em] mb-1 line-clamp-2"
          style={{ color: brand.accentColor }}
        >
          {activeProduct.name} · {activeProduct.currency} {activeProduct.price.toFixed(0)}
        </p>
        <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white leading-none">
          {brand.logoText}
        </h3>
        <p className="text-[10px] md:text-[11px] text-white/50 mt-1">{brand.tagline}</p>
      </div>

      <div
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: brand.accentColor, color: brand.id === "vimar" ? "#1a1a2e" : "#fff" }}
      >
        →
      </div>
    </button>
  );
}
