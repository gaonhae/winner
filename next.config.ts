import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_DOMAIN || "**.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
