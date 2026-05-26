'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Brain, CheckCircle, FileText, MessageSquare, Mail, CalendarClock, Shield } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative overflow-hidden">
      {/* Gradient arka plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-purple-600/10 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/40" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="relative inline-flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-background/70 px-5 py-2.5 shadow-lg shadow-blue-500/10 backdrop-blur-md">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-sm" />
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <Logo size="sm" />
              </motion.div>
              <div className="relative flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-base font-bold text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                    GovMate AI
                  </span>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex h-2 w-2 rounded-full bg-green-500"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('badge')}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              {t('title')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                {t('cta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8 text-base">
                {t('ctaSecondary')}
              </Button>
            </a>
          </motion.div>

          {/* Animasyonlu demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-card to-muted/30 p-1.5 shadow-2xl shadow-blue-500/10">
              <div className="rounded-2xl bg-card p-6 sm:p-8">
                {/* Pencere kontrolleri */}
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-medium text-muted-foreground">GovMate AI</span>
                </div>

                {/* Adım 1: Belge yükleme */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('demo.fileName')}</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.8, type: 'spring', bounce: 0.5 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                </motion.div>

                {/* Adım 2: AI Analiz */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 0.5 }}
                  className="mt-4 rounded-xl border bg-gradient-to-r from-purple-500/5 to-pink-500/5 p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ delay: 3.2, duration: 2, repeat: 2, ease: 'linear' }}
                    >
                      <Brain className="h-4 w-4 text-purple-500" />
                    </motion.div>
                    <span>{t('demo.aiAnalysis')}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[0.7, 1, 0.85].map((w, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${w * 100}%`, opacity: 1 }}
                        transition={{ delay: 3.5 + i * 0.4, duration: 0.8, ease: 'easeOut' }}
                        className="h-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Adım 3: Sonuç etiketleri */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.5, duration: 0.6 }}
                  className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">{t('demo.analysisComplete')}</p>
                      <div className="flex flex-wrap gap-2">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 6, type: 'spring' }}
                          className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300"
                        >
                          {t('demo.deadline')}
                        </motion.span>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 6.3, type: 'spring' }}
                          className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300"
                        >
                          {t('demo.appealPossible')}
                        </motion.span>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 6.6, type: 'spring' }}
                          className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                        >
                          {t('demo.letterCreated')}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Adım 4: AI Açıklama */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 7.2, duration: 0.5 }}
                  className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">{t('demo.aiExplanation')}</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 7.5, duration: 0.8 }}
                        className="mt-1 text-xs leading-relaxed text-muted-foreground"
                      >
                        &quot;{t('demo.aiExplanationText')}&quot;
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                {/* Adım 5: Mektup + Son Tarih (yan yana) */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 8.5, duration: 0.5 }}
                    className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">{t('demo.responseLetter')}</p>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-blue-500/15" />
                      <div className="h-1.5 w-4/5 rounded-full bg-blue-500/15" />
                      <div className="h-1.5 w-3/5 rounded-full bg-blue-500/15" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 9.2, type: 'spring' }}
                      className="mt-2 flex items-center gap-1"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">{t('demo.pdfReady')}</span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 9, duration: 0.5 }}
                    className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-orange-600" />
                      <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">{t('demo.deadlineReminder')}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t('demo.appealDeadline')}</span>
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs font-bold text-orange-600 dark:text-orange-400"
                      >
                        {t('demo.daysLeft')}
                      </motion.span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-orange-500/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 9.5, duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Alt güvenlik notu */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 10.5, duration: 0.5 }}
                  className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground"
                >
                  <Shield className="h-3 w-3" />
                  <span>{t('demo.securityNote')}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
