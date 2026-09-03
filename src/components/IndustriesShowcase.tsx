"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Industry } from "@/lib/data";

interface IndustriesShowcaseProps {
  industries: Industry[];
  accentDark: string;
}

export default function IndustriesShowcase({
  industries,
  accentDark,
}: IndustriesShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      // Track renders the industry list twice back-to-back; looping xPercent
      // from 0 to -50 cycles through set A then seamlessly hands off to set B.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: industries.length * 3.5,
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
    <section className="border-t border-line bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accentDark }}
          />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
            Industries we serve
          </h3>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-3.5 px-4 sm:px-6"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}
        >
          {[...industries, ...industries].map((industry, i) => (
            <div
              key={`${industry.name}-${i}`}
              className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-line bg-white shadow-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${industry.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
              <span className="absolute bottom-2 left-3 right-3 text-xs font-medium leading-tight text-white">
                {industry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}