"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
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
import { Search, Menu, Grid3X3, FileText } from "lucide-react";

export default function Home() {
  return (
    <QuoteProvider>
      <Showroom />
    </QuoteProvider>
  );
}

function QuoteButton({ accentColor }: { accentColor: string }) {
  const { count, setOpen } = useQuote();
  return (
    <motion.button
      onClick={() => setOpen(true)}
      aria-label={`Open quote (${count} item${count !== 1 ? "s" : ""})`}
      className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <FileText className="w-5 h-5 text-white/60" />
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center text-black"
          style={{ backgroundColor: accentColor }}
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
  const [headerCompact, setHeaderCompact] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
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

  const handleBrandChange = (brandId: string) => {
    setActiveBrandId(brandId);
    setActivePath([]);
    setSelectedProduct(null);
    setSearchQuery("");
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
        className={`relative z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl transition-all duration-300 ${
          headerCompact ? "px-4 md:px-6 py-2.5" : "px-4 md:px-6 py-4"
        }`}
      >
        <div className="flex items-center gap-6 min-w-0">
          <button
            onClick={handleBackToLanding}
            aria-label="Back to showroom home"
            title="Back to showroom home"
            className="flex items-center gap-3 min-w-0 rounded-xl hover:opacity-80 transition-opacity"
          >
            <motion.div
              className="hero-logo shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg tracking-tighter"
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
                className="text-[10px] text-white/30 uppercase tracking-widest overflow-hidden whitespace-nowrap"
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
            <Search className="absolute left-3 w-4 h-4 text-white/30 transition-colors group-focus-within:text-white/60" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/15 transition-all duration-300 focus:w-72"
              style={{
                boxShadow: searchQuery ? `0 0 0 3px ${activeBrand.accentColor}22` : undefined,
              }}
            />
          </div>

          <QuoteButton accentColor={activeBrand.accentColor} />

          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors lg:hidden"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Menu className="w-5 h-5 text-white/60" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden lg:block overflow-hidden"
            >
              <Sidebar
                categories={activeBrand.categories}
                activePath={activePath}
                onNavigate={handleNavigate}
                accentColor={activeBrand.accentColor}
              />
            </motion.div>
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
              <div className="flex flex-col items-center justify-center h-96 text-white/20">
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

      <QuotePanel accentColor={activeBrand.accentColor} />
    </div>
      )}
    </>
  );
}
