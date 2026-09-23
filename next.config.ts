import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local network load the dev server (dev only).
  allowedDevOrigins: ["192.168.1.*"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The standalone /approach page was removed (Sep 2026); it was indexed, so
  // send old links to the process section on the homepage.
  async redirects() {
    return [{ source: "/approach", destination: "/#how-we-do-it", permanent: true }];
  },
};

export default nextConfig;
