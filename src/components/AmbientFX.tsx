"use client";

import { useEffect, useRef } from "react";

export default function AmbientFX({ accentColor }: { accentColor: string }) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const apply = () => {
      el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${accentColor}14, transparent 70%)`;
      raf = 0;
    };
    const handleMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", handleMove);
    apply();

    // Touch devices never fire mousemove, which would pin the spotlight dead
    // centre forever. Drift it slowly instead so the light still breathes.
    const isTouch = window.matchMedia("(hover: none)").matches;
    let driftRaf = 0;
    if (isTouch) {
      const start = performance.now();
      const drift = (now: number) => {
        const t = (now - start) / 1000;
        x = window.innerWidth * (0.5 + 0.28 * Math.sin(t * 0.22));
        y = window.innerHeight * (0.42 + 0.22 * Math.cos(t * 0.17));
        apply();
        driftRaf = requestAnimationFrame(drift);
      };
      driftRaf = requestAnimationFrame(drift);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf) cancelAnimationFrame(raf);
      if (driftRaf) cancelAnimationFrame(driftRaf);
    };
  }, [accentColor]);

  return (
    <>
      <div
        ref={spotlightRef}
        className="fixed inset-0 z-[1] pointer-events-none transition-[background] duration-300 ease-out"
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}
