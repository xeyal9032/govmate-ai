'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { Database, Json } from '@/types/supabase.generated';

type PlanLimitUpdate = Database['public']['Tables']['plan_limits']['Update'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type SiteContentUpdate = Database['public']['Tables']['site_content']['Update'];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Admin access required');
  return user;
}

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Yetkisiz');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'support') {
    throw new Error('Staff access required');
  }
  return { user, role: profile?.role as 'admin' | 'support' };
}

export async function getAdminStats() {
  await requireStaff();
  const admin = createAdminClient();

  const { count: totalUsers } = await admin.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalDocs } = await admin.from('documents').select('*', { count: 'exact', head: true });
  const { count: totalLetters } = await admin.from('generated_letters').select('*', { count: 'exact', head: true });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyUsage } = await admin
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  return {
    totalUsers: totalUsers || 0,
    totalDocuments: totalDocs || 0,
    totalLetters: totalLetters || 0,
    monthlyAIUsage: monthlyUsage || 0,
  };
}

export async function getAdminChartData() {
  await requireStaff();
  const admin = createAdminClient();

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const { count: docs } = await admin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', date.toISOString())
      .lt('created_at', nextDate.toISOString());

    const { count: usage } = await admin
      .from('usage_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', date.toISOString())
      .lt('created_at', nextDate.toISOString());

    days.push({
      date: date.toISOString().slice(5, 10),
      documents: docs || 0,
      aiUsage: usage || 0,
    });
  }

  return days;
}

export async function getAdminUsers(page = 1, perPage = 20) {
  await requireStaff();
  const admin = createAdminClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count } = await admin
    .from('profiles')
    .select('*, subscriptions(plan, status)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  return { users: data || [], total: count || 0, page, perPage };
}

export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'support') {
  await requireAdmin();
  const admin = createAdminClient();

  await admin.from('profiles').update({ role }).eq('id', userId);
  revalidatePath('/[locale]/admin/users');
  revalidatePath(`/[locale]/admin/users/${userId}`);
}

export async function getStaffRole(): Promise<'admin' | 'support' | null> {
  try {
    const { role } = await requireStaff();
    return role;
  } catch {
    return null;
  }
}

export async function adminCreateTemplate(data: {
  category: string;
  title: string;
  description: string;
  content: string;
  variables: Record<string, unknown>[];
  language: string;
}) {
  await requireAdmin();
  const admin = createAdminClient();

  await admin.from('templates').insert({
    category: data.category,
    title: data.title,
    description: data.description,
    content: data.content,
    variables: data.variables as Json,
    language: data.language || 'de',
    is_active: true,
  });

  revalidatePath('/[locale]/admin/templates');
}

export async function adminUpdateTemplate(
  id: string,
  data: {
    category?: string;
    title?: string;
    description?: string | null;
    content?: string;
    variables?: Json;
    language?: string;
    is_active?: boolean | null;
  }
) {
  await requireAdmin();
  const admin = createAdminClient();

  await admin.from('templates').update(data).eq('id', id);
  revalidatePath('/[locale]/admin/templates');
}

export async function adminDeleteTemplate(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  await admin.from('templates').delete().eq('id', id);
  revalidatePath('/[locale]/admin/templates');
}

export async function getAuditLogs(page = 1, perPage = 50) {
  await requireAdmin();
  const admin = createAdminClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count } = await admin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  return { logs: data || [], total: count || 0, page, perPage };
}

