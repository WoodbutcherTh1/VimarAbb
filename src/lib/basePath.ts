// Static assets referenced by a raw "/..." string (as opposed to next/image
// or next/link, which handle this automatically) need the app's basePath
// prepended by hand. BASE_PATH comes from a generated literal (see
// scripts/generate-base-path.mjs) rather than NEXT_PUBLIC_ env inlining,
// which doesn't reliably reach re-hydrated client chunks in this build.
import { BASE_PATH } from "./basePath.generated";
export { BASE_PATH };

export function withBasePath<T>(value: T): T {
  if (typeof value === "string") {
    return (value.startsWith("/") ? `${BASE_PATH}${value}` : value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(withBasePath) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = withBasePath(val);
    }
    return out as T;
  }
  return value;
}
