"use client";

import { useEffect, useRef } from "react";
import { Euro } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PRICE_COLOR, PRICE_COLOR_RAISED } from "@/lib/showroomConfig";

/** Neutral while the figure is still settling. */
const COUNTING_COLOR = "rgba(255,255,255,0.55)";
const COUNTING_COLOR_RAISED = "#777169";

interface PriceCounterProps {
  value: number;
  currency: string;
  /** Change this to replay the count for a new product on the same mount. */
  resetKey?: string;
  className?: string;
  iconClassName?: string;
  numberClassName?: string;
  currencyClassName?: string;
  duration?: number;
  delay?: number;
  /** Set when the counter sits on a raised (light) surface — the settled
      green has to darken to hold WCAG AA contrast on #fdfcfc. */
  onRaised?: boolean;
}

/**
 * Counts up from 0.00 to the real price, then settles into green — the
 * colour is the "this is the final figure" signal, so it is applied on
 * completion rather than up front.
 *
 * Everything is driven straight onto the nodes by GSAP; keeping the
 * in-flight value out of React state avoids a re-render per frame.
 */
export default function PriceCounter({
  value,
  currency,
  resetKey,
  className = "",
  iconClassName = "w-4 h-4 opacity-70",
  numberClassName = "text-2xl font-bold tracking-tight",
  currencyClassName = "text-xs uppercase opacity-60",
  duration = 0.9,
  delay = 0.15,
  onRaised = false,
}: PriceCounterProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const num = numRef.current;
    if (!wrap || !num) return;

    const counter = { v: 0 };
    num.textContent = "0.00";
    gsap.set(wrap, { color: onRaised ? COUNTING_COLOR_RAISED : COUNTING_COLOR });

    // Reduced motion: skip the count-up, land on the final figure at once.
    const tween = gsap.to(counter, {
      v: value,
      duration: prefersReducedMotion() ? 0 : duration,
      delay: prefersReducedMotion() ? 0 : delay,
      ease: "power2.out",
      onUpdate: () => {
        num.textContent = counter.v.toFixed(2);
      },
      onComplete: () => {
        // Land exactly on the price, then flip to green.
        num.textContent = value.toFixed(2);
        gsap.to(wrap, { color: onRaised ? PRICE_COLOR_RAISED : PRICE_COLOR, duration: 0.35, ease: "power2.out" });
      },
    });

    return () => {
      tween.kill();
      gsap.killTweensOf(wrap);
    };
  }, [value, duration, delay, resetKey, onRaised]);

  return (
    <span ref={wrapRef} className={className}>
      <Euro className={iconClassName} />
      <span ref={numRef} className={numberClassName}>
        0.00
      </span>
      <span className={currencyClassName}>{currency}</span>
    </span>
  );
}
