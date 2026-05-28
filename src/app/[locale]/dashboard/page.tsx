import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getRecentDocuments } from '@/actions/documents';
import { getOpenDeadlines } from '@/actions/deadlines';
import { getUsageSummary } from '@/actions/billing';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentDocuments } from '@/components/dashboard/recent-documents';
import { DeadlineList } from '@/components/dashboard/deadline-list';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { FileText, Mail, Clock, BarChart3 } from 'lucide-react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  const [documents, deadlines, usage] = await Promise.all([
    getRecentDocuments(5),
    getOpenDeadlines(5),
    getUsageSummary(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">{t('welcome')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('stats.documentsAnalyzed')}
          value={usage?.documentsUsed ?? 0}
          icon={FileText}
          description={`/ ${usage?.documentsLimit === -1 ? '∞' : usage?.documentsLimit ?? 3}`}
        />
        <StatsCard
          title={t('stats.lettersGenerated')}
          value={usage?.lettersUsed ?? 0}
          icon={Mail}
          description={`/ ${usage?.lettersLimit === -1 ? '∞' : usage?.lettersLimit ?? 2}`}
        />
        <StatsCard
          title={t('stats.activeDeadlines')}
          value={deadlines.length}
          icon={Clock}
        />
        <StatsCard
          title={t('stats.remainingAnalyses')}
          value={
            usage?.documentsLimit === -1
              ? '∞'
              : Math.max(0, (usage?.documentsLimit ?? 3) - (usage?.documentsUsed ?? 0))
          }
          icon={BarChart3}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDocuments documents={documents} />
        <DeadlineList deadlines={deadlines} />
      </div>
    </div>
  );
}
