'use server';

import { createClient } from '@/lib/supabase/server';

export async function getActiveAnnouncements() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('announcements')
    .select('id, title, message, type')
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}
