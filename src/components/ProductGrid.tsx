"use client";

import { useState } from "react";
import { Plus, Check, Sparkles, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/data";
import { useQuote } from "@/lib/quote";
import { PRICE_COLOR } from "@/lib/showroomConfig";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  brandId: string;
  accentDark: string;
  view: "grid" | "list";
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  brandId,
  accentDark,
  view,
  onProductClick,
}: ProductGridProps) {
  return view === "grid" ? (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          brandId={brandId}
          accentDark={accentDark}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          brandId={brandId}
          accentDark={accentDark}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}

function AddButton({
  product,
  brandId,
  accentDark,
  className,
}: {
  product: Product;
  brandId: string;
  accentDark: string;
  className?: string;
}) {
  const { add } = useQuote();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    add(product, brandId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      aria-label={`Add ${product.name} to quote`}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        added ? "bg-emerald-600 text-white" : "text-white",
        className
      )}
      style={added ? undefined : { backgroundColor: accentDark }}
    >
      {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {added ? "Added" : "Add to quote"}
    </button>
  );
}

function ProductCard({
  product,
  brandId,
  accentDark,
  onClick,
}: {
  product: Product;
  brandId: string;
  accentDark: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card-lift group flex flex-col overflow-hidden rounded-xl border border-line bg-white text-left shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        {product.featured && (
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900 shadow-sm">
            <Sparkles className="h-3 w-3" style={{ color: accentDark }} />
            Featured
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-2.5 bottom-2.5 rounded-md bg-red-600/90 px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {product.sku}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-navy-900">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
          <span className="text-base font-bold tabular-nums text-navy-900">
            <span style={{ color: PRICE_COLOR }}>{product.currency}</span>{" "}
            {product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted transition-colors group-hover:text-navy-900">
            Details <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="mt-3">
          <AddButton product={product} brandId={brandId} accentDark={accentDark} />
        </div>
      </div>
    </button>
  );
}

function ProductRow({
  product,
  brandId,
  accentDark,
  onClick,
}: {
  product: Product;
  brandId: string;
  accentDark: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card-lift group flex w-full items-center gap-4 rounded-xl border border-line bg-white p-3 text-left shadow-sm sm:gap-5 sm:p-4"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-24">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {product.sku}
          </p>
          {product.featured && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: `${accentDark}14`, color: accentDark }}
            >
              Featured
            </span>
          )}
        </div>
        <h3 className="mt-1 truncate text-sm font-semibold text-navy-900 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-0.5 hidden truncate text-sm text-muted sm:block">
          {product.description}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2.5">
        <span className="text-base font-bold tabular-nums text-navy-900">
          <span style={{ color: PRICE_COLOR }}>{product.currency}</span>{" "}
          {product.price.toFixed(2)}
        </span>
        <AddButton product={product} brandId={brandId} accentDark={accentDark} className="px-4" />
      </div>
    </button>
  );
}