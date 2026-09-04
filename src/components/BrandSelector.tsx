"use client";

import { motion } from "framer-motion";
import { brands } from "@/lib/data";

interface BrandSelectorProps {
  activeBrand: string;
  onSelect: (brandId: string) => void;
}

export default function BrandSelector({ activeBrand, onSelect }: BrandSelectorProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2 p-1 rounded-sm bg-white/5 backdrop-blur-md border border-white/10">
      {brands.map((brand) => {
        const isActive = activeBrand === brand.id;
        return (
          <motion.button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            aria-pressed={isActive}
            className={`relative px-3 py-2 md:px-6 md:py-2.5 rounded-sm text-xs md:text-sm font-bold tracking-wider uppercase transition-colors ${
              isActive ? "text-tertiary" : "text-inverse hover:text-tertiary/70"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeBrand"
                className="absolute inset-0 rounded-sm"
                style={{ backgroundColor: brand.accentColor }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10">{brand.logoText}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
