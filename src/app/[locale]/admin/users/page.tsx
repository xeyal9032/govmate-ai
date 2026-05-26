import { getAdminUsers } from '@/actions/admin';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UsersTable } from '@/components/admin/users-table';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('users')}</h1>
        <p className="text-muted-foreground">
          {t('usersDesc')}
        </p>
      </div>

      <UsersTable
        users={users}
        total={total}
        page={page}
        perPage={perPage}
      />
    </div>
  );
}
