"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, Copy, Check, Mail, MessageCircle } from "lucide-react";
import { useQuote, formatQuote } from "@/lib/quote";
import { SHOWROOM_CONTACT, PRICE_COLOR } from "@/lib/showroomConfig";

export default function QuotePanel() {
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
            className="fixed inset-0 z-[80] bg-navy-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[81] flex w-full flex-col bg-white shadow-2xl sm:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Quote request"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-navy-900">Your Quote</h2>
                <p className="text-xs text-muted">
                  {count} item{count !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close quote"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-slate-50 hover:text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="text-sm font-medium text-navy-900">No items yet</p>
                <p className="mt-1 text-sm text-muted">
                  Open a product and choose “Add to Quote”.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {lines.map((l) => (
                  <div key={l.id} className="rounded-xl border border-line bg-slate-50/60 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy-900">{l.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{l.sku}</p>
                      </div>
                      <button
                        onClick={() => remove(l.id)}
                        aria-label={`Remove ${l.name}`}
                        className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          aria-label={`Decrease quantity of ${l.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-muted transition-colors hover:text-navy-900"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold tabular-nums text-navy-900">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          aria-label={`Increase quantity of ${l.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-white text-muted transition-colors hover:text-navy-900"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: PRICE_COLOR }}
                      >
                        {l.currency} {(l.price * l.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lines.length > 0 && (
              <footer className="border-t border-line bg-slate-50/60 px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Total (excl. VAT)</span>
                  <span className="text-2xl font-bold tracking-tight tabular-nums text-navy-900">
                    <span style={{ color: PRICE_COLOR }}>{currency}</span>{" "}
                    {total.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  {SHOWROOM_CONTACT.whatsappNumber && (
                    <a
                      href={`https://wa.me/${SHOWROOM_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" /> Send on WhatsApp
                    </a>
                  )}
                  {SHOWROOM_CONTACT.email && (
                    <a
                      href={`mailto:${SHOWROOM_CONTACT.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(text)}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                      <Mail className="h-4 w-4" /> Email the showroom
                    </a>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-slate-50"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy list"}
                  </button>
                  <button
                    onClick={clear}
                    className="py-2 text-xs text-muted transition-colors hover:text-red-600"
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