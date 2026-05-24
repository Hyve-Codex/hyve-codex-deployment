/**
 * STRIPE SETUP INSTRUCTIONS
 * ─────────────────────────────────────────────────────────────
 * 1. Go to Stripe Dashboard → Products → Add Product
 * 2. Name: "Hyve Codex — Full Access"
 * 3. Add a recurring monthly price: $47.00 USD / month
 * 4. Do NOT set a trial period in Stripe — the 14-day trial is
 *    managed by the app, not Stripe.
 * 5. Copy the Price ID (starts with price_...) and paste it into
 *    .env.local as STRIPE_PRICE_ID
 * ─────────────────────────────────────────────────────────────
 */

export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID!,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/account?upgraded=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
}
