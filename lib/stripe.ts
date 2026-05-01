/**
 * @file stripe.ts
 * @description Stripe client initialization for server-side operations.
 * This module provides the Stripe API client instance used for all
 * payment processing, subscription management, and Stripe API interactions.
 */

import Stripe from "stripe";

/**
 * Stripe API key from environment variables
 * Required for authenticating with the Stripe API
 * @type {string | undefined}
 */
const stripeClient = process.env.STRIPE_API_KEY;

/**
 * Ensure Stripe API key is configured
 * Throws an error if STRIPE_API_KEY is not set in the environment
 */
if (!stripeClient) {
  throw new Error("Please provide your stripe api key");
}

/**
 * Stripe API client instance
 * Fully configured with API version and TypeScript support
 * Used for all server-side Stripe operations
 * @type {Stripe} - Initialized Stripe client instance
 *
 * @example
 * // Create a new Stripe customer
 * const customer = await stripe.customers.create({
 *   email: [EMAIL_ADDRESS]",
 * });
 *
 * @example
 * // Create a checkout session
 * const session = await stripe.checkout.sessions.create({
 *   payment_method_types: ["card"],
 *   line_items: [
 *     {
 *       price_data: {
 *         currency: "usd",
 *         product_data: {
 *           name: "Premium Subscription",
 *         },
 *         unit_amount: 999,
 *       },
 *       quantity: 1,
 *     },
 *   ],
 *   mode: "subscription",
 *   success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
 *   cancel_url: "http://localhost:3000/cancel",
 * });
 */
export const stripe = new Stripe(stripeClient, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});
