'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getLetters() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data } = await supabase
    .from('generated_letters')
    .select('*, documents(title, authority_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getLetter(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data } = await supabase
    .from('generated_letters')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  return data;
}

export async function updateLetter(id: string, updates: { german_body?: string; subject?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  await supabase
    .from('generated_letters')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/[locale]/dashboard/letters');
}

export async function deleteLetter(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  await supabase.from('generated_letters').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/[locale]/dashboard/letters');
}
