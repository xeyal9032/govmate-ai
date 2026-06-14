'use server';

import { createClient } from '@/lib/supabase/server';
import type { Template, TemplateCategory } from '@/types/database';
import { toTemplate, toTemplateCategory } from '@/lib/supabase-mappers';

export async function getTemplates(category?: string): Promise<Template[]> {
  const supabase = await createClient();

  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });

  if (category) query = query.eq('category', category);

  const { data } = await query;
  return (data || []).map(toTemplate);
}

export async function getTemplate(id: string): Promise<Template | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  return data ? toTemplate(data) : null;
}

export async function getTemplateCategories(): Promise<TemplateCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('template_categories')
    .select('*')
    .order('slug', { ascending: true });
  return (data || []).map(toTemplateCategory);
}
