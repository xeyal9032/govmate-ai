'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return subscription;
}

export async function getUsageSummary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const plan = subscription?.plan || 'free';

  const { data: limits } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: docsUsed } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action_type', 'document_analysis')
    .gte('created_at', startOfMonth.toISOString());

  const { count: lettersUsed } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action_type', 'letter_generation')
    .gte('created_at', startOfMonth.toISOString());

  return {
    documentsUsed: docsUsed || 0,
    documentsLimit: limits?.monthly_document_limit || 20,
    lettersUsed: lettersUsed || 0,
    lettersLimit: limits?.monthly_letter_limit || 2,
    currentPlan: plan,
  };
}
