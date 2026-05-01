/**
 * @file admin.ts
 * @description Provides administrative access control utilities for the application.
 * This module contains helper functions to determine if a user has admin privileges.
 */

import { auth } from "@clerk/nextjs/server";

/**
 * Admin user ID from environment variables
 * Users with this ID will have administrative access
 * @type {string | undefined}
 */
const adminUserId = process.env.ADMIN_USER_ID;

/**
 * Ensure admin user ID is configured
 * Throws an error if ADMIN_USER_ID is not set in the environment
 */
if (!adminUserId) {
  throw new Error("Please set ADMIN_USER_ID environment variable.");
}

/**
 * Check if the current user has admin privileges
 * Verifies the authenticated user's ID against the configured admin user ID
 *
 * @async
 * @function isAdmin
 * @returns {Promise<boolean>} Returns true if the current user is an admin, false otherwise
 *
 * @throws Will throw an error if ADMIN_USER_ID environment variable is not set
 *
 * @example
 * // Check for admin access
 * const userIsAdmin = await isAdmin();
 *
 * if (userIsAdmin) {
 *   // Show admin-only content
 *   console.log("Welcome, Admin!");
 * } else {
 *   // Show regular user content
 *   console.log("Welcome, User!");
 * }
 */
export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return userId === adminUserId;
};
