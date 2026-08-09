"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { brands } from "@/lib/data";
import { withBasePath } from "@/lib/basePath";
import MountainScene from "@/components/MountainScene";
import FluidBackground from "@/components/FluidBackground";
import AmbientFX from "@/components/AmbientFX";
import BrandFloatCard from "@/components/BrandFloatCard";
import CustomCursor from "@/components/CustomCursor";

interface BrandLandingProps {
  onSelect: (brandId: string) => void;
}

const ACCENT = "#39ff8f";
const EXIT_DURATION_MS = 900;
const WORDMARK = "SHOWROOM";

function WordReveal({ lines }: { lines: string[] }) {
  let wordIndex = 0;
  return (
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi) => {
            const delay = wordIndex * 0.1;
            wordIndex++;
            return (
              <span key={wi} className="word-wrapper mr-[0.28em]">
                <span className="word-inner" style={{ animationDelay: `${delay}s` }}>
                  {word}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function LetterReveal({ text }: { text: string }) {
  return (
    <h2
      className="footer-logo-text text-center font-bold select-none"
      style={{
        fontSize: "min(15vw, 220px)",
        letterSpacing: "-0.03em",
        lineHeight: 0.8,
        color: "#ffffff",
        opacity: 0.95,
        whiteSpace: "nowrap",
        width: "100%",
      }}
    >
      {[...text].map((char, i) => (
        <span key={i} className="letter-wrapper">
          <span className="letter-inner" style={{ animationDelay: `${i * 0.09}s` }}>
            {char}
          </span>
        </span>
      ))}
    </h2>
  );
}

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
      className="fixed inset-0 z-50 overflow-hidden bg-[#050507]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CustomCursor label="Enter ⇢" accentColor={ACCENT} />
      <FluidBackground brandId="landing" />
      <AmbientFX accentColor={ACCENT} />
      <MountainScene accentColor={ACCENT} />

      {/* top vignette */}
      <div
        className="fixed inset-x-0 top-0 h-[40vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(0,0,0,0.9), transparent 70%)" }}
      />

      <div
        className="relative z-10 h-full flex flex-col items-center transition-opacity duration-300"
        style={{ opacity: exitingBrand ? 0 : 1, transitionDelay: exitingBrand ? "200ms" : "0ms" }}
      >
        {/* Hero heading */}
        <main className="flex flex-col items-center text-center pt-[5vh] md:pt-[8vh] px-6 w-full max-w-3xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/logo.svg")}
            alt=""
            width={56}
            height={56}
            className="landing-logo w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4"
          />
          <div className="flex items-center gap-2 mb-3 md:mb-4 text-white/40 text-xs uppercase tracking-[0.3em]">
            <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            Elite Electrical Showroom
          </div>
          <WordReveal lines={["Two Brands.", "One Elite Showroom."]} />
          <p className="text-white/40 mt-3 md:mt-5 text-sm md:text-base max-w-md">
            Pick a universe — Vimar&apos;s Italian design, or ABB&apos;s engineered precision.
          </p>
        </main>

        {/* Floating brand cards, above the mountain */}
        <div className="relative flex-1 w-full">
          {brands.map((brand) => (
            <BrandFloatCard
              key={brand.id}
              brand={brand}
              tiltDeg={brand.id === "vimar" ? -7 : 7}
              floatDuration={brand.id === "vimar" ? 7 : 8.5}
              floatDelay={brand.id === "vimar" ? "0s" : "-2.5s"}
              isExiting={exitingBrand === brand.id}
              isOtherExiting={!!exitingBrand && exitingBrand !== brand.id}
              exitDurationMs={EXIT_DURATION_MS}
              onPick={handlePick}
            />
          ))}
        </div>
      </div>

      {/* Giant wordmark, pinned bottom, over the mountain */}
      <div
        className="fixed inset-x-0 bottom-[-1vh] flex justify-center pointer-events-none z-[3] transition-opacity duration-300"
        style={{ opacity: exitingBrand ? 0 : 1 }}
      >
        <LetterReveal text={WORDMARK} />
      </div>
    </motion.div>
  );
}
