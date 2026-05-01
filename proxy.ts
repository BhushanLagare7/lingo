import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * @file proxy.ts
 * @description Clerk authentication middleware for Next.js application.
 * This file configures authentication for protected routes and exempts public routes.
 */

/**
 * Create a matcher for routes that should not be protected.
 * This means that if a user is not authenticated and is on a public route,
 * they will be redirected to the sign-in page.
 * @type {import("@clerk/nextjs/server").RouteMatcher} - Route matcher function
 * @param {string[]} - Array of public route patterns
 */
const isPublicRoute = createRouteMatcher(["/api/webhooks/stripe"]);

/**
 * Main authentication middleware function
 * This function is executed for every request and handles authentication logic
 * @param {import("@clerk/nextjs/server").Auth} auth - Clerk authentication object
 * @param {import("next/server").NextRequest} request - Next.js request object
 * @returns {Promise<void>} - Async function that performs authentication
 *
 * @example
 * // This middleware runs on every request
 * // If the request is to a public route, it skips authentication
 * // If the request is to a protected route, it requires authentication
 *
 * @example
 * // Public routes (no authentication required):
 * // - /api/webhooks/stripe
 * // - All static files
 * // - Next.js internals
 *
 * @example
 * // Protected routes (authentication required):
 * // - All other routes
 * // - User must be authenticated to access these routes
 * // - Unauthenticated users will be redirected to sign-in page
 */
export default clerkMiddleware(async (auth, request) => {
  // If the user is not authenticated and is not on a public route, protect the route.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

/**
 * Configuration for the middleware
 * Defines which routes the middleware should run on
 * @type {object}
 * @property {string[]} matcher - Array of route patterns to match
 *   - Skip Next.js internals and static files
 *   - Always run for API routes
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
