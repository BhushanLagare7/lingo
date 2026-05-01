/**
 * @file next.config.ts
 * @description Next.js configuration for the Lingo application.
 * Configures HTTP headers for API routes to allow cross-origin requests.
 */

/**
 * Type definition for Next.js configuration
 * @typedef {import('next').NextConfig} NextConfigType
 */

/**
 * Next.js configuration object
 * Configures HTTP headers for API routes to allow cross-origin requests
 * @type {NextConfigType}
 *
 * @example
 * // Example of how to configure headers in next.config.ts:
 * // module.exports = {
 * //   async headers() {
 * //     return [
 * //       {
 * //         source: "/api/(.*)",
 * //         headers: [
 * //           {
 * //             key: "Access-Control-Allow-Origin",
 * //             value: "*",
 * //           },
 * //           {
 * //             key: "Access-Control-Allow-Methods",
 * //             value: "GET, POST, PUT, DELETE, OPTIONS",
 * //           },
 * //           {
 * //             key: "Access-Control-Allow-Headers",
 * //             value: "Content-Type, Authorization",
 * //           },
 * //           {
 * //             key: "Content-Range",
 * //             value: "bytes : 0-9/*",
 * //           },
 * //         ],
 * //       },
 * //     ];
 * //   },
 * // };
 */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
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
