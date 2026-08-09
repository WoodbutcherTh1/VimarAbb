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
