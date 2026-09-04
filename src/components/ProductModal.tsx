"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/data";
import { useQuote } from "@/lib/quote";
import { useDialog } from "@/lib/useDialog";
import PriceCounter from "@/components/PriceCounter";
import { accentOnRaised } from "@/lib/showroomConfig";
import { X, Check, Package, Shield, Zap, Award, Loader2 } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  accentColor: string;
  brandId: string;
  onClose: () => void;
}

export default function ProductModal({ product, accentColor, brandId, onClose }: ProductModalProps) {
  const { add, setOpen, count } = useQuote();
  // Track which product the confirmation belongs to rather than a bare
  // boolean, so moving to another product clears it without an effect.
  const [addedFor, setAddedFor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const justAdded = !!product && addedFor === product.id;

  const dialogRef = useDialog({ isOpen: !!product, onClose });

  // White on the Vimar gold is 2.4:1 — dark text holds AA on the accent buttons.
  const accentText = brandId === "vimar" ? "#1a1a2e" : "#ffffff";
  const accentRaised = accentOnRaised(brandId);

  const handleAdd = () => {
    if (!product || adding) return;
    setAdding(true);
    add(product, brandId);
    setAddedFor(product.id);
    // Brief simulated submission so the button exposes a loading state.
    window.setTimeout(() => setAdding(false), 600);
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

          {/* Modal Content — raised light surface */}
          <motion.div
            layoutId={`product-${product.id}`}
            ref={dialogRef as React.RefObject<HTMLDivElement>}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-md bg-raised border border-default shadow-1"
            data-surface="raised"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-3 rounded-sm bg-default/40 hover:bg-default/70 border border-default/70 transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-secondary" />
            </motion.button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden bg-default/40 p-8 flex items-center justify-center">
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
                  animate={{ scale: 1, opacity: 0.12 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                />

                {/* Layer 2: Product image */}
                <motion.div
                  className="relative w-full max-w-md aspect-square rounded-md overflow-hidden shadow-1 border border-default/70"
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
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40"
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
                      className="px-3 py-1.5 rounded-sm text-xs font-medium bg-raised border border-default text-secondary shadow-1"
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
                    <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-default/40 text-secondary border border-default/70">
                      {product.sku}
                    </span>
                    {product.featured && (
                      <span
                        className="px-2.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider border"
                        style={{ color: accentRaised, backgroundColor: `${accentRaised}15`, borderColor: `${accentRaised}40` }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 id="product-modal-title" className="text-3xl md:text-4xl font-bold tracking-tight text-secondary">
                    {product.name}
                  </h2>
                  <p className="text-secondary leading-relaxed text-base">
                    {product.description}
                  </p>
                </motion.div>

                {/* Price Block */}
                <motion.div
                  className="p-6 rounded-md bg-default/40 border border-default/70 space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-secondary uppercase tracking-wider mb-1">Unit Price</p>
                      <PriceCounter
                        value={product.price}
                        currency={product.currency}
                        resetKey={product.id}
                        className="flex items-baseline gap-2"
                        iconClassName="w-6 h-6 opacity-70"
                        numberClassName="text-4xl font-bold tracking-tight"
                        currencyClassName="text-sm font-medium opacity-60"
                        delay={0.35}
                        onRaised
                      />
                      <p className="text-xs text-secondary mt-1">Excluding VAT • Shipping calculated at checkout</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      product.inStock
                        ? "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20"
                        : "bg-red-600/10 text-red-700 border border-red-600/20"
                    }`}>
                      {product.inStock ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {product.inStock ? "Available" : "Unavailable"}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      onClick={handleAdd}
                      disabled={!product.inStock || adding}
                      aria-busy={adding || undefined}
                      className="flex-1 py-3.5 px-6 rounded-sm font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accentColor, color: accentText }}
                      whileHover={product.inStock && !adding ? { scale: 1.02, filter: "brightness(1.1)" } : undefined}
                      whileTap={product.inStock && !adding ? { scale: 0.98 } : undefined}
                    >
                      {adding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Adding…
                        </>
                      ) : justAdded ? (
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
                      className="relative p-3.5 rounded-sm bg-default/40 border border-default/70 hover:bg-default/70 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Package className="w-5 h-5 text-secondary" />
                      {count > 0 && (
                        <span
                          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: accentColor, color: accentText }}
                        >
                          {count}
                        </span>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Specs Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" style={{ color: accentRaised }} />
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.specs.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        className="p-4 rounded-sm bg-default/40 border border-default/70 hover:border-default transition-colors group"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.45 + index * 0.06,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      >
                        <p className="text-[10px] uppercase tracking-wider text-secondary mb-1 group-hover:text-secondary transition-colors">
                          {spec.label}
                        </p>
                        <p className="text-sm font-semibold text-secondary group-hover:text-secondary transition-colors">
                          {spec.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="flex items-center gap-6 pt-4 border-t border-default/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 text-secondary text-xs">
                    <Shield className="w-4 h-4" />
                    <span>Secure Transaction</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary text-xs">
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