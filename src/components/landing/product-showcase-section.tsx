'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  MARKETING_DEFAULT_LOCALE,
  SHOWCASE_TAB_KEYS,
  type ShowcaseTabKey,
  getShowcaseImagePath,
} from '@/lib/marketing/showcase-images';

function LocaleShowcaseImage({ tab, alt }: { tab: ShowcaseTabKey; alt: string }) {
  const locale = useLocale();
  const [src, setSrc] = useState(() => getShowcaseImagePath(locale, tab));

  useEffect(() => {
    setSrc(getShowcaseImagePath(locale, tab));
  }, [locale, tab]);

  return (
    <Image
      src={src}
      alt={alt}
      width={1440}
      height={900}
      className="h-auto w-full"
      loading="lazy"
      onError={() => {
        const fallback = getShowcaseImagePath(MARKETING_DEFAULT_LOCALE, tab);
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}

export function ProductShowcaseSection() {
  const locale = useLocale();
  const t = useTranslations('landing.showcase');
  const [active, setActive] = useState<ShowcaseTabKey>('dashboard');

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
          {SHOWCASE_TAB_KEYS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${locale}-${active}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <LocaleShowcaseImage tab={active} alt={t(`alts.${active}`)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
