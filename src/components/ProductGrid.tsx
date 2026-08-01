"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Product } from "@/lib/data";
import { Euro, Sparkles, ArrowUpRight } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  accentColor: string;
  onProductClick: (product: Product) => void;
}

function ProductCard({
  product,
  accentColor,
  onProductClick,
}: {
  product: Product;
  accentColor: string;
  onProductClick: (product: Product) => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    tiltTo.current = {
      x: gsap.quickTo(imageRef.current, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(imageRef.current, "y", { duration: 0.5, ease: "power3.out" }),
      rx: gsap.quickTo(imageRef.current, "rotateX", { duration: 0.5, ease: "power3.out" }),
      ry: gsap.quickTo(imageRef.current, "rotateY", { duration: 0.5, ease: "power3.out" }),
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !tiltTo.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltTo.current.x(px * 10);
    tiltTo.current.y(py * 10);
    tiltTo.current.ry(px * 12);
    tiltTo.current.rx(-py * 12);
  };

  const handleMouseLeave = () => {
    if (!tiltTo.current) return;
    tiltTo.current.x(0);
    tiltTo.current.y(0);
    tiltTo.current.rx(0);
    tiltTo.current.ry(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={`product-${product.id}`}
      onClick={() => onProductClick(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer perspective-1000"
    >
      <div className="product-card-reveal opacity-0 relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors duration-500">
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${product.image})`, transformStyle: "preserve-3d" }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Sparkles className="w-3 h-3" style={{ color: accentColor }} />
              <span className="text-xs font-medium">Featured</span>
            </div>
          )}

          {/* Stock badge */}
          <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium ${
            product.inStock
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/15 text-red-400 border border-red-500/20"
          }`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-white/30 mt-1 font-mono">{product.sku}</p>
            </div>
            <motion.div
              className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ rotate: 45 }}
            >
              <ArrowUpRight className="w-4 h-4 text-white/60" />
            </motion.div>
          </div>

          <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-medium bg-white/5 text-white/40 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-baseline gap-1">
              <Euro className="w-4 h-4 text-white/50" />
              <span className="text-2xl font-bold tracking-tight">
                {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-white/30 uppercase">{product.currency}</span>
            </div>
            <span className="text-xs text-white/20">excl. VAT</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductGrid({ products, accentColor, onProductClick }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".product-card-reveal");
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 36, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: "power3.out",
              overwrite: true,
            }
          ),
      });
      ScrollTrigger.refresh();
    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          accentColor={accentColor}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}
