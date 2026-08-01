"use client";

// Add "vimar": "/videos/vimar-background.mp4" once that clip is generated.
const BRAND_VIDEOS: Record<string, string> = {
  abb: "/videos/abb-background.mp4",
};

export default function BrandBackgroundVideo({ brandId }: { brandId: string }) {
  const src = BRAND_VIDEOS[brandId];
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video
        key={src}
        className="w-full h-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/70 to-[#0a0a0f]/90" />
    </div>
  );
}
