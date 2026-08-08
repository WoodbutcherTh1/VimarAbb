"use client";

export default function MountainScene({ accentColor }: { accentColor: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 h-[55vh] pointer-events-none" style={{ zIndex: -1, opacity: 0.15 }}>
      {/* horizon glow */}
      <div
        className="absolute inset-x-0 bottom-[38%] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
          boxShadow: `0 0 40px 4px ${accentColor}55`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 38%, ${accentColor}14, transparent 70%)`,
        }}
      />

      <svg
        viewBox="0 0 1600 500"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <polygon
          points="0,500 0,260 220,160 420,300 640,120 900,280 1120,140 1340,290 1600,180 1600,500"
          fill="#0a0a0f"
          opacity="0.55"
        />
        <polygon
          points="0,500 0,340 260,220 500,360 760,200 1020,360 1280,220 1600,340 1600,500"
          fill="#08080c"
          opacity="0.75"
        />
        <polygon
          points="0,500 0,420 300,340 620,440 950,320 1280,430 1600,360 1600,500"
          fill="#050507"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050507] to-transparent" />
    </div>
  );
}
