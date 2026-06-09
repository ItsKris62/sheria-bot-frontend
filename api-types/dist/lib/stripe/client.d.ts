import Stripe from 'stripe';
/**
 * Stripe SDK singleton.
 *
 * Initialised once at startup using the STRIPE_SECRET_KEY env var.
 * Import this wherever you need to call Stripe APIs.
 *
 * @example
 *   import { stripe } from '@/lib/stripe/client';
 *   const session = await stripe.checkout.sessions.create({ ... });
 */
export declare const stripe: Stripe;
//# sourceMappingURL=client.d.ts.map