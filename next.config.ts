import type { NextConfig } from "next";

/**
 * @file next.config.ts
 * @description Next.js configuration for the Lingo application.
 * Configures HTTP headers for API routes to allow cross-origin requests.
 */

/**
 * Next.js configuration object
 * Configures HTTP headers for API routes to allow cross-origin requests
 */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            // Wildcard allowed for public API; use environment-configured origin (e.g., process.env.ALLOWED_ORIGINS) for production
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Range",
            value: "bytes : 0-9/*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
