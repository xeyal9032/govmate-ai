'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Upload, Brain, Mail, CalendarClock, ArrowRight } from 'lucide-react';

const steps = [
  {
    key: 'step1',
    icon: Upload,
    gradient: 'from-blue-500 to-cyan-400',
    bgGlow: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/20',
    shadowColor: 'shadow-blue-500/10',
  },
  {
    key: 'step2',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-400',
    bgGlow: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500/20',
    shadowColor: 'shadow-purple-500/10',
  },
  {
    key: 'step3',
    icon: Mail,
    gradient: 'from-emerald-500 to-teal-400',
    bgGlow: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/20',
    shadowColor: 'shadow-emerald-500/10',
  },
  {
    key: 'step4',
    icon: CalendarClock,
    gradient: 'from-orange-500 to-amber-400',
    bgGlow: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500/20',
    shadowColor: 'shadow-orange-500/10',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks');

  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            4 {t('title').includes('?') ? t('title').replace('?', '') : t('title')}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Adımlar arası ok çizgileri (sadece desktop) */}
          <div className="pointer-events-none absolute top-16 hidden w-full lg:block">
            <div className="mx-auto flex max-w-[85%] justify-between px-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
                  className="flex items-center"
                  style={{ originX: 0 }}
                >
                  <div className="h-[2px] w-16 bg-gradient-to-r from-border to-border/50 xl:w-24" />
                  <ArrowRight className="h-4 w-4 -ml-1 text-muted-foreground/50" />
                </motion.div>
              ))}
            </div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.key} variants={itemVariants} className="group">
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border ${step.borderColor} bg-card p-6 shadow-lg ${step.shadowColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
                >
                  {/* Üst gradient şerit */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${step.gradient}`} />

                  {/* Arka plan glow */}
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${step.bgGlow} blur-2xl transition-all duration-300 group-hover:scale-150 group-hover:opacity-70`} />

                  <div className="relative">
                    {/* İkon + numara */}
                    <div className="mb-5 flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-sm font-bold text-white shadow-md`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Başlık */}
                    <h3 className="text-lg font-bold">
                      {t(`${step.key}.title`)}
                    </h3>

                    {/* Açıklama */}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(`${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
