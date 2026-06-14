'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { FileText, Mail, Users, TrendingUp, type LucideIcon } from 'lucide-react';
import type { PublicPlatformStats } from '@/actions/public-stats';

interface MetricLabels {
  documents: string;
  letters: string;
  users: string;
}

interface Props {
  stats: PublicPlatformStats;
  title: string;
  subtitle: string;
  badge: string;
  metrics: MetricLabels;
}

const cardConfig: {
  key: keyof MetricLabels;
  valueKey: keyof Pick<PublicPlatformStats, 'totalDocuments' | 'totalLetters' | 'totalUsers'>;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  glow: string;
}[] = [
  {
    key: 'documents',
    valueKey: 'totalDocuments',
    icon: FileText,
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    iconBg: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  {
    key: 'letters',
    valueKey: 'totalLetters',
    icon: Mail,
    gradient: 'from-indigo-500/20 via-violet-500/10 to-transparent',
    iconBg: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/20',
  },
  {
    key: 'users',
    valueKey: 'totalUsers',
    icon: Users,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconBg: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
];

function formatDisplayNumber(value: number, locale: string): string {
  return `${new Intl.NumberFormat(locale).format(value)}+`;
}

export function StatsSectionClient({ stats, title, subtitle, badge, metrics }: Props) {
  const locale = useLocale();

  return (
    <section id="stats" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            {badge}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {cardConfig.map(({ key, valueKey, icon: Icon, gradient, iconBg, glow }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-md backdrop-blur-md transition-shadow hover:shadow-lg ${glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 transition-opacity group-hover:opacity-100`} />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

              <div className="relative flex flex-col items-center text-center">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-md`}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                </div>
                <p className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tabular-nums tracking-tight text-transparent sm:text-4xl">
                  {formatDisplayNumber(stats[valueKey], locale)}
                </p>
                <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
                  {metrics[key]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
