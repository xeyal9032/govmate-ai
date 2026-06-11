import type { SupabaseClient } from '@supabase/supabase-js';

/** Ay başından itibaren yüklenen belge sayısı (upload kotası ile aynı kaynak) */
export async function countMonthlyDocuments(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  return count || 0;
}

/** Ay başından itibaren oluşturulan mektup sayısı */
export async function countMonthlyLetters(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action_type', 'letter_generation')
    .gte('created_at', startOfMonth.toISOString());

  return count || 0;
}
