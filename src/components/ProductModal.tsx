"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/data";
import { useQuote } from "@/lib/quote";
import { useDialog } from "@/lib/useDialog";
import { readableTextOn } from "@/lib/utils";
import PriceCounter from "@/components/PriceCounter";
import { X, Check, Package, Shield, Award, Zap } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  accentDark: string;
  brandId: string;
  onClose: () => void;
}

export default function ProductModal({
  product,
  accentDark,
  brandId,
  onClose,
}: ProductModalProps) {
  const { add, setOpen, count } = useQuote();
  // Track which product the confirmation belongs to rather than a bare
  // boolean, so moving to another product clears it without an effect.
  const [addedFor, setAddedFor] = useState<string | null>(null);
  const justAdded = !!product && addedFor === product.id;

  // WCAG dialog behavior: focus moves in on open, Tab is trapped, Escape
  // closes (only while focus is inside this dialog), focus is restored on
  // close.
  const dialogRef = useDialog<HTMLDivElement>({ isOpen: !!product, onClose });

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
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl"
            initial={{ scale: 0.96, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <button
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted shadow-sm transition-colors hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-slate-100 md:aspect-auto md:min-h-[420px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/25 to-transparent" />
              </div>

              {/* Details */}
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                    {product.sku}
                  </span>
                  {product.featured && (
                    <span
                      className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${accentDark}14`, color: accentDark }}
                    >
                      Featured
                    </span>
                  )}
                  <span
                    className={
                      product.inStock
                        ? "flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700"
                        : "flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700"
                    }
                  >
                    {product.inStock ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>

                <div className="mt-5 flex items-baseline gap-2">
                  <PriceCounter
                    value={product.price}
                    currency={product.currency}
                    resetKey={product.id}
                    numberClassName="text-3xl font-bold tracking-tight"
                    iconClassName="h-5 w-5 opacity-80"
                  />
                  <span className="text-xs text-muted">excl. VAT</span>
                </div>

                <div className="mt-6 flex gap-2.5">
                  <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      backgroundColor: accentDark,
                      color: readableTextOn(accentDark),
                    }}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4" /> Added to quote
                      </>
                    ) : (
                      "Add to Quote"
                    )}
                  </button>
                  <button
                    onClick={() => setOpen(true)}
                    aria-label="View quote"
                    className="relative flex w-12 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:bg-slate-50 hover:text-navy-900"
                  >
                    <Package className="h-5 w-5" />
                    {count > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </button>
                </div>

                {/* Specs */}
                <div className="mt-7">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                    <Zap className="h-3.5 w-3.5" style={{ color: accentDark }} />
                    Technical specifications
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {product.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-xl border border-line bg-slate-50/60 p-3"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-muted">
                          {spec.label}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-navy-900">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center gap-5 border-t border-line pt-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" /> Genuine products
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Manufacturer warranty
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}