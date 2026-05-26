'use server';

import { createClient } from '@/lib/supabase/server';

export async function getTemplates(category?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (category) query = query.eq('category', category);

  const { data } = await query;
  return data || [];
}

export async function getTemplate(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function getTemplateCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('template_categories')
    .select('*')
    .order('slug', { ascending: true });
  return data || [];
}
