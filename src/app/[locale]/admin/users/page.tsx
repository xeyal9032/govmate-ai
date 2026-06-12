import { getAdminUsers } from '@/actions/admin';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/users-table';
import { CreateUserDialog } from '@/components/admin/create-user-dialog';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { users, total, perPage } = await getAdminUsers(page, 20);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null };
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('users')}</h1>
          <p className="text-muted-foreground">{t('usersDesc')}</p>
        </div>
        {isAdmin && <CreateUserDialog />}
      </div>

      <UsersTable
        users={users}
        total={total}
        page={page}
        perPage={perPage}
        isAdmin={isAdmin}
      />
    </div>
  );
}
