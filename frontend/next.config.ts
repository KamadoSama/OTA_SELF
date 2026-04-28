import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/auth/register",
        destination: `${backendUrl}/api/auth/register`,
      },
      {
        source: "/api/auth/setup/status",
        destination: `${backendUrl}/api/auth/setup/status`,
      },
      {
        // Proxy all /api/* EXCEPT /api/auth/* (handled by NextAuth)
        source: "/api/:path((?!auth).*)",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
