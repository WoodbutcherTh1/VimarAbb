"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { brands, getCategoryByPath, getAllProducts, Product } from "@/lib/data";
import FluidBackground from "@/components/FluidBackground";
import BrandSelector from "@/components/BrandSelector";
import Sidebar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import CategoryBanner from "@/components/CategoryBanner";
import { Search, Menu, Grid3X3, ListFilter } from "lucide-react";

export default function Home() {
  const [activeBrandId, setActiveBrandId] = useState<string>("vimar");
  const [activePath, setActivePath] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <FluidBackground brandId={activeBrandId} />

      {/* Header */}
      <header
        ref={headerRef}
        className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="hero-logo w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg tracking-tighter"
              style={{
                backgroundColor: activeBrand.accentColor,
                color: activeBrand.id === "vimar" ? "#1a1a2e" : "#fff",
              }}
            >
              {activeBrand.logoText[0]}
            </div>
            <div className="hero-title-text">
              <h1 className="font-bold text-lg tracking-tight leading-none">
                {activeBrand.logoText}
              </h1>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">
                {activeBrand.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hero-brand-selector">
            <BrandSelector activeBrand={activeBrandId} onSelect={handleBrandChange} />
          </div>

          <div className="hero-search hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/15 transition-colors"
            />
          </div>

          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors lg:hidden"
            whileTap={{ scale: 0.95 }}
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
          />

          {!searchQuery && currentCategory?.image && (
            <CategoryBanner category={currentCategory} accentColor={activeBrand.accentColor} />
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Grid3X3 className="w-4 h-4" />
              <span>
                {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
                {currentCategory ? ` in ${currentCategory.name}` : searchQuery ? ` matching "${searchQuery}"` : " featured"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <ListFilter className="w-4 h-4 text-white/40" />
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1 overflow-y-auto">
            {displayedProducts.length > 0 ? (
              <ProductGrid
                products={displayedProducts}
                accentColor={activeBrand.accentColor}
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
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        accentColor={activeBrand.accentColor}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
