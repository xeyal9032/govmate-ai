import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';
import {
  extractStripeCustomerId,
  extractSubscriptionPeriod,
  mapSubscriptionStatus,
  resolvePlanFromPriceId,
  stripeUnixToIso,
} from '@/lib/stripe/webhook-helpers';

export async function handleStripeWebhook(event: Stripe.Event) {
  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const stripe = getStripeServer();
      const subResponse = await stripe.subscriptions.retrieve(session.subscription as string);
      const sub = subResponse as Stripe.Subscription;
      const { start, end } = extractSubscriptionPeriod(sub);

      const priceId = sub.items?.data?.[0]?.price?.id;
      const plan = resolvePlanFromPriceId(priceId);

      const periodStart = stripeUnixToIso(start) ?? new Date().toISOString();
      const periodEnd = stripeUnixToIso(end);

      await supabase
        .from('subscriptions')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan,
          status: 'active',
          current_period_start: periodStart,
          current_period_end: periodEnd,
        })
        .eq('user_id', userId);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = extractStripeCustomerId(subscription.customer);
      if (!customerId) break;

      const { start, end } = extractSubscriptionPeriod(subscription);

      await supabase
        .from('subscriptions')
        .update({
          status: mapSubscriptionStatus(subscription.status),
          current_period_start: stripeUnixToIso(start),
          current_period_end: stripeUnixToIso(end),
          cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = extractStripeCustomerId(subscription.customer);
      if (!customerId) break;

      await supabase
        .from('subscriptions')
        .update({
          plan: 'free',
          status: 'canceled',
          stripe_subscription_id: null,
          cancel_at_period_end: false,
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = extractStripeCustomerId(invoice.customer);
      if (!customerId) break;

      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId);
      break;
    }
  }
}
