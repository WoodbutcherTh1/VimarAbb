"use client";

import { brands, getAllProducts } from "@/lib/data";

// A small curated mosaic of real catalog photography, mixed across both
// brands — an atmospheric accent, not a product listing, so it stays out
// of the way of the hero copy and floating cards.
const TILES = [
  { rotate: -4, top: "6%", left: "4%", size: 92 },
  { rotate: 3, top: "2%", left: "16%", size: 68 },
  { rotate: -2, top: "16%", left: "10%", size: 56 },
  { rotate: 5, top: "9%", left: "26%", size: 60 },
  { rotate: -6, top: "20%", left: "22%", size: 44 },
];

export default function ProductMosaic() {
  const pool = brands.flatMap((brand) => getAllProducts(brand).filter((p) => p.featured));
  const picks = TILES.map((_, i) => pool[i % pool.length]).filter(Boolean);

  return (
    <div className="hidden lg:block fixed top-0 right-0 w-[420px] h-[320px] pointer-events-none z-[2] opacity-[0.35]">
      {picks.map((product, i) => {
        const tile = TILES[i];
        return (
          <div
            key={product.id}
            className="absolute rounded-lg overflow-hidden border border-white/10 shadow-2xl"
            style={{
              top: tile.top,
              left: tile.left,
              width: tile.size,
              height: tile.size,
              transform: `rotate(${tile.rotate}deg)`,
              filter: "grayscale(0.4) brightness(0.75)",
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        );
      })}
    </div>
  );
}
