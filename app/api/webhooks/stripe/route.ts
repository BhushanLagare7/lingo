/**
 * @file Stripe Webhook Handler
 * @description Handles incoming Stripe webhook events for subscription management.
 * This endpoint processes two main events:
 * 1. checkout.session.completed - Creates new subscription records
 * 2. invoice.payment_succeeded - Updates existing subscription records
 *
 * @requires STRIPE_WEBHOOK_SECRET - Environment variable for webhook signature verification
 */

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import Stripe from "stripe";

import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";

/**
 * POST handler for Stripe webhook events.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request object containing the Stripe webhook payload
 *
 * @returns {Promise<NextResponse>} Returns different responses based on the outcome:
 *   - 200: Event successfully processed
 *   - 400: Invalid webhook signature or missing required data
 *   - 500: Server configuration error (missing webhook secret)
 *
 * @throws Will return a 400 response if webhook signature verification fails
 *
 * @example
 * // Stripe will send POST requests to this endpoint with event payloads
 * // Example checkout.session.completed payload:
 * {
 *   "type": "checkout.session.completed",
 *   "data": {
 *     "object": {
 *       "subscription": "sub_xxx",
 *       "metadata": {
 *         "userId": "user_xxx"
 *       }
 *     }
 *   }
 * }
 */
export async function POST(req: Request) {
  // Extract raw request body for Stripe signature verification
  const body = await req.text();

  // Get request headers to extract Stripe signature
  const header = await headers();

  /**
   * Stripe signature from request headers
   * Used to verify the webhook payload authenticity
   * @type {string}
   */
  const signature = header.get("Stripe-Signature") as string;

  /** @type {Stripe.Event} Parsed and verified Stripe event object */
  let event: Stripe.Event;

  /**
   * Webhook secret from environment variables
   * Required for verifying Stripe webhook signatures
   * @type {string | undefined}
   */
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Ensure webhook secret is configured in the environment
  if (!webhookSecret) {
    return new NextResponse("Webhook secret is not defined", { status: 500 });
  }

  /**
   * Verify webhook signature and construct the Stripe event
   * This prevents processing of fraudulent or tampered webhook payloads
   */
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    /**
     * Return 400 if signature verification fails
     * This could happen if:
     * - The webhook secret is incorrect
     * - The payload has been tampered with
     * - The request is not from Stripe
     */
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  /**
   * Extract the session object from the event data
   * Cast to Stripe.Checkout.Session as we're handling checkout events
   * @type {Stripe.Checkout.Session}
   */
  const session = event.data.object as Stripe.Checkout.Session;

  /**
   * Handle successful checkout session completion
   * This event fires when a customer successfully completes the payment flow
   * Creates a new subscription record in the database
   */
  if (event.type === "checkout.session.completed") {
    // Retrieve full subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Ensure userId is present in session metadata
    // The userId should be set when creating the checkout session
    if (!session?.metadata?.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    /**
     * Create a new subscription record in the database
     * Stores all necessary Stripe subscription data for future reference
     * and subscription management
     */
    await db.insert(userSubscription).values({
      /** User ID from the checkout session metadata */
      userId: session.metadata.userId,

      /** Stripe subscription ID for future API calls */
      stripeSubscriptionId: subscription.id,

      /** Stripe customer ID for future API calls */
      stripeCustomerId: subscription.customer as string,

      /** Current price ID of the subscription */
      stripePriceId: subscription.items.data[0].price.id,

      /**
       * Convert Unix timestamp to JavaScript Date object
       * Stripe returns timestamps in seconds, Date requires milliseconds
       */
      stripeCurrentPeriodEnd: new Date(
        subscription.items.data[0].current_period_end * 1000,
      ),
    });
  }

  /**
   * Handle successful invoice payment
   * This event fires when a subscription renewal payment succeeds
   * Updates the existing subscription record with new period end date
   * and current price information
   */
  if (event.type === "invoice.payment_succeeded") {
    // Retrieve updated subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    /**
     * Update existing subscription record with latest information
     * This ensures our database stays in sync with Stripe's subscription data
     * after each successful renewal payment
     */
    await db
      .update(userSubscription)
      .set({
        /** Update price ID in case plan was changed during renewal */
        stripePriceId: subscription.items.data[0].price.id,

        /**
         * Update period end date to reflect new billing cycle
         * Convert Unix timestamp to JavaScript Date object
         */
        stripeCurrentPeriodEnd: new Date(
          subscription.items.data[0].current_period_end * 1000,
        ),
      })
      /** Match the subscription record using Stripe's subscription ID */
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id));
  }

  /**
   * Return 200 to acknowledge receipt of the webhook event
   * This prevents Stripe from retrying the webhook delivery
   */
  return new NextResponse(null, { status: 200 });
}
