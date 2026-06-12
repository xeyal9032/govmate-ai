/** Stripe webhook yardımcıları — test edilebilir saf fonksiyonlar */

export function resolvePlanFromPriceId(priceId: string | undefined): 'pro' | 'business' {
  if (priceId && priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) {
    return 'business';
  }
  return 'pro';
}

export function stripeUnixToIso(timestamp: number | undefined | null): string | null {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString();
}

export function extractStripeCustomerId(
  customer: string | { id?: string } | null | undefined
): string | undefined {
  if (!customer) return undefined;
  if (typeof customer === 'string') return customer;
  return customer.id;
}

export function mapSubscriptionStatus(stripeStatus: string): 'active' | 'past_due' {
  return stripeStatus === 'active' ? 'active' : 'past_due';
}

/** Stripe SDK sürüm farkları için dönem alanlarını güvenli okur */
export function extractSubscriptionPeriod(subscription: {
  current_period_start?: number;
  current_period_end?: number;
  items?: { data?: Array<{ current_period_start?: number; current_period_end?: number }> };
}): { start: number | undefined; end: number | undefined } {
  const item = subscription.items?.data?.[0];
  return {
    start: subscription.current_period_start ?? item?.current_period_start,
    end: subscription.current_period_end ?? item?.current_period_end,
  };
}
