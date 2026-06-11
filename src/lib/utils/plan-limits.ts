import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlanType } from '@/types/database';

export type PlanFeature =
  | 'translation_enabled'
  | 'pdf_export_enabled'
  | 'reminders_enabled';

const FEATURE_ERRORS: Record<PlanFeature, string> = {
  translation_enabled:
    'Translation feature is not available on your current plan. Please upgrade to Pro or Business.',
  pdf_export_enabled:
    'PDF export is not available on your current plan. Please upgrade to Pro or Business.',
  reminders_enabled:
    'Email reminders are not available on your current plan. Please upgrade to Pro or Business.',
};

export function resolveActivePlan(
  subscription: { plan: string; status: string } | null | undefined
): PlanType {
  if (subscription?.status === 'active' && subscription.plan) {
    return subscription.plan as PlanType;
  }
  return 'free';
}

export async function getUserActivePlan(
  supabase: SupabaseClient,
  userId: string
): Promise<PlanType> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();
  return resolveActivePlan(data);
}

export async function isPlanFeatureEnabled(
  plan: PlanType,
  feature: PlanFeature,
  supabase?: SupabaseClient
): Promise<boolean> {
  const limits = await getPlanLimits(plan, supabase);
  if (!limits) return false;
  return Boolean(limits[feature]);
}

export async function assertPlanFeature(
  supabase: SupabaseClient,
  userId: string,
  feature: PlanFeature
): Promise<{ ok: true; plan: PlanType } | { ok: false; plan: PlanType; error: string }> {
  const plan = await getUserActivePlan(supabase, userId);
  const enabled = await isPlanFeatureEnabled(plan, feature);
  if (!enabled) {
    return { ok: false, plan, error: FEATURE_ERRORS[feature] };
  }
  return { ok: true, plan };
}

export async function getPlanLimits(plan: PlanType, supabase?: SupabaseClient) {
  const client = supabase ?? await createClient();
  const { data } = await client
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();
  return data;
}

export async function getMonthlyUsage(userId: string, actionType: string) {
  const supabase = await createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action_type', actionType)
    .gte('created_at', startOfMonth.toISOString());

  return count || 0;
}

export async function checkUsageLimit(
  userId: string,
  plan: PlanType,
  actionType: 'document_analysis' | 'letter_generation'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const limits = await getPlanLimits(plan);
  if (!limits) return { allowed: true, used: 0, limit: 9999 };

  const limitField = actionType === 'document_analysis'
    ? limits.monthly_document_limit
    : limits.monthly_letter_limit;

  // -1 = limitsiz
  if (limitField === -1) return { allowed: true, used: 0, limit: -1 };

  const used = await getMonthlyUsage(userId, actionType);
  return { allowed: used < limitField, used, limit: limitField };
}

export async function incrementUsage(
  userId: string,
  actionType: string,
  documentId?: string,
  tokensUsed?: number
) {
  const supabase = await createClient();
  await supabase.from('usage_logs').insert({
    user_id: userId,
    action_type: actionType,
    tokens_used: tokensUsed || 0,
    document_id: documentId || null,
  });
}
