"use client";

import WarehouseCanvas from "@/components/warehouse/WarehouseCanvas";
import Actor from "@/components/warehouse/Actor";

// Rides the traced coaster-track path via CSS motion path on the wrapping
// foreignObject (shares the parent SVG's viewBox coordinate space, so it
// stays aligned with the track drawn into the background photo).
export default function CoasterRider({ pathD, durationS, delayS = 0 }: { pathD: string; durationS: number; delayS?: number }) {
  return (
    <foreignObject
      width={150}
      height={150}
      style={{
        offsetPath: `path('${pathD}')`,
        offsetRotate: "0deg",
        animation: `ride-track ${durationS}s linear infinite`,
        animationDelay: `${delayS}s`,
        overflow: "visible",
      }}
    >
      <div style={{ width: 150, height: 150, position: "relative", transform: "translate(-50%, -75%)" }}>
        <WarehouseCanvas cameraY={0.55} cameraZ={1.7} fov={32} lightBoost={2.2}>
          <Actor
            url="/models/forklift-transpallet.glb"
            fromX={0}
            toX={0}
            y={-0.1}
            z={0}
            scale={0.0376}
            rotationY={Math.PI / 3}
            durationMs={1}
            bob
          />
        </WarehouseCanvas>
      </div>
    </foreignObject>
  );
}
