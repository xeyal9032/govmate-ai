'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileDown, FileText, CalendarClock, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actionKeys = ['1', '2', '3'] as const;

export function SampleAnalysisSection() {
  const t = useTranslations('landing.sampleAnalysis');

  return (
    <section id="sample-analysis" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-3 border-b pb-4">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{t('card.authority')}</p>
                <p className="text-sm text-muted-foreground">{t('card.documentType')}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground">{t('card.summaryLabel')}</p>
              <p className="mt-2 leading-relaxed">{t('card.summary')}</p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                  {t('card.deadlineLabel')}
                </p>
                <p className="text-sm">{t('card.deadline')}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListChecks className="h-4 w-4 text-emerald-600" />
                {t('card.actionsLabel')}
              </div>
              <ul className="mt-3 space-y-2">
                {actionKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {t(`card.actions.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center rounded-2xl border bg-gradient-to-br from-primary/5 to-indigo-500/5 p-6 sm:p-8"
          >
            <h3 className="text-xl font-semibold">{t('downloads.title')}</h3>
            <p className="mt-2 text-muted-foreground">{t('downloads.subtitle')}</p>

            <div className="mt-8 space-y-4">
              <a href="/samples/ornek-analiz-ozeti.pdf" download className="block">
                <Button variant="outline" size="lg" className="h-auto w-full justify-start gap-3 py-4">
                  <FileDown className="h-5 w-5 shrink-0" />
                  <span className="text-left">
                    <span className="block font-medium">{t('downloads.analysisPdf')}</span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {t('downloads.analysisHint')}
                    </span>
                  </span>
                </Button>
              </a>
              <a href="/samples/ornek-cevap-mektubu.pdf" download className="block">
                <Button variant="outline" size="lg" className="h-auto w-full justify-start gap-3 py-4">
                  <FileDown className="h-5 w-5 shrink-0" />
                  <span className="text-left">
                    <span className="block font-medium">{t('downloads.letterPdf')}</span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {t('downloads.letterHint')}
                    </span>
                  </span>
                </Button>
              </a>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">{t('downloads.disclaimer')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
