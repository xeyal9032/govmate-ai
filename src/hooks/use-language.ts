'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/lib/utils/language';
import { locales } from '@/lib/utils/language';

export function useLanguage() {
  const locale = useLocale() as Locale;
  const fullPathname = usePathname();

  const changeLocale = useCallback((newLocale: Locale) => {
    let pathWithoutLocale = fullPathname;
    for (const loc of locales) {
      if (fullPathname.startsWith(`/${loc}/`)) {
        pathWithoutLocale = fullPathname.slice(loc.length + 1);
        break;
      }
      if (fullPathname === `/${loc}`) {
        pathWithoutLocale = '';
        break;
      }
    }

    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  }, [fullPathname]);

  return { locale, changeLocale, isPending: false };
}
