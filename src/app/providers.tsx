"use client";

import { QuoteProvider } from "@/lib/quote";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuotePanel from "@/components/QuotePanel";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QuoteProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <QuotePanel />
      <WhatsAppFloat />
    </QuoteProvider>
  );
}