export async function getFeedbacks(status?: string) {
  await requireStaff();
  const admin = createAdminClient();

  let query = admin
    .from('feedback')
    .select('*, profiles!feedback_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data } = await query;
  return data || [];
}

export async function adminCreateCategory(data: {
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
}) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('template_categories').insert({
    slug: data.slug,
    name: data.name as Json,
    description: data.description as Json,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/categories');
}

export async function adminUpdateCategory(id: string, data: {
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
}) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('template_categories')
    .select('name, description')
    .eq('id', id)
    .single();

  const mergedName = { ...(existing?.name as Record<string, string> || {}), ...data.name };
  const mergedDesc = { ...(existing?.description as Record<string, string> || {}), ...data.description };

  const { error } = await admin
    .from('template_categories')
    .update({ slug: data.slug, name: mergedName as Json, description: mergedDesc as Json })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/categories');
}

export async function adminDeleteCategory(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('template_categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/categories');
}

export async function getAdminSubscriptions() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from('subscriptions')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function adminDeleteUser(userId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === userId) throw new Error('Kendi hesabınızı silemezsiniz');

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/users');
}

export async function adminCreateUser(data: {
  email: string;
  password: string;
  full_name: string;
  role?: 'user' | 'admin' | 'support';
}) {
  await requireAdmin();
  const email = data.email.trim().toLowerCase();
  if (!email || data.password.length < 8) {
    throw new Error('Geçersiz e-posta veya şifre (min. 8 karakter)');
  }

  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password: data.password,
    email_confirm: true,
    user_metadata: { full_name: data.full_name.trim() },
  });
  if (error) throw new Error(error.message);

  const userId = created.user.id;
  const role = data.role ?? 'user';

  await admin
    .from('profiles')
    .update({
      full_name: data.full_name.trim(),
      ...(role !== 'user' ? { role } : {}),
    })
    .eq('id', userId);

  revalidatePath('/[locale]/admin/users');
  return { id: userId, email };
}

export async function updateUserEmail(userId: string, email: string) {
  await requireAdmin();
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Geçersiz e-posta adresi');
  }

  const admin = createAdminClient();
  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    email: normalized,
  });
  if (authError) throw new Error(authError.message);

  const { error } = await admin.from('profiles').update({ email: normalized }).eq('id', userId);
  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/admin/users');
  revalidatePath(`/[locale]/admin/users/${userId}`);
}

export async function adminDeleteDocument(documentId: string, userId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: document } = await admin
    .from('documents')
    .select('id, user_id, file_path')
    .eq('id', documentId)
    .single();

  if (!document || document.user_id !== userId) {
    throw new Error('Belge bulunamadı');
  }

  if (document.file_path) {
    await admin.storage.from('documents').remove([document.file_path]);
  }

  const { error } = await admin.from('documents').delete().eq('id', documentId);
  if (error) throw new Error(error.message);

  revalidatePath(`/[locale]/admin/users/${userId}`);
}

export async function adminDeleteLetter(letterId: string, userId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: letter } = await admin
    .from('generated_letters')
    .select('id, user_id')
    .eq('id', letterId)
    .single();

  if (!letter || letter.user_id !== userId) {
    throw new Error('Mektup bulunamadı');
  }

  const { error } = await admin.from('generated_letters').delete().eq('id', letterId);
  if (error) throw new Error(error.message);

  revalidatePath(`/[locale]/admin/users/${userId}`);
}

export async function deleteAuditLog(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('audit_logs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/logs');
}

export async function updateFeedbackStatus(id: string, status: string) {
  await requireStaff();
  const admin = createAdminClient();
  const { error } = await admin.from('feedback').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/feedback');
}

export async function getAppSettings() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin.from('app_settings').select('*');
  const settings: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function updateAppSetting(key: string, value: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  if (key === 'maintenance_mode') {
    const { clearMaintenanceCache } = await import('@/lib/maintenance');
    clearMaintenanceCache();
  }
  if (key === 'ai_model' || key === 'ai_translation_model') {
    const { clearAiSettingsCache } = await import('@/lib/ai/settings');
    clearAiSettingsCache();
  }
  revalidatePath('/[locale]/admin/ai-settings');
}

export async function getAdminPlanLimits() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin.from('plan_limits').select('*').order('plan');
  return data || [];
}

