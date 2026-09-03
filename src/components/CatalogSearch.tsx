"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { brands, getAllProducts } from "@/lib/data";

export default function CatalogSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const found: { product: (typeof brands)[number]["categories"][number]["products"][number]; brandId: string; brandName: string }[] = [];
    for (const brand of brands) {
      for (const p of getAllProducts(brand)) {
        if (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          found.push({ product: p, brandId: brand.id, brandName: brand.name });
          if (found.length >= 8) return found;
        }
      }
    }
    return found;
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showResults = focused && results.length > 0;

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex items-center border border-navy-950/15 bg-white transition-colors focus-within:border-navy-950">
        <Search className="ml-3.5 h-4 w-4 text-navy-900/35" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search the catalog — S200, thermostat, Schuko…"
          className="h-11 w-full bg-transparent px-3 font-mono text-[13px] text-navy-950 outline-none placeholder:text-navy-900/35"
        />
      </div>

      {showResults && (
        <div className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden border border-line bg-white shadow-xl">
          <ul className="max-h-80 overflow-y-auto py-1.5">
            {results.map(({ product, brandId, brandName }) => (
              <li key={product.id}>
                <Link
                  href={`/${brandId}`}
                  onClick={() => {
                    setFocused(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-lg bg-cover bg-center bg-slate-100"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy-900">
                      {product.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {product.sku} · {brandName}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}