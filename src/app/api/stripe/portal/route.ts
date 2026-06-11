import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCustomerPortalSession } from '@/lib/stripe/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await createCustomerPortalSession(
      subscription.stripe_customer_id,
      `${appUrl}/dashboard/billing`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to open portal' }, { status: 500 });
  }
}
