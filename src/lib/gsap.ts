import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * True when the OS asks for reduced motion. GSAP tweens are not affected by
 * the CSS `prefers-reduced-motion` block, so components must gate their own
 * tweens (skip intro timelines, land counters instantly) with this helper.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

