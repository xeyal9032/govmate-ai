'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getDocuments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDocument(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!document) throw new Error('Document not found');

  const { data: analysis } = await supabase
    .from('document_analyses')
    .select('*')
    .eq('document_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('*')
    .eq('document_id', id)
    .eq('user_id', user.id)
    .order('deadline_date', { ascending: true });

  const { data: letters } = await supabase
    .from('generated_letters')
    .select('*')
    .eq('document_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { document, analysis, deadlines: deadlines || [], letters: letters || [] };
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data: document } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (document?.file_path) {
    await supabase.storage.from('documents').remove([document.file_path]);
  }

  await supabase.from('documents').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/[locale]/dashboard/documents');
}

export async function getRecentDocuments(limit = 5) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}
