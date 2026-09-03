import type { NextConfig } from "next";
import { BASE_PATH as basePath } from "./src/lib/basePath.generated";

// Serves the static export under /VimarAbb/ when built for GitHub Pages,
// since project pages are hosted at <user>.github.io/<repo>/.
// basePath.generated.ts is (re)written by scripts/generate-base-path.mjs
// before every build — see src/lib/basePath.ts for why.

const nextConfig: NextConfig = {
  output: 'export',
  // Emit vimar/index.html instead of vimar.html so GitHub Pages resolves
  // both /vimar and /vimar/ without a 404.
  trailingSlash: true,
  distDir: 'dist',
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  // The Freebuff preview is served through a *.daytonaproxy01.net proxy;
  // allow that origin to reach dev-only assets (HMR) during development.
  allowedDevOrigins: ['*.daytonaproxy01.net'],
};

export default nextConfig;
