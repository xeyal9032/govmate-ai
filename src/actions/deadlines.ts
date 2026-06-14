'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Deadline } from '@/types/database';
import { toDeadline } from '@/lib/supabase-mappers';

export type DeadlineWithDocument = Deadline & {
  documents?: { title: string | null; authority_name: string | null } | null;
};

export async function getDeadlines(filter?: { status?: string; urgency?: string }): Promise<DeadlineWithDocument[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  let query = supabase
    .from('deadlines')
    .select('*, documents(title, authority_name)')
    .eq('user_id', user.id)
    .order('deadline_date', { ascending: true });

  if (filter?.status) query = query.eq('status', filter.status);
  if (filter?.urgency) query = query.eq('urgency', filter.urgency);

  const { data } = await query;
  return (data || []).map((row) => ({
    ...toDeadline(row),
    documents: row.documents,
  }));
}

export async function updateDeadlineStatus(id: string, status: 'open' | 'done' | 'expired') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  await supabase.from('deadlines').update({ status }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/[locale]/dashboard/deadlines');
}

export async function createManualDeadline(data: {
  title: string;
  description?: string;
  deadline_date: string;
  urgency: string;
  reminder_enabled?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  await supabase.from('deadlines').insert({
    user_id: user.id,
    title: data.title,
    description: data.description,
    deadline_date: data.deadline_date,
    urgency: data.urgency,
    status: 'open',
    reminder_enabled: data.reminder_enabled ?? true,
  });

  revalidatePath('/[locale]/dashboard/deadlines');
}

export async function deleteDeadline(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  await supabase.from('deadlines').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/[locale]/dashboard/deadlines');
}

export async function getOpenDeadlines(limit = 5): Promise<Deadline[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('deadlines')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'open')
    .order('deadline_date', { ascending: true })
    .limit(limit);

  return (data || []).map(toDeadline);
}
