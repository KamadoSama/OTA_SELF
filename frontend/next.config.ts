import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
    ];
  },
};

export default nextConfig;
