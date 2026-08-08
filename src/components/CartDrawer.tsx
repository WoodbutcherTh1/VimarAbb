"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Euro } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ConfirmOrderButton from "@/components/ConfirmOrderButton";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  accentColor: string;
}

function CartRow({ item, accentColor }: { item: ReturnType<typeof useCart>["items"][number]; accentColor: string }) {
  const { removeItem } = useCart();
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    if (removing) return;
    setRemoving(true);
    window.setTimeout(() => removeItem(item.product.id), 620);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={
        removing
          ? { opacity: 0, scale: 0.85, x: -8, transition: { duration: 0.55, ease: "easeIn" } }
          : { opacity: 1, x: 0 }
      }
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
    >
      <div
        className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url(${item.product.image})` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">{item.product.name}</p>
        <p className="text-xs text-white/40">
          {item.qty} × {item.product.currency} {item.product.price.toFixed(2)}
        </p>
      </div>

      <div className="relative">
        <motion.button
          onClick={handleRemove}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
          animate={removing ? { rotate: 200, scale: 0.8, opacity: 0 } : { rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Trash2 className="w-4 h-4 text-white/50" />
        </motion.button>

        <AnimatePresence>
          {removing && (
            <motion.div
              className="absolute -top-1 -right-1 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                <path
                  d="M4 8h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8Z"
                  fill="#2a2a2a"
                  stroke={accentColor}
                  strokeWidth="1.2"
                />
                <path d="M2 8h20M9 5h6" stroke={accentColor} strokeWidth="1.2" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CartDrawer({ open, onClose, accentColor }: CartDrawerProps) {
  const { items, itemCount, confirmOrder } = useCart();
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-sm bg-[#0e0e14] border-l border-white/10 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="font-bold text-lg">Your Order ({itemCount})</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <p className="text-center text-white/30 text-sm py-12">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <CartRow key={item.product.id} item={item} accentColor={accentColor} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="relative p-5 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="flex items-center gap-1 text-xl font-bold">
                    <Euro className="w-4 h-4" />
                    {total.toFixed(2)}
                  </span>
                </div>
                <ConfirmOrderButton
                  accentColor={accentColor}
                  onConfirmed={() => {
                    confirmOrder();
                    onClose();
                  }}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
