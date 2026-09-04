import { useEffect, useRef } from "react";

/**
 * Minimal WCAG 2.2 dialog behavior shared by the product modal and the quote
 * panel: traps Tab inside the dialog, closes on Escape, moves focus to the
 * dialog on open, and restores it to the trigger on close.
 *
 * Returns a ref to attach to the dialog element (the element that carries
 * `role="dialog"` / `aria-modal`).
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest onClose without re-running the effect on every render.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    // Move focus into the dialog (first focusable element, e.g. the close
    // button) so keyboard users land inside it.
    const initial =
      container?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
    initial?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isWithin = !!container && container.contains(active);
      // Only react while focus is inside this dialog — so when the quote
      // panel sits on top of the product modal, Escape closes just the panel.
      if (!isWithin) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !container) return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen]);

  return containerRef;
}