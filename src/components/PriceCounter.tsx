"use client";

import { useEffect, useRef } from "react";
import { Euro } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PRICE_COLOR } from "@/lib/showroomConfig";

/** Neutral while the figure is still settling. */
const COUNTING_COLOR = "rgba(15, 23, 42, 0.55)";

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
}

/**
 * Counts up from 0.00 to the real price, then settles into green — the
 * colour is the "this is the final figure" signal, so it is applied on
 * completion rather than up front.
 */
export default function PriceCounter({
  value,
  currency,
  resetKey,
  className = "",
  iconClassName = "h-4 w-4 opacity-70",
  numberClassName = "text-2xl font-bold tracking-tight",
  currencyClassName = "text-xs uppercase opacity-60",
  duration = 0.9,
  delay = 0.15,
}: PriceCounterProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const num = numRef.current;
    if (!wrap || !num) return;

    // Reduced motion: land on the final figure instantly, no count-up.
    if (prefersReducedMotion()) {
      num.textContent = value.toFixed(2);
      gsap.set(wrap, { color: PRICE_COLOR });
      return;
    }

    const counter = { v: 0 };
    num.textContent = "0.00";
    gsap.set(wrap, { color: COUNTING_COLOR });

    const tween = gsap.to(counter, {
      v: value,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        num.textContent = counter.v.toFixed(2);
      },
      onComplete: () => {
        num.textContent = value.toFixed(2);
        gsap.to(wrap, { color: PRICE_COLOR, duration: 0.35, ease: "power2.out" });
      },
    });

    return () => {
      tween.kill();
      gsap.killTweensOf(wrap);
    };
  }, [value, duration, delay, resetKey]);

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