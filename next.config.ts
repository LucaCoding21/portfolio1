import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local network load the dev server (dev only).
  allowedDevOrigins: ["192.168.0.*", "192.168.1.*", "10.0.0.*"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Ship the stylesheet inside the HTML: the first paint no longer waits on
  // a separate CSS request (about 30KB compressed, so the trade is cheap).
  experimental: {
    inlineCss: true,
  },
  // PostHog's endpoints end in a slash (/ingest/e/); without this Next would
  // redirect them away from the slash before the rewrite below.
  skipTrailingSlashRedirect: true,
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
  // PostHog through our own domain (instrumentation-client.ts), so ad
  // blockers that block posthog.com don't drop the events.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  async redirects() {
    return [
      { source: "/approach", destination: "/#how-we-do-it", permanent: true },
      // The service page was folded back into the homepage.
      { source: "/web-design-surrey", destination: "/", permanent: true },
      // A link pasted at the end of a sentence picks up its punctuation
      // ("cloverfield.studio/free-homepage-design.") and 404s; drop it.
      { source: "/:path(.*[^.,;:!\\)]):end([.,;:!\\)]+)", destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
