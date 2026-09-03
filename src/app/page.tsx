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

const VIMAR_IMAGE = findProduct("vimar", "vimar-plana-socket-2p");
const ABB_IMAGE = findProduct("abb", "abb-range-impressivo");

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function Kicker({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "light";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em]",
        tone === "muted" ? "text-muted" : "text-white/50"
      )}
    >
      <span className={cn("h-1.5 w-1.5", tone === "muted" ? "bg-amber-400" : "bg-red-500")} />
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

/** Neutral hero — no brand imagery mixed here, just KAHANA + search + the two doors. */
function Hero() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20">
        <Kicker>KAHANA Electrical — authorized showroom</Kicker>

        <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-navy-950 sm:text-6xl">
          Premium electrical products,
          <br />
          from <span className="font-serif font-medium italic text-amber-700">two great houses.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Vimar&apos;s Italian design and ABB&apos;s engineered precision —
          each with its own catalog, its own collections, and its own experts.
          No mixing.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/vimar"
            className="flex items-center gap-2 bg-amber-700 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-amber-800"
          >
            Explore Vimar <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/abb"
            className="flex items-center gap-2 bg-red-700 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-800"
          >
            Explore ABB <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 border-b border-navy-950/20 pb-0.5 text-sm font-semibold text-navy-950 transition-colors hover:border-amber-600 hover:text-amber-700"
          >
            Request a quote <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-9 w-full max-w-xl">
          <CatalogSearch />
        </div>

        <p className="mt-9 border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {TOTAL_PRODUCTS} products · {TOTAL_CATEGORIES} collections · quotes within 24h
        </p>
      </div>
    </section>
  );
}

/** The two houses, side by side — Vimar keeps to Vimar, ABB keeps to ABB. */
function BrandSplit() {
  const vimar = brands.find((b) => b.id === "vimar")!;
  const abb = brands.find((b) => b.id === "abb")!;

  return (
    <section className="border-b border-line">
      <div className="grid lg:grid-cols-2">
        {/* ============ VIMAR ============ */}
        <div className="border-b border-line bg-[#faf6ec] lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-xl px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
            <Kicker>House 01 — Italian design</Kicker>
            <h2 className="mt-4 text-5xl font-extrabold tracking-tight text-navy-950 sm:text-6xl">
              Vimar
            </h2>
            <p className="mt-2 font-serif text-xl italic text-amber-700">{vimar.tagline}</p>

            {VIMAR_IMAGE && (
              <figure className="relative mt-8">
                <div className="relative aspect-[4/3] overflow-hidden border border-navy-950/10 bg-slate-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${VIMAR_IMAGE.image})` }}
                  />
                  <CornerTicks color="border-amber-600/60" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <span>{VIMAR_IMAGE.sku}</span>
                  <span className="text-navy-950">{VIMAR_IMAGE.name}</span>
                </figcaption>
              </figure>
            )}

            <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-navy-950/50">
              Vimar collections
            </h3>
            <dl className="mt-3 border-t border-navy-950/15">
              {vimar.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href="/vimar"
                  className="group flex items-baseline justify-between gap-4 border-b border-navy-950/15 py-3 transition-colors"
                >
                  <dt className="text-sm font-medium text-navy-950 transition-colors group-hover:text-amber-700">
                    {cat.name}
                  </dt>
                  <dd className="flex items-center gap-2 font-mono text-xs tabular-nums text-muted">
                    {countProductsInCategory(cat)} items
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </dd>
                </Link>
              ))}
            </dl>

            <Link
              href="/vimar"
              className="mt-8 inline-flex items-center gap-2 bg-amber-700 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-amber-800"
            >
              Enter the Vimar catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ============ ABB ============ */}
        <div className="bg-navy-950 text-white">
          <div className="mx-auto max-w-xl px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
            <Kicker tone="light">House 02 — engineered precision</Kicker>
            <h2 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
              ABB
            </h2>
            <p className="mt-2 font-serif text-xl italic text-red-400">{abb.tagline}</p>

            {ABB_IMAGE && (
              <figure className="relative mt-8">
                <div className="relative aspect-[4/3] overflow-hidden border border-white/15 bg-slate-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ABB_IMAGE.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                  <CornerTicks color="border-red-400/70" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                  <span>{ABB_IMAGE.sku}</span>
                  <span className="text-white/90">{ABB_IMAGE.name}</span>
                </figcaption>
              </figure>
            )}

            <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-white/50">
              ABB collections
            </h3>
            <dl className="mt-3 border-t border-white/15">
              {abb.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href="/abb"
                  className="group flex items-baseline justify-between gap-4 border-b border-white/15 py-3 transition-colors"
                >
                  <dt className="text-sm font-medium text-white/85 transition-colors group-hover:text-red-400">
                    {cat.name}
                  </dt>
                  <dd className="flex items-center gap-2 font-mono text-xs tabular-nums text-white/45">
                    {countProductsInCategory(cat)} items
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </dd>
                </Link>
              ))}
            </dl>

            <Link
              href="/abb"
              className="mt-8 inline-flex items-center gap-2 bg-red-700 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-800"
            >
              Enter the ABB catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSteps() {
  const steps = [
    {
      n: "01",
      title: "Build your list",
      text: "Browse one catalog — Vimar or ABB — and tap “Add to quote” on everything you need.",
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
                className="grid gap-2 border-t border-line py-6 sm:grid-cols-12 sm:gap-6"
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
            Tell us which brand you need — Vimar or ABB — and we&apos;ll come
            back with a clear, itemized quote.
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
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <>
      <Hero />
      <BrandSplit />
      <QuoteSteps />
      <CtaBand />
    </>
  );
}