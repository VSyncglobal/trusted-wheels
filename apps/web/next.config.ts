import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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