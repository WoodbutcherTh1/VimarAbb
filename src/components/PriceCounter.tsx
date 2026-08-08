"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface PriceCounterProps {
  value: number;
  className?: string;
}

// Counts up to the real price on every product change. If the previous
// settled price was lower than the new one, it continues climbing from
// there; otherwise it resets to zero first — the display only ever counts
// upward, never down. Turns green once it lands on the real value.
export default function PriceCounter({ value, className }: PriceCounterProps) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const lastSettled = useRef<number | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const prev = lastSettled.current;
    const startFrom = prev !== null && prev < value ? prev : 0;
    setSettled(false);

    const counter = { v: startFrom };
    if (displayRef.current) displayRef.current.textContent = startFrom.toFixed(2);

    const tween = gsap.to(counter, {
      v: value,
      duration: 0.85,
      ease: "power2.out",
      onUpdate: () => {
        if (displayRef.current) displayRef.current.textContent = counter.v.toFixed(2);
      },
      onComplete: () => {
        lastSettled.current = value;
        setSettled(true);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span
      ref={displayRef}
      className={className}
      style={{ color: settled ? "#34d399" : undefined, transition: "color 0.4s ease" }}
    >
      {value.toFixed(2)}
    </span>
  );
}
