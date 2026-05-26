import { createClient } from '@/lib/supabase/server';
import type { PlanType } from '@/types/database';

export async function getPlanLimits(plan: PlanType) {
  const supabase = await createClient();
  const { data } = await supabase
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
