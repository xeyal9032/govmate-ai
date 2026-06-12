import { getTranslations } from 'next-intl/server';
import { getPublicPlatformStats } from '@/actions/public-stats';
import { FileText, Mail, Users, Sparkles } from 'lucide-react';

const metrics = [
  { key: 'documents', icon: FileText, valueKey: 'totalDocuments' as const },
  { key: 'letters', icon: Mail, valueKey: 'totalLetters' as const },
  { key: 'users', icon: Users, valueKey: 'totalUsers' as const },
] as const;

export async function StatsSection() {
  const t = await getTranslations('landing.stats');
  const stats = await getPublicPlatformStats();

  return (
    <section id="stats" className="border-y bg-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {stats.isBeta && (
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t('betaBadge')}
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {metrics.map(({ key, icon: Icon, valueKey }) => (
            <div
              key={key}
              className="flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold tabular-nums">{stats[valueKey]}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t(`metrics.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
