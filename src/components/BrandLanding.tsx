"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { brands } from "@/lib/data";
import { withBasePath } from "@/lib/basePath";
import FluidBackground from "@/components/FluidBackground";
import BrandFloatCard from "@/components/BrandFloatCard";

interface BrandLandingProps {
  onSelect: (brandId: string) => void;
}

const ACCENT = "#39ff8f";
const EXIT_DURATION_MS = 700;

export default function BrandLanding({ onSelect }: BrandLandingProps) {
  const [exitingBrand, setExitingBrand] = useState<string | null>(null);

  const handlePick = (brandId: string) => {
    if (exitingBrand) return;
    setExitingBrand(brandId);
    // Timer-driven, not rAF/GSAP-callback-driven — the transition into the
    // showroom can never hang even if the tab throttles animation frames.
    window.setTimeout(() => onSelect(brandId), EXIT_DURATION_MS);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-surface"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FluidBackground brandId="landing" />

      {/* Showroom mark, top-left */}
      <div className="landing-logo fixed top-5 left-5 z-20 flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/logo.svg")} alt="" width={40} height={40} className="w-9 h-9 md:w-10 md:h-10" />
        <div className="leading-none">
          <p className="font-bold tracking-tight text-tertiary text-base md:text-lg">KAHANA</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-inverse mt-0.5">
            Electrical
          </p>
        </div>
      </div>

      <div
        className="relative z-10 h-full flex flex-col items-center transition-opacity duration-300"
        style={{ opacity: exitingBrand ? 0 : 1, transitionDelay: exitingBrand ? "200ms" : "0ms" }}
      >
        {/* Hero heading */}
        <main className="flex flex-col items-center text-center pt-[14vh] md:pt-[12vh] px-6 w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-inverse text-xs uppercase tracking-[0.22em]">
            <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            Elite Electrical Showroom
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-tertiary leading-tight"
          >
            Two Brands. One Elite Showroom.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="text-inverse mt-3 max-w-md text-sm md:text-base"
          >
            Pick a universe — Vimar&apos;s Italian design, or ABB&apos;s engineered precision.
          </motion.p>
        </main>

        {/* Floating brand cards */}
        <div className="flex flex-1 w-full items-start justify-center gap-5 md:gap-8 px-6 pt-[8vh]">
          {brands.map((brand) => (
            <BrandFloatCard
              key={brand.id}
              brand={brand}
              isExiting={exitingBrand === brand.id}
              isOtherExiting={!!exitingBrand && exitingBrand !== brand.id}
              exitDurationMs={EXIT_DURATION_MS}
              onPick={handlePick}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}