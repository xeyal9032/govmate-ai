export const locales = ['tr', 'de', 'en', 'az', 'ru', 'uk', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  de: 'Deutsch',
  en: 'English',
  az: 'Azərbaycan dili',
  ru: 'Русский',
  uk: 'Українська',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  tr: 'TR',
  de: 'DE',
  en: 'GB',
  az: 'AZ',
  ru: 'RU',
  uk: 'UA',
  ar: 'SA',
};

export const localeFlagUrls: Record<Locale, string> = {
  tr: 'https://flagcdn.com/w40/tr.png',
  de: 'https://flagcdn.com/w40/de.png',
  en: 'https://flagcdn.com/w40/gb.png',
  az: 'https://flagcdn.com/w40/az.png',
  ru: 'https://flagcdn.com/w40/ru.png',
  uk: 'https://flagcdn.com/w40/ua.png',
  ar: 'https://flagcdn.com/w40/sa.png',
};

export const rtlLocales: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
