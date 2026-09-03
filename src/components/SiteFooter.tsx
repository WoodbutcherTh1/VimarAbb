"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import Logo from "@/components/Logo";
import { brands } from "@/lib/data";
import { SHOWROOM_CONTACT } from "@/lib/showroomConfig";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {SHOWROOM_CONTACT.about}
            </p>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
              Brands
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    href={`/${brand.id}`}
                    className="transition-colors hover:text-white"
                  >
                    {brand.name}
                    <span className="ml-2 text-white/35">{brand.tagline}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact &amp; quotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {brands.map((brand) =>
                brand.categories.map((cat) => (
                  <li key={`${brand.id}-${cat.id}`}>
                    <Link
                      href={`/${brand.id}`}
                      className="transition-colors hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {SHOWROOM_CONTACT.phone && (
                <li>
                  <a
                    href={`tel:${SHOWROOM_CONTACT.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <PhoneIcon /> {SHOWROOM_CONTACT.phone}
                  </a>
                </li>
              )}
              {SHOWROOM_CONTACT.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${SHOWROOM_CONTACT.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-white/40" />
                    WhatsApp us
                  </a>
                </li>
              )}
              {SHOWROOM_CONTACT.email && (
                <li>
                  <a
                    href={`mailto:${SHOWROOM_CONTACT.email}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-white/40" />
                    {SHOWROOM_CONTACT.email}
                  </a>
                </li>
              )}
              {SHOWROOM_CONTACT.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                  {SHOWROOM_CONTACT.address}
                </li>
              )}
              {SHOWROOM_CONTACT.hours && (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                  {SHOWROOM_CONTACT.hours}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6">
          <p>© {year} KAHANA Electrical. All rights reserved.</p>
          <p>Authorized showroom for Vimar &amp; ABB products</p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/40" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 15v4a1.5 1.5 0 0 1-1.6 1.5C9.9 20 4 14.1 3.5 5.6A1.5 1.5 0 0 1 5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}