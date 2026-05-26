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
