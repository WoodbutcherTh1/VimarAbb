"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Product } from "@/lib/data";
import { useQuote } from "@/lib/quote";
import { PRICE_COLOR } from "@/lib/showroomConfig";
import { X, Euro, Check, Package, Shield, Zap, Award } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  accentColor: string;
  brandId: string;
  onClose: () => void;
}

export default function ProductModal({ product, accentColor, brandId, onClose }: ProductModalProps) {
  const priceRef = useRef<HTMLSpanElement>(null);
  const { add, setOpen, count } = useQuote();
  // Track which product the confirmation belongs to rather than a bare
  // boolean, so moving to another product clears it without an effect.
  const [addedFor, setAddedFor] = useState<string | null>(null);
  const justAdded = !!product && addedFor === product.id;

  const handleAdd = () => {
    if (!product) return;
    add(product, brandId);
    setAddedFor(product.id);
    window.setTimeout(() => setAddedFor((cur) => (cur === product.id ? null : cur)), 1800);
  };

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    if (!product || !priceRef.current) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: product.price,
      duration: 0.9,
      delay: 0.35,
      ease: "power2.out",
      onUpdate: () => {
        if (priceRef.current) priceRef.current.textContent = counter.value.toFixed(2);
      },
    });
    return () => {
      tween.kill();
    };
  }, [product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`product-${product.id}`}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white/60" />
            </motion.button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image with Explode Effect */}
              <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden bg-gradient-to-br from-white/5 to-transparent p-8 flex items-center justify-center">
                {/* Explode layers */}
                <motion.div
                  className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
                  style={{ backgroundImage: `url(${product.image})` }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.15 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                />

                {/* Layer 1: Back glow */}
                <motion.div
                  className="absolute w-64 h-64 rounded-full blur-[80px]"
                  style={{ backgroundColor: accentColor }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.15 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                />

                {/* Layer 2: Product image */}
                <motion.div
                  className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                  initial={{ rotateY: -15, rotateX: 10, scale: 0.8, opacity: 0 }}
                  animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />

                  {/* Inner mechanism overlay - "exploded" view simulation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </motion.div>

                {/* Layer 3: Floating spec chips */}
                <motion.div
                  className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2 justify-center"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                >
                  {product.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md border border-white/10 text-white/80"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 300 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Right: Details */}
              <div className="p-8 md:p-10 space-y-8">
                {/* Header */}
                <motion.div
                  className="space-y-3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/5">
                      {product.sku}
                    </span>
                    {product.featured && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                    {product.name}
                  </h2>
                  <p className="text-white/50 leading-relaxed text-base">
                    {product.description}
                  </p>
                </motion.div>

                {/* Price Block */}
                <motion.div
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Unit Price</p>
                      <div className="flex items-baseline gap-2" style={{ color: PRICE_COLOR }}>
                        <Euro className="w-6 h-6 opacity-70" />
                        <span className="text-4xl font-bold tracking-tight">
                          <span ref={priceRef}>0.00</span>
                        </span>
                        <span className="text-sm font-medium opacity-60">{product.currency}</span>
                      </div>
                      <p className="text-xs text-white/20 mt-1">Excluding VAT • Shipping calculated at checkout</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      product.inStock
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {product.inStock ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {product.inStock ? "Available" : "Unavailable"}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      onClick={handleAdd}
                      disabled={!product.inStock}
                      className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accentColor }}
                      whileHover={product.inStock ? { scale: 1.02, filter: "brightness(1.1)" } : undefined}
                      whileTap={product.inStock ? { scale: 0.98 } : undefined}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        "Add to Quote"
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => setOpen(true)}
                      aria-label="View quote"
                      className="relative p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Package className="w-5 h-5 text-white/60" />
                      {count > 0 && (
                        <span
                          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center text-black"
                          style={{ backgroundColor: accentColor }}
                        >
                          {count}
                        </span>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Specs Grid - Exploded/Reveal Layout */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.specs.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.45 + index * 0.06,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      >
                        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1 group-hover:text-white/40 transition-colors">
                          {spec.label}
                        </p>
                        <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                          {spec.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="flex items-center gap-6 pt-4 border-t border-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <Shield className="w-4 h-4" />
                    <span>Secure Transaction</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <Award className="w-4 h-4" />
                    <span>Original Product</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
