import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev', // Allow Cloudflare R2 domains
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Keep AWS just in case
      }
    ],
  },
};

export default nextConfig;