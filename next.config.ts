import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-compress pages for faster production delivery
  compress: true,
  // Tree-shake large icon package — smaller JS bundles per page
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Allow product images from any HTTPS host (admin-uploaded URLs)
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
