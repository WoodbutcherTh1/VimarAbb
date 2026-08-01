"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Euro, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
  accentColor: string;
  collectionName: string;
  collectionTagline?: string;
  onProductClick: (product: Product) => void;
}

const CARD_W = 190;
const CARD_H = 260;
const SPACING = 165;
const MAX_VISIBLE_OFFSET = 4;

export default function ProductCarousel({
  products,
  accentColor,
  collectionName,
  collectionTagline,
  onProductClick,
}: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; dragging: boolean } | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [products]);

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(products.length - 1, i)),
    [products.length]
  );

  const goTo = useCallback((i: number) => setActiveIndex(clampIndex(i)), [clampIndex]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Enter" && products[activeIndex]) onProductClick(products[activeIndex]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev, activeIndex, products, onProductClick]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, dragging: true };
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.current?.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? prev() : next();
    }
    dragState.current = null;
  };

  const activeProduct = products[activeIndex];
  if (!activeProduct) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-6">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
          <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
          Collection
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          {collectionName}
        </h2>
        {collectionTagline && (
          <p className="text-white/40 text-sm mt-2">{collectionTagline}</p>
        )}
      </div>

      {/* Stage */}
      <div
        className="relative h-[440px] overflow-hidden select-none"
        style={{ perspective: "1400px" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Mirror floor gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${accentColor}0a 40%, ${accentColor}14 100%)`,
          }}
        />

        <div
          ref={trackRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {products.map((product, i) => {
            const offset = i - activeIndex;
            const abs = Math.abs(offset);
            if (abs > MAX_VISIBLE_OFFSET) return null;

            const isActive = offset === 0;
            const translateX = offset * SPACING;
            const rotateY = Math.max(-45, Math.min(45, -offset * 18));
            const scale = Math.max(0.55, 1 - abs * 0.13);
            const opacity = Math.max(0, 1 - abs * 0.22);
            const zIndex = 100 - abs;

            return (
              <button
                key={product.id}
                onClick={() => (isActive ? onProductClick(product) : goTo(i))}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, z-index 0s",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Label above card */}
                <div
                  className={cn(
                    "absolute -top-7 left-0 right-0 text-center text-[11px] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis px-1 transition-opacity",
                    isActive ? "text-white/80 opacity-100" : "text-white/30 opacity-70"
                  )}
                >
                  {product.name}
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "relative w-full h-full rounded-xl overflow-hidden border bg-white/[0.03]",
                    isActive ? "border-white/20 shadow-2xl" : "border-white/5"
                  )}
                  style={isActive ? { boxShadow: `0 20px 60px -12px ${accentColor}55` } : undefined}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {product.featured && (
                    <div className="absolute top-2 left-2 p-1 rounded-full bg-white/10 backdrop-blur-md">
                      <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
                    </div>
                  )}
                </div>

                {/* Reflection */}
                <div
                  className="absolute left-0 right-0 top-full w-full h-full rounded-xl overflow-hidden pointer-events-none"
                  style={{
                    transform: "scaleY(-1)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 55%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 55%)",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[200] p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <button
          onClick={next}
          disabled={activeIndex === products.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[200] p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Counter + name + dots */}
      <div className="text-center pb-4">
        <p className="text-xs font-mono tracking-widest" style={{ color: accentColor }}>
          {String(activeIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait">
          <motion.h3
            key={activeProduct.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-bold uppercase tracking-wide text-white mt-1"
          >
            {activeProduct.name}
          </motion.h3>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 20 : 6,
                backgroundColor: i === activeIndex ? accentColor : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Active product info panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto px-6 pb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {activeProduct.featured && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white/80">
                <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
                Featured
              </span>
            )}
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border",
                activeProduct.inStock
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              )}
            >
              {activeProduct.inStock ? "In Stock" : "Out of Stock"}
            </span>
            {activeProduct.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-center text-white/40 text-sm leading-relaxed mb-6">
            {activeProduct.description}
          </p>

          <div className="flex items-center justify-center gap-6">
            <div className="flex items-baseline gap-1">
              <Euro className="w-4 h-4 text-white/50" />
              <span className="text-2xl font-bold tracking-tight text-white">
                {activeProduct.price.toFixed(2)}
              </span>
              <span className="text-xs text-white/30 uppercase">{activeProduct.currency}</span>
            </div>
            <motion.button
              onClick={() => onProductClick(activeProduct)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: accentColor }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
