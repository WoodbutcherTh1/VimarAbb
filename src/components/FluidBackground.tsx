"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function FluidBackground({ brandId }: { brandId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Draw gradient orbs
      const accentColor =
        brandId === "vimar" ? "201, 162, 39" : brandId === "abb" ? "255, 0, 0" : "57, 255, 143";

      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(time + i) * 0.1;
        p.y += p.vy + Math.cos(time + i * 0.5) * 0.1;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // The landing's green reads much hotter than the brand golds/reds,
        // so it gets a lighter hand.
        const intensity = brandId === "landing" ? 0.55 : 1;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 40);
        gradient.addColorStop(0, `rgba(${accentColor}, ${p.alpha * 0.4 * intensity})`);
        gradient.addColorStop(0.5, `rgba(${accentColor}, ${p.alpha * 0.1 * intensity})`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 40, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [brandId]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
