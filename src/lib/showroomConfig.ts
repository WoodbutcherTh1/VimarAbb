// Where a finished quote gets sent. The site is a static export with no
// backend, so a quote leaves the browser through the customer's own
// WhatsApp or mail client — these are the destinations it addresses.
//
// Leave a field empty to hide its button; "Copy list" always works.
export const SHOWROOM_CONTACT = {
  /** International format, digits only, no "+" — e.g. "9725xxxxxxx". */
  whatsappNumber: "",
  /** e.g. "sales@example.com" */
  email: "",
};

export const QUOTE_STORAGE_KEY = "vimarabb.quote.v1";

/** Prices read in green everywhere, independent of the active brand accent. */
export const PRICE_COLOR = "#39ff8f";

/**
 * Accent/price variants that hold WCAG AA contrast on the raised (light)
 * surfaces. The raw brand accents fail on #fdfcfc — gold especially — so
 * these darker variants carry text, icons, and focus on light panels while
 * the raw accents stay on the dark chrome.
 */
export const PRICE_COLOR_RAISED = "#1a7f37";

export const ACCENT_ON_RAISED: Record<string, string> = {
  vimar: "#8a6d0f",
  abb: "#b30000",
};

export function accentOnRaised(brandId: string): string {
  return ACCENT_ON_RAISED[brandId] ?? PRICE_COLOR_RAISED;
}
