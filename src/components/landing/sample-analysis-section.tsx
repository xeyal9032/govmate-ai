'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  FileDown,
  FileText,
  CalendarClock,
  ListChecks,
  Building2,
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowDownToLine,
} from 'lucide-react';

const actionKeys = ['1', '2', '3'] as const;

const downloadItems = [
  {
    href: '/samples/ornek-analiz-ozeti.pdf',
    titleKey: 'downloads.analysisPdf' as const,
    hintKey: 'downloads.analysisHint' as const,
    accent: 'from-blue-500 to-cyan-500',
    glow: 'group-hover:shadow-blue-500/25',
  },
  {
    href: '/samples/ornek-cevap-mektubu.pdf',
    titleKey: 'downloads.letterPdf' as const,
    hintKey: 'downloads.letterHint' as const,
    accent: 'from-indigo-500 to-violet-500',
    glow: 'group-hover:shadow-indigo-500/25',
  },
] as const;

export function SampleAnalysisSection() {
  const t = useTranslations('landing.sampleAnalysis');

  return (
    <section id="sample-analysis" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Analiz önizleme kartı */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-80" />

            <div className="relative border-b border-border/60 bg-muted/30 px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{t('card.authority')}</p>
                    <p className="text-sm text-muted-foreground">{t('card.documentType')}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {t('card.aiBadge')}
                </span>
              </div>
            </div>

            <div className="relative space-y-6 p-6 sm:p-8">
              <div className="rounded-2xl border border-border/50 bg-muted/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('card.summaryLabel')}
                </p>
                <p className="mt-3 text-sm leading-relaxed sm:text-base">{t('card.summary')}</p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 p-5">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/30">
                    <CalendarClock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
                        {t('card.deadlineLabel')}
                      </p>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{t('card.deadline')}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="h-4 w-4 text-emerald-600" />
                  {t('card.actionsLabel')}
                </div>
                <ul className="mt-4 space-y-3">
                  {actionKeys.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/60 px-4 py-3 text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{t(`card.actions.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* PDF indirme paneli */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 p-5 shadow-lg sm:p-6"
          >
            <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
                <FileDown className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{t('downloads.title')}</h3>
              <p className="mt-2 text-muted-foreground">{t('downloads.subtitle')}</p>
            </div>

            <div className="relative mt-8 flex flex-1 flex-col gap-4">
              {downloadItems.map(({ href, titleKey, hintKey, accent, glow }, index) => (
                <motion.a
                  key={href}
                  href={href}
                  download
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-md backdrop-blur-sm transition-shadow hover:shadow-xl ${glow}`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-md`}
                  >
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t(titleKey)}</p>
                    <p className="truncate text-xs text-muted-foreground">{t(hintKey)}</p>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </motion.a>
              ))}
            </div>

            <div className="relative mt-8 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 p-4">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">{t('downloads.disclaimer')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
