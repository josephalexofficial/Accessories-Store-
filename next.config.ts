import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-compress pages for faster production delivery
  compress: true,
  // Tree-shake large icon package — smaller JS bundles per page
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // Prefer modern formats (AVIF first, then WebP)
    formats: ["image/avif", "image/webp"],
    // Product photos rarely change — keep optimized variants warm longer
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // Allow card (60) + default (75) qualities used by ProductImage
    qualities: [60, 75],
    // Widths suited to product cards, thumbs, and detail hero
    imageSizes: [48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "**.utfs.io" },
      { protocol: "https", hostname: "ufs.sh" },
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "**.uploadthing.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.imgix.net" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
