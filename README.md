<div align="center">

<img src="public/logo.svg" alt="KAHANA Electrical" width="72" />

# KAHANA Electrical

**A professional, two-brand showroom for Vimar and ABB electrical solutions.**

KAHANA Electrical presents a curated catalog of premium electrical products —
Vimar's Italian design and ABB's engineered precision — with a clean,
business-first browsing experience and a quote flow that goes straight to
WhatsApp or email.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4,
shipped as a static export.

</div>

---

## Pages

| Route | What's there |
|-------|--------------|
| `/` | Home — hero with full-catalog search, brand cards, featured products, why-us, and quote CTA |
| `/vimar` | Vimar catalog — Plana, Eikon, and Smart Home collections |
| `/abb` | ABB catalog — Busch-Jaeger ranges, circuit protection, automation, enclosures, low voltage |
| `/contact` | Contact & quotes — config-driven channels plus catalog links |

## Highlights

- **Consistent branding** — KAHANA Electrical name, navy + amber identity, and a
  unified header/footer across every page.
- **Easy catalog browsing** — nested category sidebar with product counts,
  grid and list views, per-brand search (desktop *and* mobile), and breadcrumbs.
- **Quote flow** — build a list with "Add to Quote", adjust quantities, then send
  it over WhatsApp, email, or the clipboard. Persisted in `localStorage` and
  synced across tabs.
- **Mobile-first** — category drawer and search work on phones; no hidden
  navigation.
- **Business essentials** — config-driven contact details in the footer, contact
  page, and floating WhatsApp button.

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, `output: "export"`) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion + GSAP (restrained: drawers, modal, price counter) |
| Hosting | GitHub Pages (GitHub Actions workflow) or any static host |

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build      # static export to dist/
```

The GitHub Actions workflow at `.github/workflows/deploy-pages.yml` builds with
`NEXT_PUBLIC_BASE_PATH=/VimarAbb` and publishes `dist/` to Pages on every push
to `main`.

## Configuration

All business contact details live in `src/lib/showroomConfig.ts` — set
`whatsappNumber`, `email`, `phone`, `address`, and `hours` to enable the send
buttons, footer contact column, contact page, and floating WhatsApp button.
Empty fields are hidden automatically.

The product catalog (brands, categories, products, images) lives in
`src/lib/data.ts`.