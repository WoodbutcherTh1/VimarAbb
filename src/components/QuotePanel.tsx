"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, Copy, Check, Mail, MessageCircle } from "lucide-react";
import { useQuote, formatQuote } from "@/lib/quote";
import { SHOWROOM_CONTACT, PRICE_COLOR } from "@/lib/showroomConfig";

export default function QuotePanel({ accentColor }: { accentColor: string }) {
  const { lines, total, currency, count, setQty, remove, clear, isOpen, setOpen } = useQuote();
  const [copied, setCopied] = useState(false);

  const text = formatQuote(lines, total, currency);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back to a prompt.
      window.prompt("Copy your quote:", text);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[81] w-full sm:w-[420px] bg-[#0c0d12] border-l border-white/10 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Quote request"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h2 className="font-bold tracking-tight">Your Quote</h2>
                <p className="text-xs text-white/40">
                  {count} item{count !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close quote"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 text-white/30">
                <p className="font-medium">No items yet</p>
                <p className="text-sm mt-1">Open a product and choose “Add to Quote”.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {lines.map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{l.name}</p>
                        <p className="text-[11px] text-white/35 mt-0.5">{l.sku}</p>
                      </div>
                      <button
                        onClick={() => remove(l.id)}
                        aria-label={`Remove ${l.name}`}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          aria-label={`Decrease quantity of ${l.name}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          aria-label={`Increase quantity of ${l.name}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: PRICE_COLOR }}>
                        {l.currency} {(l.price * l.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lines.length > 0 && (
              <footer className="border-t border-white/10 px-5 py-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/50">Total (excl. VAT)</span>
                  <span
                    className="text-2xl font-bold tracking-tight tabular-nums"
                    style={{ color: PRICE_COLOR }}
                  >
                    {currency} {total.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {SHOWROOM_CONTACT.whatsappNumber && (
                    <a
                      href={`https://wa.me/${SHOWROOM_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      <MessageCircle className="w-4 h-4" /> Send on WhatsApp
                    </a>
                  )}
                  {SHOWROOM_CONTACT.email && (
                    <a
                      href={`mailto:${SHOWROOM_CONTACT.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(text)}`}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm uppercase tracking-wider transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Email the showroom
                    </a>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm uppercase tracking-wider transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy list"}
                  </button>
                  <button
                    onClick={clear}
                    className="py-2 text-xs text-white/35 hover:text-white/60 transition-colors"
                  >
                    Clear quote
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
