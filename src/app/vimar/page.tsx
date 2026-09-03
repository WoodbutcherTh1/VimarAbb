import type { Metadata } from "next";
import BrandShowroom from "@/components/BrandShowroom";

export const metadata: Metadata = {
  title: "Vimar Catalog",
  description:
    "Browse Vimar Italian design electrical solutions — Plana and Eikon switches, sockets, and smart home at KAHANA Electrical.",
};

export default function VimarPage() {
  return <BrandShowroom brandId="vimar" />;
}