import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local network load the dev server (dev only).
  allowedDevOrigins: ["192.168.1.*"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Ship the stylesheet inside the HTML: the first paint no longer waits on
  // a separate CSS request (about 30KB compressed, so the trade is cheap).
  experimental: {
    inlineCss: true,
  },
  // The standalone /approach page was removed (Sep 2026); it was indexed, so
  // send old links to the process section on the homepage.
  // The Caddie case study's 3D model, decoder and stills rarely change; let
  // browsers and the CDN keep them for a month instead of revalidating.
  async headers() {
    return [
      {
        source: "/caddie/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
  async redirects() {
    return [{ source: "/approach", destination: "/#how-we-do-it", permanent: true }];
  },
};

export default nextConfig;
