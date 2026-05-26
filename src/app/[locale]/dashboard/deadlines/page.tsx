import { getDeadlines } from '@/actions/deadlines';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DeadlinesList } from '@/components/deadlines/deadlines-list';

export default async function DeadlinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('deadlines');
  const deadlines = await getDeadlines();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>
      <DeadlinesList initialDeadlines={deadlines} />
    </div>
  );
}
