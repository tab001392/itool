import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore all TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore all ESLint errors
  },
};

export default nextConfig;
