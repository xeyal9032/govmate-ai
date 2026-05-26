import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeServer } from '@/lib/stripe/server';

export async function handleStripeWebhook(event: Stripe.Event) {
  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const stripe = getStripeServer();
      const subResponse = await stripe.subscriptions.retrieve(session.subscription as string);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = subResponse as any;

      const priceId = sub.items?.data?.[0]?.price?.id;
      let plan = 'pro';
      if (priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY) plan = 'business';

      const periodStart = sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : new Date().toISOString();
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

      const periodStart = subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null;
      const periodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status === 'active' ? 'active' : 'past_due',
          current_period_start: periodStart,
          current_period_end: periodEnd,
          cancel_at_period_end: subscription.cancel_at_period_end ?? false,
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'customer.subscription.deleted': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any;
      const customerId = typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;

      await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId);
      break;
    }
  }
}
