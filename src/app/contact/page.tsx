import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { SHOWROOM_CONTACT } from "@/lib/showroomConfig";
import { brands } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Quotes",
  description:
    "Get in touch with KAHANA Electrical for quotes, product questions, and project support.",
};

export default function ContactPage() {
  const channels = [
    SHOWROOM_CONTACT.whatsappNumber && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us directly",
      href: `https://wa.me/${SHOWROOM_CONTACT.whatsappNumber}?text=${encodeURIComponent("Hello KAHANA Electrical, I'd like a quote.")}`,
      external: true,
      accent: "#25d366",
    },
    SHOWROOM_CONTACT.phone && {
      icon: Phone,
      label: "Phone",
      value: SHOWROOM_CONTACT.phone,
      href: `tel:${SHOWROOM_CONTACT.phone.replace(/[^+\d]/g, "")}`,
      external: false,
      accent: "#1d4ed8",
    },
    SHOWROOM_CONTACT.email && {
      icon: Mail,
      label: "Email",
      value: SHOWROOM_CONTACT.email,
      href: `mailto:${SHOWROOM_CONTACT.email}?subject=${encodeURIComponent("Quote request")}`,
      external: false,
      accent: "#1d4ed8",
    },
    SHOWROOM_CONTACT.address && {
      icon: MapPin,
      label: "Showroom",
      value: SHOWROOM_CONTACT.address,
      href: undefined,
      external: false,
      accent: "#1d4ed8",
    },
    SHOWROOM_CONTACT.hours && {
      icon: Clock,
      label: "Hours",
      value: SHOWROOM_CONTACT.hours,
      href: undefined,
      external: false,
      accent: "#1d4ed8",
    },
  ].filter(Boolean) as {
    icon: typeof MessageCircle;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    accent: string;
  }[];

  const anyContact = channels.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Contact
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Quotes & project support
        </h1>
        <p className="mt-4 leading-relaxed text-white/60">
          Send us your product list and we&apos;ll come back with a clear,
          itemized quote. You can also build your list in the catalog and send
          it straight from the quote panel.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {anyContact ? (
          channels.map((channel) => {
            const inner = (
              <>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: channel.accent }}
                >
                  <channel.icon className="h-5 w-5" />
                </span>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">
                    {channel.label}
                  </p>
                  <p className="mt-1 font-semibold text-navy-900">{channel.value}</p>
                </div>
              </>
            );
            const card = (
              <div className="card-lift flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm">
                {inner}
              </div>
            );
            return channel.href ? (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block h-full"
              >
                {card}
              </a>
            ) : (
              <div key={channel.label} className="h-full">
                {card}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-white/60">
            Contact details are being set up — meanwhile, browse the catalog and
            use the quote panel.
          </p>
        )}
      </div>

      <div className="mt-14 rounded-2xl border border-line bg-white p-7 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-navy-900">Browse first, ask later</h2>
        <p className="mt-1.5 text-sm text-muted">
          Explore the full catalog for each brand, then add products to a quote
          and send it in one tap.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.id}`}
              className="group flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Explore {brand.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}