"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartIcon({ onClick, accentColor }: { onClick: () => void; accentColor: string }) {
  const { itemCount } = useCart();

  return (
    <motion.button
      onClick={onClick}
      className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <ShoppingCart className="w-5 h-5 text-white/70" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: accentColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
