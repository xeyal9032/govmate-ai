'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 400;

function getMaxScrollDepth(): number {
  let max = window.scrollY;
  document.querySelectorAll('main').forEach((el) => {
    if (el.scrollTop > max) max = el.scrollTop;
  });
  return max;
}

/** Sayfa veya dashboard içindeki main kaydırıldığında yukarı çıkma butonu */
export function ScrollToTopButton() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(getMaxScrollDepth() > SCROLL_THRESHOLD);
    };

    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('main').forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  return (
    <button
      type="button"
      aria-label={t('scrollToTop')}
      onClick={scrollToTop}
      className={cn(
        'touch-target fixed z-50 flex size-11 items-center justify-center rounded-full',
        'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white',
        'shadow-lg shadow-blue-500/30 ring-1 ring-white/20',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 dark:shadow-blue-900/40',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))]',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <ArrowUp className="size-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
