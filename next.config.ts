import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "cdn.marvel.com",
        pathname: "/**",
      },
    ],
  },
  // devIndicators: {
  //   position: "top-right",
  // },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
