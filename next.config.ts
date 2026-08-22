import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without this, Turbopack walks up looking for a workspace root and finds
  // a stray package-lock.json outside this repo, which just produces a
  // harmless but noisy warning on every build.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
