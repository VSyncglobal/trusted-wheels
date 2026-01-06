import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    // These settings will be ignored while unoptimized is true, 
    // but we keep them in case you upgrade your plan later.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev', // Cloudflare R2
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // AWS S3
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash (For Hero Slider)
      }
    ],
  },
};

export default nextConfig;