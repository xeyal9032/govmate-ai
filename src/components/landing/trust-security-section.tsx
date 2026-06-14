'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, UserCheck, Bot, ArrowRight, type LucideIcon } from 'lucide-react';

const items: {
  key: 'gdpr' | 'encryption' | 'rls' | 'noTraining';
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  glow: string;
  border: string;
}[] = [
  {
    key: 'gdpr',
    icon: Shield,
    gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    iconBg: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-emerald-500/20',
    border: 'hover:border-emerald-500/30',
  },
  {
    key: 'encryption',
    icon: Lock,
    gradient: 'from-blue-500/15 via-cyan-500/5 to-transparent',
    iconBg: 'from-blue-500 to-cyan-600',
    glow: 'hover:shadow-blue-500/20',
    border: 'hover:border-blue-500/30',
  },
  {
    key: 'rls',
    icon: UserCheck,
    gradient: 'from-indigo-500/15 via-violet-500/5 to-transparent',
    iconBg: 'from-indigo-500 to-violet-600',
    glow: 'hover:shadow-indigo-500/20',
    border: 'hover:border-indigo-500/30',
  },
  {
    key: 'noTraining',
    icon: Bot,
    gradient: 'from-violet-500/15 via-purple-500/5 to-transparent',
    iconBg: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/20',
    border: 'hover:border-violet-500/30',
  },
];

export function TrustSecuritySection() {
  const t = useTranslations('landing.trustSecurity');

  return (
    <section id="trust-security" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-muted/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/8 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
            <Shield className="h-3.5 w-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map(({ key, icon: Icon, gradient, iconBg, glow, border }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-md backdrop-blur-md transition-all hover:shadow-lg sm:p-6 ${glow} ${border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 transition-opacity group-hover:opacity-100`} />
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

              <div className="relative">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-md`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold leading-snug sm:text-base">{t(`items.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/legal/privacy"
            className="group inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-3.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
          >
            <Shield className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t('privacyLink')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
