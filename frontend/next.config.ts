import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL ;
    return [
      {
        // Backend registration (not a NextAuth route)
        source: "/api/auth/register",
        destination: `${backendUrl}/api/auth/register`,
      },
      {
        // Proxy all /api/* EXCEPT /api/auth/* (handled by NextAuth)
        source: "/api/:path((?!auth).*)",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
