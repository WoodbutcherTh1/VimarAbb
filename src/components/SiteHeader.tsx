"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { useQuote } from "@/lib/quote";
import { SHOWROOM_CONTACT } from "@/lib/showroomConfig";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/vimar", label: "Vimar" },
  { href: "/abb", label: "ABB" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count, setOpen } = useQuote();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="KAHANA Electrical home"
          className="shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Logo variant="light" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {SHOWROOM_CONTACT.phone && (
            <a
              href={`tel:${SHOWROOM_CONTACT.phone.replace(/[^+\d]/g, "")}`}
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white lg:flex"
            >
              <Phone className="h-4 w-4" />
              {SHOWROOM_CONTACT.phone}
            </a>
          )}

          <button
            onClick={() => setOpen(true)}
            aria-label={`Open quote (${count} item${count !== 1 ? "s" : ""})`}
            className="relative flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm font-semibold text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Quote</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <Link
            href="/contact"
            className="hidden rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover sm:block"
          >
            Get a quote
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-black md:hidden"
            aria-label="Mobile"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get a quote
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}