import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return stripeInstance;
}

export async function createCheckoutSession(params: {
  customerId?: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeServer();

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId || undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { userId: params.userId },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const stripe = getStripeServer();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
