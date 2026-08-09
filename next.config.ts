import type { NextConfig } from "next";
import { BASE_PATH as basePath } from "./src/lib/basePath.generated";

// Serves the static export under /VimarAbb/ when built for GitHub Pages,
// since project pages are hosted at <user>.github.io/<repo>/.
// basePath.generated.ts is (re)written by scripts/generate-base-path.mjs
// before every build — see src/lib/basePath.ts for why.

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
