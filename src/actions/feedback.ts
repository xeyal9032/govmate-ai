'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(data: { type: string; message: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    type: data.type,
    message: data.message,
    status: 'new',
  });

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/dashboard');
}

export async function getFeedbackWithReplies() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('feedback')
    .select('id, type, message, admin_reply, status, created_at')
    .eq('user_id', user.id)
    .not('admin_reply', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}
