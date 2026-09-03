// Where a finished quote gets sent. The site is a static export with no
// backend, so a quote leaves the browser through the customer's own
// WhatsApp or mail client — these are the destinations it addresses.
//
// Leave a field empty to hide its button/entry; "Copy list" always works.

export const SHOWROOM_CONTACT = {
  /** International format, digits only, no "+" — e.g. "9725xxxxxxx". */
  whatsappNumber: "",
  /** e.g. "sales@example.com" */
  email: "",
  /** Display phone number, e.g. "+972 5 000 0000" (shown, not linked, if WhatsApp is empty). */
  phone: "",
  /** Physical address shown in the footer and contact page. */
  address: "",
  /** Opening / response hours, e.g. "Sat–Thu, 9:00 – 18:00". */
  hours: "",
  /** Short company blurb used in the footer and home page. */
  about:
    "KAHANA Electrical is a premium showroom for Vimar and ABB electrical solutions — switches, sockets, protection devices, enclosures, and building automation for residential and commercial projects.",
};

export const QUOTE_STORAGE_KEY = "kahana.quote.v1";

/** Prices read in green everywhere, independent of the active brand accent. */
export const PRICE_COLOR = "#16a34a";