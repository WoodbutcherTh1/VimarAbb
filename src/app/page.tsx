"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { brands, getCategoryByPath, getAllProducts, abbIndustries, Product } from "@/lib/data";
import FluidBackground from "@/components/FluidBackground";
import BrandBackgroundVideo from "@/components/BrandBackgroundVideo";
import AmbientFX from "@/components/AmbientFX";
import BrandSelector from "@/components/BrandSelector";
import Sidebar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCarousel from "@/components/ProductCarousel";
import ProductModal from "@/components/ProductModal";
import CategoryBanner from "@/components/CategoryBanner";
import IndustriesShowcase from "@/components/IndustriesShowcase";
import BrandLanding from "@/components/BrandLanding";
import QuotePanel from "@/components/QuotePanel";
import { QuoteProvider, useQuote } from "@/lib/quote";
import { Search, Menu, Grid3X3, FileText, X, ChevronLeft } from "lucide-react";

export default function Home() {
  return (
    <QuoteProvider>
      <Showroom />
    </QuoteProvider>
  );
}

function QuoteButton({ accentColor, accentText }: { accentColor: string; accentText: string }) {
  const { count, setOpen } = useQuote();
  return (
    <motion.button
      onClick={() => setOpen(true)}
      aria-label={`Open quote (${count} item${count !== 1 ? "s" : ""})`}
      aria-haspopup="dialog"
      className="relative p-2.5 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <FileText className="w-5 h-5 text-inverse" />
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center"
          style={{ backgroundColor: accentColor, color: accentText }}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}

function Showroom() {
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Skip the intro timeline entirely when the OS asks for reduced motion —
  // the elements are already at their visible end state.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-logo",
        { scale: 0.6, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6 }
      )
        .fromTo(
          ".hero-title-text",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          ".hero-brand-selector",
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".hero-search",
          { x: 16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45 },
          "-=0.3"
        );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  const activeBrand = useMemo(
    () => brands.find((b) => b.id === activeBrandId) || brands[0],
    [activeBrandId]
  );

  const currentCategory = useMemo(() => {
    if (activePath.length === 0) return null;
    return getCategoryByPath(activeBrand.categories, activePath);
  }, [activeBrand, activePath]);

  const displayedProducts = useMemo(() => {
    if (searchQuery.trim()) {
      const all = getAllProducts(activeBrand);
      const q = searchQuery.toLowerCase();
      return all.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (currentCategory) {
      return currentCategory.products;
    }
    // Show featured products at root
    return getAllProducts(activeBrand).filter((p) => p.featured).slice(0, 6);
  }, [activeBrand, currentCategory, searchQuery]);

  // White on the Vimar gold is 2.4:1 — dark text holds AA on the accent buttons.
  const accentText = activeBrand.id === "vimar" ? "#1a1a2e" : "#ffffff";

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
    setActivePath([]);
    setSelectedProduct(null);
    setSearchQuery("");
    setMobileNavOpen(false);
  };

  const handleNavigate = (path: string[]) => {
    setActivePath(path);
    setSelectedProduct(null);
  };

  // Clearing the brand drops back to the landing — before this there was no
  // route back to it once a brand had been picked.
  const handleBackToLanding = () => {
    setActiveBrandId(null);
    setActivePath([]);
    setSelectedProduct(null);
    setSearchQuery("");
  };

  return (
    <>
      <AnimatePresence>
        {!activeBrandId && <BrandLanding onSelect={handleBrandChange} />}
      </AnimatePresence>

      {activeBrandId && (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <BrandBackgroundVideo brandId={activeBrandId} />
      <FluidBackground brandId={activeBrandId} />
      <AmbientFX accentColor={activeBrand.accentColor} />

      {/* Header */}
      <header
        ref={headerRef}
        className={`relative z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-surface/80 backdrop-blur-xl transition-all duration-300 ${
          headerCompact ? "px-4 md:px-6 py-2.5" : "px-4 md:px-6 py-4"
        }`}
      >
        <div className="flex items-center gap-6 min-w-0">
          <button
            onClick={handleBackToLanding}
            aria-label="Back to showroom home"
            title="Back to showroom home"
            className="flex items-center gap-3 min-w-0 rounded-sm hover:opacity-80 transition-opacity"
          >
            <motion.div
              className="hero-logo shrink-0 w-10 h-10 rounded-sm flex items-center justify-center font-bold text-lg tracking-tighter"
              style={{
                backgroundColor: activeBrand.accentColor,
                color: activeBrand.id === "vimar" ? "#1a1a2e" : "#fff",
              }}
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {activeBrand.logoText[0]}
            </motion.div>
            {/* On a phone the badge plus the VIMAR/ABB switcher already name the
                brand, and this block's text was wrapping the nav off-screen. */}
            <div className="hero-title-text hidden sm:block overflow-hidden min-w-0">
              <h1 className="font-bold text-lg tracking-tight leading-none truncate">
                {activeBrand.logoText}
              </h1>
              <motion.p
                className="text-[10px] text-inverse uppercase tracking-widest overflow-hidden whitespace-nowrap"
                animate={{ height: headerCompact ? 0 : "auto", opacity: headerCompact ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                {activeBrand.tagline}
              </motion.p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="hero-brand-selector">
            <BrandSelector activeBrand={activeBrandId} onSelect={handleBrandChange} />
          </div>

          <div className="hero-search hidden md:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-inverse transition-colors group-focus-within:text-tertiary pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2.5 w-64 rounded-sm bg-white/5 border border-white/10 text-sm text-tertiary placeholder:text-inverse/60 transition-all duration-normal focus:w-72"
              style={{
                boxShadow: searchQuery ? `0 0 0 3px ${activeBrand.accentColor}22` : undefined,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 p-1 rounded-sm text-inverse hover:text-tertiary hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <QuoteButton accentColor={activeBrand.accentColor} accentText={accentText} />

          <motion.button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            aria-haspopup="dialog"
            className="p-2.5 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors lg:hidden"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-inverse" /> : <Menu className="w-5 h-5 text-inverse" />}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Desktop sidebar column (always visible; collapsible) */}
        <div className="hidden lg:flex shrink-0 h-full relative">
          <div
            className={`overflow-hidden transition-all duration-normal ${
              sidebarOpen ? "w-72" : "w-0"
            }`}
          >
            <Sidebar
              categories={activeBrand.categories}
              activePath={activePath}
              onNavigate={handleNavigate}
              accentColor={activeBrand.accentColor}
            />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse categories" : "Expand categories"}
            aria-expanded={sidebarOpen}
            className="absolute top-4 -right-3 z-30 w-6 h-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft
              className={`w-3.5 h-3.5 text-inverse transition-transform duration-normal ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Mobile navigation drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface border-r border-white/5 flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-inverse">
                    Categories
                  </span>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close navigation"
                    className="p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-inverse" />
                  </button>
                </div>

                {/* The header search is hidden below md — give mobile users a
                    search field in the drawer instead. */}
                <div className="relative p-3 shrink-0">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-inverse pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 rounded-sm bg-white/5 border border-white/10 text-sm text-tertiary placeholder:text-inverse/60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-1 rounded-sm text-inverse hover:text-tertiary hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Sidebar
                  categories={activeBrand.categories}
                  activePath={activePath}
                  onNavigate={(path) => {
                    handleNavigate(path);
                    setMobileNavOpen(false);
                  }}
                  accentColor={activeBrand.accentColor}
                />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col overflow-hidden">
          <Breadcrumb
            brandName={activeBrand.name}
            path={activePath}
            categories={activeBrand.categories}
            onNavigate={handleNavigate}
            onHome={handleBackToLanding}
          />

          {!searchQuery && currentCategory?.image && (
            <CategoryBanner category={currentCategory} accentColor={activeBrand.accentColor} />
          )}

          {/* Products */}
          <div
            className="flex-1 overflow-y-auto"
            onScroll={(e) => setHeaderCompact(e.currentTarget.scrollTop > 24)}
          >
            {displayedProducts.length > 0 ? (
              <ProductCarousel
                products={displayedProducts}
                accentColor={activeBrand.accentColor}
                accentTextColor={accentText}
                collectionName={
                  currentCategory ? currentCategory.name : searchQuery ? `Search: "${searchQuery}"` : "Featured"
                }
                collectionTagline={
                  currentCategory
                    ? `${displayedProducts.length} product${displayedProducts.length !== 1 ? "s" : ""} in this collection`
                    : searchQuery
                      ? `${displayedProducts.length} result${displayedProducts.length !== 1 ? "s" : ""}`
                      : `${activeBrand.name} highlights`
                }
                onProductClick={setSelectedProduct}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-inverse">
                <Grid3X3 className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">Try adjusting your search or category selection</p>
              </div>
            )}
          </div>

          {!searchQuery && !currentCategory && activeBrandId === "abb" && (
            <IndustriesShowcase industries={abbIndustries} accentColor={activeBrand.accentColor} />
          )}
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        accentColor={activeBrand.accentColor}
        brandId={activeBrand.id}
        onClose={() => setSelectedProduct(null)}
      />

      <QuotePanel accentColor={activeBrand.accentColor} brandId={activeBrand.id} />
    </div>
      )}
    </>
  );
}
