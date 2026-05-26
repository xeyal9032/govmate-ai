import { getAuditLogs } from '@/actions/admin';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LogsTable } from '@/components/admin/logs-table';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminLogsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { logs, total, perPage } = await getAuditLogs(page, 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('logsTitle')}</h1>
        <p className="text-muted-foreground">
          {t('logsDesc')}
        </p>
      </div>

      <LogsTable
        logs={logs}
        total={total}
        page={page}
        perPage={perPage}
      />
    </div>
  );
}
