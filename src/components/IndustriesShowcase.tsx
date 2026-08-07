"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Industry } from "@/lib/data";

interface IndustriesShowcaseProps {
  industries: Industry[];
  accentColor: string;
}

function IndustryCard({ industry, accentColor }: { industry: Industry; accentColor: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 10 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative w-44 h-28 shrink-0 rounded-xl overflow-hidden border border-white/5 group"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry, scale: tilt.rx || tilt.ry ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${industry.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${accentColor}` }}
      />
      <span className="absolute bottom-2 left-3 right-3 text-xs font-medium text-white/90 leading-tight">
        {industry.name}
      </span>
    </motion.div>
  );
}

export default function IndustriesShowcase({ industries, accentColor }: IndustriesShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

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
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">
          Industries We Serve
        </h3>
      </div>

      <div className="relative" style={{ perspective: "800px" }}>
        <div ref={trackRef} className="flex gap-4 w-max px-6">
          {[...industries, ...industries].map((industry, i) => (
            <IndustryCard key={`${industry.name}-${i}`} industry={industry} accentColor={accentColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
