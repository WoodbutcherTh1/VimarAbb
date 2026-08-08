"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/lib/data";

export type OrderStage =
  | "greeting"
  | "building"
  | "processing"
  | "picking"
  | "checking"
  | "ready"
  | "with-driver"
  | "delivered";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  itemCount: number;
  stage: OrderStage;
  confirmOrder: () => void;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Demo/showroom simulation only — this is a static export with no backend,
// so once an order is confirmed we auto-advance through fulfillment stages
// on a timer purely to let a visitor see the full status bar in action.
const AUTO_ADVANCE: { stage: OrderStage; afterMs: number }[] = [
  { stage: "processing", afterMs: 0 },
  { stage: "picking", afterMs: 2600 },
  { stage: "checking", afterMs: 5600 },
  { stage: "ready", afterMs: 8600 },
  { stage: "with-driver", afterMs: 11600 },
  { stage: "delivered", afterMs: 15200 },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [stage, setStage] = useState<OrderStage>("greeting");
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    setStage((s) => (s === "greeting" ? "building" : s));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      if (next.length === 0) {
        setStage((s) => (s === "building" ? "greeting" : s));
      }
      return next;
    });
  }, []);

  const confirmOrder = useCallback(() => {
    if (items.length === 0) return;
    clearTimers();
    AUTO_ADVANCE.forEach(({ stage: s, afterMs }) => {
      const id = window.setTimeout(() => setStage(s), afterMs);
      timers.current.push(id);
    });
  }, [items.length]);

  const resetOrder = useCallback(() => {
    clearTimers();
    setItems([]);
    setStage("greeting");
  }, []);

  useEffect(() => clearTimers, []);

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, itemCount, stage, confirmOrder, resetOrder }),
    [items, addItem, removeItem, itemCount, stage, confirmOrder, resetOrder]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
