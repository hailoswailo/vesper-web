import Stripe from 'stripe';

let cached: Stripe | null = null;

/**
 * Lazily constructed — a top-level `new Stripe(...)` throws immediately if
 * STRIPE_SECRET_KEY is unset, which crashes Next's build-time route
 * introspection even for routes that are never actually invoked yet.
 */
export function getStripe(): Stripe {
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return cached;
}
