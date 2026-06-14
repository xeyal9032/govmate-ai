'use server';

import { createClient } from '@/lib/supabase/server';
import { resolveActivePlan } from '@/lib/utils/plan-limits';
import { countMonthlyDocuments, countMonthlyLetters } from '@/lib/utils/usage-counts';
import type { PlanType, PlanLimit, Subscription } from '@/types/database';
import { toPlanLimit, toSubscription } from '@/lib/supabase-mappers';

export async function getUserSubscription(): Promise<Subscription | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return subscription ? toSubscription(subscription) : null;
}

export async function getUsageSummary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  const plan = resolveActivePlan(subscription) as PlanType;

  const { data: limits } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();

  const [documentsUsed, lettersUsed] = await Promise.all([
    countMonthlyDocuments(supabase, user.id),
    countMonthlyLetters(supabase, user.id),
  ]);

  const documentsLimit = limits?.monthly_document_limit ?? 20;
  const lettersLimit = limits?.monthly_letter_limit ?? 2;

  return {
    documentsUsed,
    documentsLimit,
    lettersUsed,
    lettersLimit,
    maxFileSizeMb: limits?.max_file_size_mb ?? 20,
    currentPlan: plan,
    documentsRemaining:
      documentsLimit === -1 ? -1 : Math.max(0, documentsLimit - documentsUsed),
    lettersRemaining:
      lettersLimit === -1 ? -1 : Math.max(0, lettersLimit - lettersUsed),
  };
}

export async function getAllPlanLimits(): Promise<PlanLimit[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('plan_limits')
    .select('*')
    .order('plan');

  return (data || []).map(toPlanLimit);
}
