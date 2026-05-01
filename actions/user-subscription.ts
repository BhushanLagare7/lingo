"use server";

/**
 * @file user-subscription.ts
 * @description Server-side action for handling Stripe payment and subscription management.
 * This module provides functionality to create Stripe checkout sessions for new subscribers
 * and billing portal sessions for existing subscribers.
 */

import { auth, currentUser } from "@clerk/nextjs/server";

import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

/**
 * The URL to redirect users to after completing Stripe-related actions.
 * Points to the application's shop page using an absolute URL.
 * @constant {string}
 */
const returnUrl = absoluteUrl("/shop");

/**
 * Creates a Stripe URL for either subscription checkout or billing portal management.
 *
 * @async
 * @function createStripeUrl
 *
 * @description
 * This server action handles two distinct scenarios:
 *
 * 1. **Existing Subscribers**: If the user already has a Stripe customer ID,
 *    they are redirected to the Stripe Billing Portal where they can manage
 *    their subscription (upgrade, downgrade, or cancel).
 *
 * 2. **New Subscribers**: If the user does not have an existing subscription,
 *    a new Stripe Checkout Session is created for the "Lingo Pro" subscription
 *    plan at $20.00/month.
 *
 * @throws {Error} Throws an "Unauthorized" error if:
 *   - The user is not authenticated (no userId found)
 *   - The current user data cannot be retrieved
 *
 * @returns {Promise<{ data: string | null }>} An object containing the Stripe
 *   session URL that the client should redirect to:
 *   - Billing portal URL for existing subscribers
 *   - Checkout session URL for new subscribers
 *
 * @example
 * // Usage in a React Server Component or Client Component
 * const { data: stripeUrl } = await createStripeUrl();
 * if (stripeUrl) {
 *   window.location.href = stripeUrl; // Redirect to Stripe
 * }
 */
export const createStripeUrl = async () => {
  // Retrieve the authenticated user's ID using Clerk authentication
  const { userId } = await auth();

  // Retrieve the full user object from Clerk
  const user = await currentUser();

  // Ensure the user is authenticated before proceeding
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch the user's current subscription details from the database
  const userSubscription = await getUserSubscription();

  /**
   * Handle existing subscribers:
   * If the user has an active subscription with a Stripe customer ID,
   * create a billing portal session for subscription management.
   */
  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      // Link to the existing Stripe customer account
      customer: userSubscription.stripeCustomerId,
      // Redirect back to the shop page after portal interaction
      return_url: returnUrl,
    });

    return { data: stripeSession.url };
  }

  /**
   * Handle new subscribers:
   * Create a Stripe Checkout Session for the Lingo Pro monthly subscription.
   * The session is pre-filled with the user's email and tagged with their
   * userId in metadata for webhook processing after payment completion.
   */
  const stripeSession = await stripe.checkout.sessions.create({
    // Set to subscription mode for recurring billing
    mode: "subscription",

    // Accept card payments only
    payment_method_types: ["card"],

    // Pre-fill the checkout form with the user's primary email address
    customer_email: user.emailAddresses[0].emailAddress,

    // Define the subscription plan details
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited Hearts",
          },
          // Price in cents: 2000 = $20.00 USD
          unit_amount: 2000,
          recurring: {
            // Billing cycle set to monthly
            interval: "month",
          },
        },
      },
    ],

    /**
     * Store the userId in metadata so it can be retrieved
     * in the Stripe webhook to update the database after
     * successful payment.
     */
    metadata: {
      userId,
    },

    // Redirect to the shop page on both success and cancellation
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
