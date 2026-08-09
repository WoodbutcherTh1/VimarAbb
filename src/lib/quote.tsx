"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { Product } from "@/lib/data";
import { QUOTE_STORAGE_KEY } from "@/lib/showroomConfig";

export interface QuoteLine {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  brandId: string;
  qty: number;
}

// ---------------------------------------------------------------------------
// Module-level store.
//
// The quote lives outside React so it can be read through
// useSyncExternalStore: the static export prerenders on the server where
// localStorage doesn't exist, and this is the pattern that reconciles a
// server snapshot (empty) with the client's stored one without setting
// state from an effect.
// ---------------------------------------------------------------------------

const EMPTY: QuoteLine[] = [];

let lines: QuoteLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): QuoteLine[] {
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuoteLine[]) : EMPTY;
  } catch {
    // Corrupt JSON or storage disabled — start empty.
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  lines = readStorage();
}

function commit(next: QuoteLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota — the quote still works for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  ensureLoaded();
  listeners.add(onChange);
  // Keep a second tab of the showroom in step with this one.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== QUOTE_STORAGE_KEY) return;
    lines = readStorage();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

// ---------------------------------------------------------------------------
// React surface
// ---------------------------------------------------------------------------

interface QuoteContextValue {
  lines: QuoteLine[];
  count: number;
  total: number;
  currency: string;
  add: (product: Product, brandId: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((product: Product, brandId: string) => {
    const existing = lines.find((l) => l.id === product.id);
    commit(
      existing
        ? lines.map((l) => (l.id === product.id ? { ...l, qty: l.qty + 1 } : l))
        : [
            ...lines,
            {
              id: product.id,
              sku: product.sku,
              name: product.name,
              price: product.price,
              currency: product.currency,
              brandId,
              qty: 1,
            },
          ]
    );
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    commit(qty <= 0 ? lines.filter((l) => l.id !== id) : lines.map((l) => (l.id === id ? { ...l, qty } : l)));
  }, []);

  const remove = useCallback((id: string) => {
    commit(lines.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      lines: current,
      count: current.reduce((n, l) => n + l.qty, 0),
      total: current.reduce((sum, l) => sum + l.price * l.qty, 0),
      currency: current[0]?.currency ?? "EUR",
      add,
      setQty,
      remove,
      clear,
      isOpen,
      setOpen,
    }),
    [current, isOpen, add, setQty, remove, clear]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

/** Plain-text rendering of the quote, for WhatsApp / mail / clipboard. */
export function formatQuote(lines: QuoteLine[], total: number, currency: string) {
  const body = lines
    .map((l) => `• ${l.qty} × ${l.name} (${l.sku}) — ${currency} ${(l.price * l.qty).toFixed(2)}`)
    .join("\n");
  return `Quote request\n\n${body}\n\nTotal: ${currency} ${total.toFixed(2)}\n(Excluding VAT)`;
}
