import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
