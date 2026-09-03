import type { Metadata } from "next";
import BrandShowroom from "@/components/BrandShowroom";

export const metadata: Metadata = {
  title: "ABB Catalog",
  description:
    "Browse ABB engineered electrical solutions — Busch-Jaeger ranges, circuit protection, enclosures, and low-voltage products at KAHANA Electrical.",
};

export default function AbbPage() {
  return <BrandShowroom brandId="abb" />;
}