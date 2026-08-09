// Generates the Vimar product artwork in public/images/vimar/.
// Vimar has no real product photography in this repo; these are drawn
// stand-ins in the brand's satin-plate look, replacing the random
// picsum.photos stock photos that used to fill those cards.
//
// Run: node scripts/generate-vimar-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "vimar");
const GOLD = "#c9a227";

/** Shared scene: dark backdrop, soft floor shadow, satin plate. */
function frame(face, { plate = "satin" } = {}) {
  const plateFill = plate === "anthracite" ? "url(#g-anthracite)" : "url(#g-satin)";
  const plateEdge = plate === "anthracite" ? "#4a4c55" : "#b8b4ab";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <radialGradient id="g-bg" cx="50%" cy="38%" r="72%">
      <stop offset="0" stop-color="#1c1d24"/>
      <stop offset="1" stop-color="#08080b"/>
    </radialGradient>
    <linearGradient id="g-satin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4f1eb"/>
      <stop offset="0.45" stop-color="#e2ded6"/>
      <stop offset="1" stop-color="#c4c0b7"/>
    </linearGradient>
    <linearGradient id="g-anthracite" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3d3f47"/>
      <stop offset="0.5" stop-color="#2b2d34"/>
      <stop offset="1" stop-color="#1c1e23"/>
    </linearGradient>
    <linearGradient id="g-recess" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a9a59c"/>
      <stop offset="1" stop-color="#d8d4cc"/>
    </linearGradient>
    <radialGradient id="g-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="600" fill="url(#g-bg)"/>
  <ellipse cx="300" cy="470" rx="190" ry="40" fill="url(#g-shadow)"/>

  <g>
    <rect x="160" y="150" width="280" height="280" rx="30" fill="${plateFill}"/>
    <rect x="160" y="150" width="280" height="280" rx="30" fill="none" stroke="${plateEdge}" stroke-width="2"/>
    <rect x="176" y="166" width="248" height="248" rx="22" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>
${face}
  </g>

  <rect x="160" y="150" width="280" height="280" rx="30" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1.5"/>
</svg>
`;
}

/** Italian P17/11 style socket: round recess, three inline pin holes. */
const socketItalian = `    <circle cx="300" cy="290" r="86" fill="url(#g-recess)"/>
    <circle cx="300" cy="290" r="86" fill="none" stroke="#9c988f" stroke-width="2"/>
    <circle cx="300" cy="290" r="70" fill="#ece8e0"/>
    <rect x="292" y="238" width="16" height="34" rx="8" fill="#2a2a2e"/>
    <rect x="292" y="308" width="16" height="34" rx="8" fill="#2a2a2e"/>
    <rect x="248" y="282" width="16" height="34" rx="8" fill="#2a2a2e" transform="rotate(90 256 299)"/>
    <rect x="336" y="282" width="16" height="34" rx="8" fill="#2a2a2e" transform="rotate(90 344 299)"/>`;

/** Schuko: round recess with the two side earth clips. */
const socketSchuko = `    <circle cx="300" cy="290" r="90" fill="url(#g-recess)"/>
    <circle cx="300" cy="290" r="90" fill="none" stroke="#9c988f" stroke-width="2"/>
    <circle cx="300" cy="290" r="74" fill="#ece8e0"/>
    <rect x="266" y="272" width="18" height="36" rx="9" fill="#2a2a2e"/>
    <rect x="316" y="272" width="18" height="36" rx="9" fill="#2a2a2e"/>
    <path d="M214 274 h16 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -6 6 h-16 Z" fill="#8f8b83"/>
    <path d="M386 274 h-16 a6 6 0 0 0 -6 6 v20 a6 6 0 0 0 6 6 h16 Z" fill="#8f8b83"/>`;

/** USB-C outlet: oval port plus a charge indicator. */
const usbC = `    <rect x="216" y="230" width="168" height="120" rx="16" fill="url(#g-recess)"/>
    <rect x="216" y="230" width="168" height="120" rx="16" fill="none" stroke="#9c988f" stroke-width="2"/>
    <rect x="258" y="278" width="84" height="24" rx="12" fill="#26262a"/>
    <rect x="266" y="285" width="68" height="10" rx="5" fill="#4a4a52"/>
    <circle cx="300" cy="382" r="7" fill="${GOLD}"/>
    <text x="300" y="352" font-family="Helvetica,Arial,sans-serif" font-size="17" letter-spacing="3"
          fill="#8b8780" text-anchor="middle">USB-C</text>`;

/** Wide soft-touch rocker. */
const rocker = `    <rect x="222" y="222" width="156" height="156" rx="18" fill="url(#g-recess)"/>
    <rect x="230" y="230" width="140" height="140" rx="14" fill="#efebe4"/>
    <path d="M230 300 h140" stroke="#c3bfb6" stroke-width="2"/>
    <rect x="230" y="230" width="140" height="70" rx="14" fill="#f6f3ed"/>
    <circle cx="300" cy="264" r="6" fill="${GOLD}" opacity="0.8"/>`;

/** Rotary dimmer: knurled knob with a gold level arc. */
const dimmer = `    <circle cx="300" cy="290" r="92" fill="none" stroke="#cfcbc2" stroke-width="8"/>
    <path d="M300 198 a92 92 0 0 1 65 157" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="300" cy="290" r="66" fill="url(#g-recess)"/>
    <circle cx="300" cy="290" r="58" fill="#ebe7df"/>
    <rect x="295" y="240" width="10" height="30" rx="5" fill="#2a2a2e"/>
    <g stroke="#b5b1a8" stroke-width="3" stroke-linecap="round">
      <path d="M300 224 v10"/><path d="M366 290 h-10"/><path d="M300 356 v-10"/><path d="M234 290 h10"/>
    </g>`;

/** Empty 3-module frame (anthracite plate). */
const frame3m = `    <rect x="206" y="236" width="188" height="128" rx="12" fill="#101116"/>
    <rect x="206" y="236" width="188" height="128" rx="12" fill="none" stroke="#5a5c65" stroke-width="2"/>
    <g fill="none" stroke="#4a4c55" stroke-width="2">
      <path d="M269 236 v128"/><path d="M332 236 v128"/>
    </g>
    <rect x="206" y="236" width="188" height="128" rx="12" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1.5"/>`;

/** Thermostat: colour display with a temperature readout. */
const thermostat = `    <rect x="206" y="216" width="188" height="148" rx="16" fill="#101116"/>
    <rect x="206" y="216" width="188" height="148" rx="16" fill="none" stroke="#9c988f" stroke-width="2"/>
    <text x="300" y="300" font-family="Helvetica,Arial,sans-serif" font-size="58" font-weight="bold"
          fill="#f4f1eb" text-anchor="middle">21°</text>
    <text x="300" y="332" font-family="Helvetica,Arial,sans-serif" font-size="16" letter-spacing="3"
          fill="${GOLD}" text-anchor="middle">COMFORT</text>
    <rect x="240" y="386" width="120" height="6" rx="3" fill="#d5d1c8"/>
    <rect x="240" y="386" width="72" height="6" rx="3" fill="${GOLD}"/>`;

/** DIN-rail gateway module with status LEDs. */
const gateway = `    <rect x="200" y="226" width="200" height="128" rx="10" fill="#26282f"/>
    <rect x="200" y="226" width="200" height="128" rx="10" fill="none" stroke="#5a5c65" stroke-width="2"/>
    <rect x="216" y="244" width="168" height="40" rx="6" fill="#14151a"/>
    <g>
      <circle cx="238" cy="264" r="7" fill="#39ff8f"/>
      <circle cx="264" cy="264" r="7" fill="${GOLD}"/>
      <circle cx="290" cy="264" r="7" fill="#3a3c44"/>
    </g>
    <g fill="#3a3c44">
      <rect x="216" y="300" width="76" height="36" rx="5"/>
      <rect x="308" y="300" width="76" height="36" rx="5"/>
    </g>
    <text x="300" y="384" font-family="Helvetica,Arial,sans-serif" font-size="16" letter-spacing="4"
          fill="#8b8780" text-anchor="middle">KNX</text>`;

const ART = {
  "vimar-plana-socket-2p": frame(socketItalian),
  "vimar-plana-socket-usb": frame(usbC),
  "vimar-plana-switch-1way": frame(rocker),
  "vimar-plana-switch-dimmer": frame(dimmer),
  "vimar-eikon-frame-3m": frame(frame3m, { plate: "anthracite" }),
  "vimar-eikon-schuko": frame(socketSchuko),
  "vimar-view-thermostat": frame(thermostat),
  "vimar-byme-gateway": frame(gateway, { plate: "anthracite" }),
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [id, svg] of Object.entries(ART)) {
  writeFileSync(join(OUT_DIR, `${id}.svg`), svg);
}
console.log(`[generate-vimar-art] wrote ${Object.keys(ART).length} files -> ${OUT_DIR}`);
