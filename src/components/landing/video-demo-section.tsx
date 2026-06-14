'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Images } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DEMO_VIDEO_SLIDES,
  getDemoVideoSlidePath,
  type DemoVideoSlideKey,
} from '@/lib/marketing/showcase-images';

const SLIDE_MS = 3000;

export function VideoDemoSection() {
  const t = useTranslations('landing.videoDemo');
  const tShowcase = useTranslations('landing.showcase.tabs');
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_VIDEO_SLIDES.length);
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  const activeSlide = DEMO_VIDEO_SLIDES[activeIndex];

  return (
    <section id="video-demo" className="overflow-x-hidden py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
            <Images className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-2xl border bg-card shadow-xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative aspect-[16/9] w-full bg-slate-50 dark:bg-slate-900/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.file}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={getDemoVideoSlidePath(activeSlide.file)}
                  alt={tShowcase(activeSlide.labelKey as DemoVideoSlideKey)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain object-center"
                  priority={activeIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-4 pt-10">
              <p className="text-center text-sm font-medium text-white">
                {tShowcase(activeSlide.labelKey as DemoVideoSlideKey)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 border-t bg-muted/30 px-4 py-3">
            {DEMO_VIDEO_SLIDES.map((slide, index) => (
              <button
                key={slide.file}
                type="button"
                aria-label={tShowcase(slide.labelKey as DemoVideoSlideKey)}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
