import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import {
  brands,
  getAllProducts,
  countProductsInCategory,
  Product,
} from "@/lib/data";
import { SHOWROOM_CONTACT } from "@/lib/showroomConfig";
import CatalogSearch from "@/components/CatalogSearch";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Small data helpers (static, computed at build time)
// ---------------------------------------------------------------------------

function findProduct(brandId: string, productId: string): Product | undefined {
  const brand = brands.find((b) => b.id === brandId);
  if (!brand) return undefined;
  return getAllProducts(brand).find((p) => p.id === productId);
}

const TOTAL_PRODUCTS = brands.reduce((n, b) => n + getAllProducts(b).length, 0);
const TOTAL_CATEGORIES = brands.reduce((n, b) => n + b.categories.length, 0);

const HERO_MAIN = findProduct("abb", "abb-range-impressivo");
const HERO_ACCENT = findProduct("abb", "abb-mcb-s200-c16");
const RANGE_PICKS = [
  findProduct("vimar", "vimar-plana-socket-2p"),
  findProduct("vimar", "vimar-view-thermostat"),
  findProduct("abb", "abb-mcb-s200-c16"),
  findProduct("abb", "abb-range-impressivo"),
].filter((p): p is Product => !!p);

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function Kicker({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "light" }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em]",
        tone === "muted" ? "text-muted" : "text-white/50"
      )}
    >
      <span className="h-1.5 w-1.5 bg-amber-400" />
      {children}
    </p>
  );
}

