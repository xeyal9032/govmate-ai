import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { setRequestLocale } from 'next-intl/server';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Admin layout profile fetch error:', error);
  }

  if (profile?.role !== 'admin' && profile?.role !== 'support') {
    redirect(`/${locale}/dashboard`);
  }

  const staffRole = profile?.role === 'support' ? 'support' : 'admin';

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar role={staffRole} />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
