'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'dashboard', image: '/marketing/dashboard.png' },
  { key: 'upload', image: '/marketing/upload.png' },
  { key: 'analysis', image: '/marketing/landing-how-it-works.png' },
  { key: 'templates', image: '/marketing/templates.png' },
  { key: 'pricing', image: '/marketing/landing-pricing.png' },
] as const;

export function ProductShowcaseSection() {
  const t = useTranslations('landing.showcase');
  const [active, setActive] = useState<(typeof tabs)[number]['key']>('dashboard');

  const current = tabs.find((tab) => tab.key === active) ?? tabs[0];

  return (
    <section id="showcase" className="bg-muted/30 py-24 sm:py-32">
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

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {t(`tabs.${tab.key}`)}
            </button>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={current.image}
                alt={t(`alts.${current.key}`)}
                width={1440}
                height={900}
                className="h-auto w-full"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