export async function updatePlanLimit(id: string, updates: PlanLimitUpdate) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('plan_limits').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/plan-limits');
}

export async function updateSubscriptionPlan(subscriptionId: string, plan: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from('subscriptions')
    .update({ plan, updated_at: new Date().toISOString() })
    .eq('id', subscriptionId);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/subscriptions');
  revalidatePath('/[locale]/admin/users');
}

export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: 'active' | 'inactive' | 'canceled' | 'past_due'
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from('subscriptions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', subscriptionId);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/subscriptions');
  revalidatePath('/[locale]/admin/users');
}

export async function updateUserProfile(
  userId: string,
  data: { full_name?: string; address?: string; email?: string }
) {
  await requireAdmin();
  if (data.email !== undefined) {
    await updateUserEmail(userId, data.email);
  }

  const admin = createAdminClient();
  const updates: ProfileUpdate = {};
  if (data.full_name !== undefined) updates.full_name = data.full_name;
  if (data.address !== undefined) updates.address = data.address;

  if (Object.keys(updates).length === 0) return;

  const { error } = await admin.from('profiles').update(updates).eq('id', userId);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/users');
  revalidatePath(`/[locale]/admin/users/${userId}`);
}

export async function deleteFeedback(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('feedback').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/feedback');
}

export async function replyToFeedback(id: string, reply: string) {
  await requireStaff();
  const admin = createAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await admin
    .from('feedback')
    .update({
      admin_reply: reply,
      replied_at: new Date().toISOString(),
      replied_by: user?.id,
      status: 'reviewed',
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/feedback');
}

export async function adminResetPassword(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();
  if (!profile?.email) throw new Error('User email not found');
  const { error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: profile.email,
  });
  if (error) throw new Error(error.message);
  return { email: profile.email };
}

export async function getSiteContent(contentType?: string) {
  await requireAdmin();
  const admin = createAdminClient();
  let query = admin.from('site_content').select('*').order('sort_order');
  if (contentType) query = query.eq('content_type', contentType);
  const { data } = await query;
  return data || [];
}

export async function updateSiteContent(id: string, updates: SiteContentUpdate) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('site_content').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/site-content');
}

export async function createSiteContent(data: {
  slug: string;
  content_type: string;
  title: Record<string, string>;
  body: Record<string, string>;
  sort_order?: number;
  is_published?: boolean;
}) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('site_content').insert({
    ...data,
    title: data.title as Json,
    body: data.body as Json,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/site-content');
}

export async function deleteSiteContent(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('site_content').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/site-content');
}

export async function getAnnouncements() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data } = await admin
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function createAnnouncement(data: {
  title: string;
  message: string;
  type: string;
  expires_at?: string;
}) {
  await requireAdmin();
  const admin = createAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await admin.from('announcements').insert({
    ...data,
    created_by: user?.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/announcements');
}

export async function updateAnnouncement(
  id: string,
  data: {
    title: string;
    message: string;
    type: string;
    expires_at?: string | null;
  }
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from('announcements')
    .update({
      title: data.title,
      message: data.message,
      type: data.type,
      expires_at: data.expires_at || null,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/announcements');
}

export async function toggleAnnouncement(id: string, isActive: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').update({ is_active: isActive }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/announcements');
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('announcements').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/admin/announcements');
}

export async function getAdminUserDetail(userId: string) {
  await requireStaff();
  const admin = createAdminClient();
  const [profileRes, docsRes, lettersRes, usageRes] = await Promise.all([
    admin.from('profiles').select('*, subscriptions(id, plan, status)').eq('id', userId).single(),
    admin.from('documents').select('id, title, status, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    admin.from('generated_letters').select('id, subject, letter_type, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    admin.from('usage_logs').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ]);
  return {
    profile: profileRes.data,
    documents: docsRes.data || [],
    letters: lettersRes.data || [],
    totalUsage: usageRes.count || 0,
  };
}
