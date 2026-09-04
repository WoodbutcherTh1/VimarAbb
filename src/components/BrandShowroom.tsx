"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LayoutGrid, List, ChevronRight } from "lucide-react";
import {
  brands,
  getCategoryByPath,
  getAllProducts,
  getProductsInCategories,
  Product,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import CategorySidebar from "@/components/CategorySidebar";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import IndustriesShowcase from "@/components/IndustriesShowcase";
import { abbIndustries } from "@/lib/data";

interface BrandShowroomProps {
  brandId: string;
}

export default function BrandShowroom({ brandId }: BrandShowroomProps) {
  const brand = useMemo(
    () => brands.find((b) => b.id === brandId) ?? brands[0],
    [brandId]
  );

  const [activePath, setActivePath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Mobile category drawer behaves like a dialog: Escape closes it, focus is
  // trapped while open and restored on close.
  const drawerRef = useDialog<HTMLDivElement>({
    isOpen: mobileNavOpen,
    onClose: () => setMobileNavOpen(false),
  });

  const currentCategory = useMemo(() => {
    if (activePath.length === 0) return null;
    return getCategoryByPath(brand.categories, activePath);
  }, [brand, activePath]);

  const allProducts = useMemo(() => getAllProducts(brand), [brand]);

  const displayedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (currentCategory) return getProductsInCategories([currentCategory]);
    return allProducts;
  }, [allProducts, currentCategory, searchQuery]);

  const handleNavigate = (path: string[]) => {
    setActivePath(path);
    setSelectedProduct(null);
  };

  const heading = searchQuery.trim()
    ? `Search: “${searchQuery.trim()}”`
    : currentCategory?.name ?? "All Products";

  const headingNote = searchQuery.trim()
    ? `${displayedProducts.length} result${displayedProducts.length !== 1 ? "s" : ""}`
    : currentCategory
      ? `${displayedProducts.length} product${displayedProducts.length !== 1 ? "s" : ""} in this collection`
      : `${displayedProducts.length} product${displayedProducts.length !== 1 ? "s" : ""} across ${brand.name}`;

  return (
    <div className="bg-background">
      {/* Brand hero band */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
          <nav className="flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
            <Link
              href="/"
              className="transition-colors hover:text-navy-900"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-navy-900">{brand.name}</span>
            {currentCategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-navy-900">{currentCategory.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: brand.accentDark }}
                />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted">
                  {brand.tagline}
                </p>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                {brand.name}
              </h1>
            </div>
            <p className="text-sm text-muted">
              {allProducts.length} products · {brand.categories.length} collections
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 border-b border-white/10 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          {/* Mobile categories toggle */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-navy-900 shadow-sm lg:hidden"
          >
            <Menu className="h-4 w-4" />
            Categories
          </button>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder={`Search ${brand.name} products...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-4 text-sm text-navy-900 shadow-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-line bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-navy-900 text-white" : "text-muted hover:text-navy-900"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-md transition-colors",
                view === "list" ? "bg-navy-900 text-white" : "text-muted hover:text-navy-900"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        {/* Desktop sidebar — raised light surface on the dark chrome */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-36">
            <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
              <CategorySidebar
                categories={brand.categories}
                activePath={activePath}
                onNavigate={handleNavigate}
                accentDark={brand.accentDark}
              />
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">{heading}</h2>
            <p className="text-sm text-white/60">{headingNote}</p>
          </div>

          {displayedProducts.length > 0 ? (
            <ProductGrid
              products={displayedProducts}
              brandId={brand.id}
              accentDark={brand.accentDark}
              view={view}
              onProductClick={setSelectedProduct}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white py-20 text-center">
              <p className="text-base font-medium text-navy-900">No products found</p>
              <p className="mt-1 text-sm text-muted">
                Try a different search or browse another category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ABB industries marquee */}
      {brand.id === "abb" && (
        <IndustriesShowcase
          industries={abbIndustries}
          accentDark={brand.accentDark}
        />
      )}

      {/* Mobile category drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-navy-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              ref={drawerRef}
              className="fixed inset-y-0 left-0 z-[71] flex w-[300px] flex-col bg-white shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              role="dialog"
              aria-modal="true"
              aria-label="Categories"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h3 className="text-sm font-bold text-navy-900">Categories</h3>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close categories"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <CategorySidebar
                  categories={brand.categories}
                  activePath={activePath}
                  onNavigate={(path) => {
                    handleNavigate(path);
                    setMobileNavOpen(false);
                  }}
                  accentDark={brand.accentDark}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProductModal
        product={selectedProduct}
        accentDark={brand.accentDark}
        brandId={brand.id}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}