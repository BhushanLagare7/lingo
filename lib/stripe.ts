import Stripe from "stripe";

const stripeClient = process.env.STRIPE_API_KEY;

if (!stripeClient) {
  throw new Error("Please provide your stripe api key");
}

export const stripe = new Stripe(stripeClient, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});
