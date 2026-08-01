"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { brands } from "@/lib/data";
import { ArrowRight, Zap } from "lucide-react";

interface BrandLandingProps {
  onSelect: (brandId: string) => void;
}

const BACKDROP_IMAGES = [
  "/images/abb/switch-ranges/impressivo.jpg",
  "/images/abb/enclosures/main-distribution-board.jpg",
  "/images/abb/switch-ranges/future-linear.jpg",
  "/images/abb/industries/control-room.webp",
  "/images/abb/din-rail/s800.png",
  "/images/abb/switch-ranges/axcent.jpg",
  "/images/abb/industries/data-centers.webp",
  "/images/abb/switch-ranges/busch-art-linear.jpg",
  "/images/abb/enclosures/panelboard-interior.png",
  "/images/abb/industries/smart-distribution.webp",
];

const cardCopy: Record<string, { title: string; blurb: string; textColor: string }> = {
  vimar: {
    title: "VIMAR",
    blurb: "Italian design electrical solutions",
    textColor: "#1a1a2e",
  },
  abb: {
    title: "ABB",
    blurb: "Engineering the future",
    textColor: "#ffffff",
  },
};

export default function BrandLanding({ onSelect }: BrandLandingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [exitingBrand, setExitingBrand] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".backdrop-tile",
        { opacity: 0, scale: 1.15 },
        { opacity: 1, scale: 1, duration: 1.6, stagger: 0.06, ease: "power2.out" }
      );
      gsap.fromTo(
        ".landing-heading",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".landing-card",
        { y: 40, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, delay: 0.6, stagger: 0.12, ease: "power3.out" }
      );

      // slow ambient drift on the backdrop
      gsap.to(bgRef.current, {
        backgroundPosition: "52% 48%",
        duration: 18,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      const handleMove = (e: MouseEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        gsap.to(".backdrop-layer", {
          x: px * -20,
          y: py * -20,
          duration: 1,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handlePick = (brandId: string) => {
    if (exitingBrand) return;
    setExitingBrand(brandId);

    const tl = gsap.timeline({
      onComplete: () => onSelect(brandId),
    });
    tl.to(`.landing-card:not([data-brand="${brandId}"])`, {
      opacity: 0,
      scale: 0.85,
      duration: 0.35,
      ease: "power2.in",
    })
      .to(
        `.landing-card[data-brand="${brandId}"]`,
        { scale: 18, duration: 0.75, ease: "power3.in" },
        "-=0.15"
      )
      .to(".landing-heading, .backdrop-tile", { opacity: 0, duration: 0.3 }, "<");
  };

  return (
    <motion.div
      ref={rootRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#050507]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop mosaic */}
      <div
        ref={bgRef}
        className="backdrop-layer absolute -inset-10 grid grid-cols-5 grid-rows-2 gap-1 opacity-70"
        style={{ filter: "blur(2px)" }}
      >
        {BACKDROP_IMAGES.map((src, i) => (
          <div
            key={src + i}
            className="backdrop-tile relative bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/80 via-[#050507]/85 to-[#050507]/95" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="landing-heading text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 text-white/40 text-xs uppercase tracking-[0.3em]">
            <Zap className="w-3.5 h-3.5" />
            Elite Electrical Showroom
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Choose Your Universe
          </h1>
          <p className="text-white/40 mt-3 text-sm md:text-base">
            Two brands. One premium catalog experience.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
          {brands.map((brand) => {
            const copy = cardCopy[brand.id];
            return (
              <motion.button
                key={brand.id}
                data-brand={brand.id}
                onClick={() => handlePick(brand.id)}
                className="landing-card group relative w-64 h-80 md:w-72 md:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
                style={{ transformOrigin: "center" }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background:
                      brand.id === "vimar"
                        ? `linear-gradient(145deg, ${brand.accentColor}, #7a611a)`
                        : `linear-gradient(145deg, ${brand.accentColor}, #7a0000)`,
                  }}
                />
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60"
                  style={{
                    backgroundImage: `url(${
                      brand.id === "vimar"
                        ? "/images/abb/switch-ranges/decento.jpg"
                        : "/images/abb/switch-ranges/impressivo.jpg"
                    })`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl tracking-tighter bg-white/10 backdrop-blur-md border border-white/20"
                    style={{ color: copy.textColor }}
                  >
                    {copy.title[0]}
                  </div>
                  <h2
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: copy.textColor }}
                  >
                    {copy.title}
                  </h2>
                  <p
                    className="text-xs uppercase tracking-widest text-center opacity-80"
                    style={{ color: copy.textColor }}
                  >
                    {copy.blurb}
                  </p>

                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: copy.textColor }}
                  >
                    Enter Showroom
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
