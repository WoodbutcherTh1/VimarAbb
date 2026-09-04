"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Category } from "@/lib/data";

interface CategoryBannerProps {
  category: Category;
  accentColor: string;
}

export default function CategoryBanner({ category, accentColor }: CategoryBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".category-banner-image",
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".category-banner-title",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(
        ".category-banner-glow",
        { opacity: 0 },
        { opacity: 0.35, duration: 1.4, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [category.id]);

  if (!category.image) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-48 md:h-64 overflow-hidden border-b border-white/5"
    >
      <div
        className="category-banner-image absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${category.image})` }}
      />
      <div
        className="category-banner-glow absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${accentColor}20 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-surface/20" />
      <div className="relative z-10 h-full flex items-end p-6 md:p-8">
        <h2 className="category-banner-title text-2xl md:text-4xl font-bold tracking-tight text-tertiary">
          {category.name}
        </h2>
      </div>
    </div>
  );
}
