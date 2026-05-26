import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'],
  defaultLocale: 'tr',
});