/** Corner tick marks that give framed imagery a technical, blueprint feel. */
function CornerTicks({ color = "border-navy-900" }: { color?: string }) {
  return (
    <>
      <span className={cn("pointer-events-none absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2", color)} />
      <span className={cn("pointer-events-none absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2", color)} />
      <span className={cn("pointer-events-none absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2", color)} />
      <span className={cn("pointer-events-none absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2", color)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="flex flex-col justify-center lg:col-span-7 lg:pr-10">
          <Kicker>KAHANA Electrical — authorized showroom</Kicker>

          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-navy-950 sm:text-6xl">
            Premium electrical products,
            <br />
            from <span className="font-serif font-medium italic text-amber-700">two great houses.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            We carry Vimar&apos;s Italian design and ABB&apos;s engineered
            precision — switches, sockets, circuit protection, enclosures and
            building automation — with fast, itemized quotes for every project.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/vimar"
              className="group flex items-center gap-2 bg-navy-950 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-800"
            >
              Browse the catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-2 border-b border-navy-950/20 pb-0.5 text-sm font-semibold text-navy-950 transition-colors hover:border-amber-600 hover:text-amber-700"
            >
              Request a quote
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-9">
            <CatalogSearch />
          </div>

          <p className="mt-9 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {TOTAL_PRODUCTS} products · {TOTAL_CATEGORIES} collections · quotes within 24h
          </p>
        </div>

        {/* Product collage */}
        <div className="relative lg:col-span-5">
          <div className="relative">
            {HERO_MAIN && (
              <figure className="relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${HERO_MAIN.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
                  <CornerTicks color="border-white/70" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <span>FIG. 01 — Busch-Jaeger / impressivo</span>
                  <span className="text-navy-950">Glass finish</span>
                </figcaption>
              </figure>
            )}

            {HERO_ACCENT && (
              <figure className="absolute -bottom-10 -left-4 w-40 bg-white shadow-xl sm:-left-8 sm:w-48">
                <div className="relative aspect-square overflow-hidden border border-line">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${HERO_ACCENT.image})` }}
                  />
                  <CornerTicks />
                </div>
                <figcaption className="border border-t-0 border-line px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  FIG. 02 — System pro M
                  <br />
                  <span className="text-navy-950">S200 · 16A C-curve</span>
                </figcaption>
              </figure>
            )}

            <span className="pointer-events-none absolute -right-6 top-10 hidden select-none font-mono text-[10px] uppercase tracking-[0.3em] text-slate-300 lg:block" style={{ writingMode: "vertical-rl" }}>
              Vimar — ABB — KAHANA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="overflow-hidden border-b border-line bg-[#f4f5f7]">
      <div className="flex items-center gap-3 overflow-x-auto px-4 py-3.5 sm:px-6">
        <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
          Catalog&nbsp;/
        </span>
        {brands.map((brand) =>
          brand.categories.map((cat, i) => (
            <span key={`${brand.id}-${cat.id}`} className="flex shrink-0 items-center gap-3">
              {i > 0 || brand.id !== "vimar" ? (
                <span className="font-mono text-[10px] text-slate-300">/</span>
              ) : null}
              <Link
                href={`/${brand.id}`}
                className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-navy-950"
              >
                {cat.name}
              </Link>
            </span>
          ))
        )}
      </div>
    </section>
  );
}

function BrandRow({
  brand,
  imageProduct,
  tone,
}: {
  brand: (typeof brands)[number];
  imageProduct?: Product;
  tone: "cream" | "navy";
}) {
  const light = tone === "navy";
  return (
    <section className={cn("border-b border-line", light ? "bg-navy-950 text-white" : "bg-[#faf6ec] text-navy-950")}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
        {/* Image */}
        <div className={cn("lg:col-span-5", light ? "lg:order-2" : "lg:order-1")}>
          {imageProduct && (
            <figure className="relative">
              <div className={cn("relative aspect-square overflow-hidden", light ? "border border-white/15" : "border border-navy-950/10")}>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageProduct.image})` }}
                />
                {light && <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 to-transparent" />}
                <CornerTicks color={light ? "border-amber-300/70" : "border-amber-600/60"} />
              </div>
              <figcaption className={cn(
                "mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em]",
                light ? "text-white/50" : "text-muted"
              )}>
                <span>{imageProduct.sku}</span>
                <span className={light ? "text-white/90" : "text-navy-950"}>{imageProduct.name}</span>
              </figcaption>
            </figure>
          )}
        </div>

        {/* Copy */}
        <div className={cn("flex flex-col justify-center lg:col-span-7", light ? "lg:order-1 lg:pr-10" : "lg:order-2 lg:pl-10")}>
          <Kicker tone={light ? "light" : "muted"}>
            {light ? "House 02 — engineered precision" : "House 01 — Italian design"}
          </Kicker>

          <h2 className={cn("mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl", light ? "text-white" : "text-navy-950")}>
            {brand.name}
          </h2>
          <p className={cn("mt-2 font-serif text-xl italic", light ? "text-amber-300" : "text-amber-700")}>
            {brand.tagline}
          </p>

          <dl className={cn("mt-8", light ? "border-white/15" : "border-navy-950/15")}>
            {brand.categories.map((cat) => (
              <div
                key={cat.id}
                className={cn(
                  "flex items-baseline justify-between gap-4 border-t py-3 last:border-b",
                  light ? "border-white/15" : "border-navy-950/15"
                )}
              >
                <dt className={cn("text-sm font-medium", light ? "text-white/80" : "text-navy-950")}>
                  {cat.name}
                </dt>
                <dd className={cn("font-mono text-xs tabular-nums", light ? "text-white/45" : "text-muted")}>
                  {countProductsInCategory(cat)} items
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Link
              href={`/${brand.id}`}
              className={cn(
                "group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                light ? "text-amber-300 hover:text-amber-200" : "text-navy-950 hover:text-amber-700"
              )}
            >
              Explore {brand.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RangeStrip() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Kicker>Selected ranges — 01–04</Kicker>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              From the <span className="font-serif font-medium italic text-amber-700">catalog</span>
            </h2>
          </div>
          <Link
            href="/vimar"
            className="group hidden items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-navy-950 sm:flex"
          >
            View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {RANGE_PICKS.map((product, i) => (
            <Link key={product.id} href={`/${brandOf(product).id}`} className="group block">
              <div className="relative aspect-square overflow-hidden border border-line bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <span className="absolute left-2.5 top-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white mix-blend-difference">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {product.sku} — {brandOf(product).name}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-navy-950 transition-colors group-hover:text-amber-700">
                {product.name}
              </h3>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-muted">
                {product.currency} {product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function brandOf(product: Product) {
  return brands.find((b) => getAllProducts(b).some((p) => p.id === product.id)) ?? brands[0];
}

function QuoteSteps() {
  const steps = [
    {
      n: "01",
      title: "Build your list",
      text: "Browse the catalog and tap “Add to quote” on everything you need — quantities are easy to adjust.",
    },
    {
      n: "02",
      title: "Send it over",
      text: "Deliver the list by WhatsApp, email, or copy it straight from the quote panel.",
    },
    {
      n: "03",
      title: "Get your price",
      text: "We reply with a clear, itemized quote — usually within 24 hours, project pricing on request.",
    },
  ];

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Kicker>How it works</Kicker>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              From list to quote in <span className="font-serif font-medium italic text-amber-700">three steps</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              No forms, no accounts — your quote starts the moment you tap
              “Add to quote”.
            </p>
          </div>

          <div className="lg:col-span-8">
            {steps.map((step) => (
              <div
                key={step.n}
                className="group grid gap-2 border-t border-line py-6 sm:grid-cols-12 sm:gap-6"
              >
                <span className="font-mono text-xs tabular-nums text-amber-700 sm:col-span-2">
                  {step.n}
                </span>
                <h3 className="text-lg font-bold text-navy-950 sm:col-span-4">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted sm:col-span-6">
                  {step.text}
                </p>
              </div>
            ))}
            <div className="border-t border-line pt-6">
              <Link
                href="/vimar"
                className="group inline-flex items-center gap-2 bg-navy-950 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-800"
              >
                Start building your list
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="bg-navy-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Kicker tone="light">KAHANA Electrical</Kicker>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Need a quote for <span className="font-serif font-medium italic text-amber-300">your project?</span>
          </h2>
          <p className="mt-5 max-w-lg text-white/60">
            Send us your product list and we&apos;ll come back with a clear,
            itemized quote — or browse the catalog and build it yourself.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {SHOWROOM_CONTACT.whatsappNumber && (
            <a
              href={`https://wa.me/${SHOWROOM_CONTACT.whatsappNumber}?text=${encodeURIComponent("Hello KAHANA Electrical, I'd like a quote.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25d366] px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          )}
          <Link
            href="/contact"
            className="border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Contact the showroom
          </Link>
          <Link
            href="/abb"
            className="px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
          >
            or browse ABB →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export default function Home() {
  const vimar = brands.find((b) => b.id === "vimar")!;
  const abb = brands.find((b) => b.id === "abb")!;

  return (
    <>
      <Hero />
      <CategoryStrip />
      <BrandRow brand={vimar} imageProduct={findProduct("vimar", "vimar-plana-socket-2p")} tone="cream" />
      <BrandRow brand={abb} imageProduct={findProduct("abb", "abb-range-impressivo")} tone="navy" />
      <RangeStrip />
      <QuoteSteps />
      <CtaBand />
    </>
  );
}