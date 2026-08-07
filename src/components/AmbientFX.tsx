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

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf) cancelAnimationFrame(raf);
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
