import { getTranslations } from 'next-intl/server';
import { getPublicPlatformStats } from '@/actions/public-stats';
import { StatsSectionClient } from '@/components/landing/stats-section-client';

export async function StatsSection() {
  const t = await getTranslations('landing.stats');
  const stats = await getPublicPlatformStats();

  return (
    <StatsSectionClient
      stats={stats}
      title={t('title')}
      subtitle={t('subtitle')}
      badge={t('badge')}
      metrics={{
        documents: t('metrics.documents'),
        letters: t('metrics.letters'),
        users: t('metrics.users'),
      }}
    />
  );
}
