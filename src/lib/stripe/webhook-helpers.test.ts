import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  extractStripeCustomerId,
  extractSubscriptionPeriod,
  mapSubscriptionStatus,
  resolvePlanFromPriceId,
  stripeUnixToIso,
} from '@/lib/stripe/webhook-helpers';

describe('resolvePlanFromPriceId', () => {
  const originalBusiness = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;

  beforeEach(() => {
    process.env.STRIPE_PRICE_BUSINESS_MONTHLY = 'price_business_123';
  });

  afterEach(() => {
    process.env.STRIPE_PRICE_BUSINESS_MONTHLY = originalBusiness;
  });

  it('business price id için business döner', () => {
    expect(resolvePlanFromPriceId('price_business_123')).toBe('business');
  });

  it('bilinmeyen price id için pro döner', () => {
    expect(resolvePlanFromPriceId('price_pro_123')).toBe('pro');
  });

  it('price id yoksa pro döner', () => {
    expect(resolvePlanFromPriceId(undefined)).toBe('pro');
  });
});

describe('stripeUnixToIso', () => {
  it('unix timestamp ISO stringe çevirir', () => {
    expect(stripeUnixToIso(1_700_000_000)).toBe('2023-11-14T22:13:20.000Z');
  });

  it('null/undefined için null döner', () => {
    expect(stripeUnixToIso(undefined)).toBeNull();
    expect(stripeUnixToIso(null)).toBeNull();
  });
});

describe('extractStripeCustomerId', () => {
  it('string customer id döner', () => {
    expect(extractStripeCustomerId('cus_abc')).toBe('cus_abc');
  });

  it('object customer id döner', () => {
    expect(extractStripeCustomerId({ id: 'cus_obj' })).toBe('cus_obj');
  });

  it('boş değerler için undefined', () => {
    expect(extractStripeCustomerId(null)).toBeUndefined();
    expect(extractStripeCustomerId(undefined)).toBeUndefined();
  });
});

describe('mapSubscriptionStatus', () => {
  it('active stripe status active döner', () => {
    expect(mapSubscriptionStatus('active')).toBe('active');
  });

  it('diğer statuslar past_due döner', () => {
    expect(mapSubscriptionStatus('past_due')).toBe('past_due');
    expect(mapSubscriptionStatus('canceled')).toBe('past_due');
  });
});

describe('extractSubscriptionPeriod', () => {
  it('subscription kök alanlarından okur', () => {
    expect(
      extractSubscriptionPeriod({
        current_period_start: 100,
        current_period_end: 200,
      })
    ).toEqual({ start: 100, end: 200 });
  });

  it('item alanlarına fallback yapar', () => {
    expect(
      extractSubscriptionPeriod({
        items: { data: [{ current_period_start: 300, current_period_end: 400 }] },
      })
    ).toEqual({ start: 300, end: 400 });
  });
});
