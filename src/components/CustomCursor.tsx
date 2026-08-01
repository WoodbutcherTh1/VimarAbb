"use client";

import { useEffect, useRef } from "react";

interface CustomCursorProps {
  label?: string;
  accentColor?: string;
  hoverTargetSelector?: string;
}

export default function CustomCursor({
  label = "ENTER",
  accentColor = "#39FF14",
  hoverTargetSelector = "[data-cursor-hover]",
}: CustomCursorProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const card = cardRef.current;
    if (!ring || !card) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cardX = mouseX;
    let cardY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let isFirstMove = true;
    let scale = 0;
    let targetScale = 0;
    let isHoveringBtn = false;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isFirstMove) {
        cardX = mouseX;
        cardY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        isFirstMove = false;
        card.classList.add("active");
        ring.classList.add("active");
      }
      if (!isHoveringBtn) targetScale = 1;
    };

    const handleLeave = () => {
      targetScale = 0;
    };
    const handleEnter = () => {
      if (!isHoveringBtn) targetScale = 1;
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    const hoverTargets = Array.from(document.querySelectorAll(hoverTargetSelector));
    const onEnterTarget = () => {
      isHoveringBtn = true;
      targetScale = 0;
      ring.classList.add("expanded");
    };
    const onLeaveTarget = () => {
      isHoveringBtn = false;
      targetScale = 1;
      ring.classList.remove("expanded");
    };
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", onEnterTarget);
      el.addEventListener("mouseleave", onLeaveTarget);
    });

    const tick = () => {
      cardX += (mouseX - cardX) * 0.08;
      cardY += (mouseY - cardY) * 0.08;
      ringX = mouseX;
      ringY = mouseY;
      scale += (targetScale - scale) * 0.15;

      const ringScale = ring.classList.contains("expanded") ? 1.6 * scale : scale;

      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterTarget);
        el.removeEventListener("mouseleave", onLeaveTarget);
      });
      cancelAnimationFrame(rafId);
    };
  }, [hoverTargetSelector]);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none opacity-0 hidden md:block"
        style={{
          border: "1.5px solid rgba(255,255,255,0.45)",
          zIndex: 99998,
          transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease",
        }}
      />
      <div
        ref={cardRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none opacity-0 hidden md:flex items-center"
        style={{
          zIndex: 99999,
          padding: "0.75rem 1.5rem",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.15)",
          transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span
          className="text-[0.8rem] font-medium uppercase tracking-widest whitespace-nowrap"
          style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}73` }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
