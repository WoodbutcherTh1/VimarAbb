"use client";

import { withBasePath } from "@/lib/basePath";

// The landing currently borrows ABB's clip as a stand-in — drop a
// neutral showroom video at public/videos/landing-background.mp4 (and a
// "vimar": "/videos/vimar-background.mp4") to give each its own.
const BRAND_VIDEOS: Record<string, string> = withBasePath({
  abb: "/videos/abb-background.mp4",
  landing: "/videos/abb-background.mp4",
});

interface BrandBackgroundVideoProps {
  brandId: string;
  /** Layer depth. The landing sits below its mountain range (z -1). */
  zIndex?: number;
  /** Higher on the landing, where the video is the backdrop rather than an accent. */
  opacityClass?: string;
}

export default function BrandBackgroundVideo({
  brandId,
  zIndex = 0,
  opacityClass = "opacity-40",
}: BrandBackgroundVideoProps) {
  const src = BRAND_VIDEOS[brandId];
  if (!src) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex }}>
      <video
        key={src}
        className={`w-full h-full object-cover ${opacityClass}`}
        autoPlay
        muted
        loop
        playsInline
        // "none" left the landing on a black frame until the clip was needed;
        // it is the backdrop there, so it has to be ready on arrival.
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/70 to-[#0a0a0f]/90" />
    </div>
  );
}
