"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Industry } from "@/lib/data";

interface IndustriesShowcaseProps {
  industries: Industry[];
  accentColor: string;
}

export default function IndustriesShowcase({ industries, accentColor }: IndustriesShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (!trackRef.current) return;
    // The marquee is pure decoration — hold it still for reduced motion.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      // Track renders the industry list twice back-to-back; looping xPercent
      // from 0 to -50 cycles through set A then seamlessly hands off to set B.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: industries.length * 4,
        ease: "none",
        repeat: -1,
      });

      const pause = () => tween.pause();
      const resume = () => tween.play();
      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", resume);

      return () => {
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", resume);
      };
    }, trackRef);

    return () => ctx.revert();
  }, [industries]);

  return (
    <div className="border-t border-white/5 py-8 overflow-hidden">
      <div className="px-6 mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-inverse">
          Industries We Serve
        </h3>
      </div>

      <div className="relative">
        <div ref={trackRef} className="flex gap-4 w-max px-6">
          {(reducedMotion ? industries : [...industries, ...industries]).map((industry, i) => (
            <div
              key={`${industry.name}-${i}`}
              className="relative w-44 h-28 shrink-0 rounded-sm overflow-hidden border border-white/5 group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${industry.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
              <span className="absolute bottom-2 left-3 right-3 text-xs font-medium text-tertiary leading-tight">
                {industry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
