'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote, Star, MessageCircleHeart } from 'lucide-react';

const testimonialKeys = ['1', '2', '3'] as const;

const cardStyles: Record<
  (typeof testimonialKeys)[number],
  { gradient: string; avatar: string; glow: string; accent: string }
> = {
  '1': {
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    avatar: 'from-blue-500 to-indigo-600',
    glow: 'hover:shadow-blue-500/15',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  '2': {
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    avatar: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-emerald-500/15',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  '3': {
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    avatar: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-500/15',
    accent: 'text-violet-600 dark:text-violet-400',
  },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsSection() {
  const t = useTranslations('landing.testimonials');

  return (
    <section id="testimonials" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/15 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
            <MessageCircleHeart className="h-3.5 w-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {testimonialKeys.map((key, index) => {
            const name = t(`items.${key}.name`);
            const styles = cardStyles[key];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-md backdrop-blur-md transition-shadow hover:shadow-lg ${styles.glow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-80 transition-opacity group-hover:opacity-100`} />

                <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Quote className={`h-5 w-5 ${styles.accent}`} />
                    </div>
                    <div className="flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-relaxed sm:text-base">
                    <span className="text-muted-foreground">&ldquo;</span>
                    {t(`items.${key}.quote`)}
                    <span className="text-muted-foreground">&rdquo;</span>
                  </p>

                  <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${styles.avatar} text-sm font-bold text-white shadow-md`}
                    >
                      {initials(name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{name}</p>
                      <p className="truncate text-xs text-muted-foreground sm:text-sm">
                        {t(`items.${key}.context`)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`mt-4 inline-flex w-fit rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold ${styles.accent}`}
                  >
                    {t(`items.${key}.badge`)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
