import { format, formatDistanceToNow, differenceInDays, parseISO, type Locale as DateFnsLocale } from 'date-fns';
import { tr, de, enUS, az, ru, uk, ar } from 'date-fns/locale';
import type { Locale } from './language';

const dateLocales: Record<Locale, DateFnsLocale> = {
  tr,
  de,
  en: enUS,
  az,
  ru,
  uk,
  ar,
};

export function formatDate(date: string | Date, locale: Locale = 'tr'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd.MM.yyyy', { locale: dateLocales[locale] });
}

export function formatDateTime(date: string | Date, locale: Locale = 'tr'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd.MM.yyyy HH:mm', { locale: dateLocales[locale] });
}

export function timeAgo(date: string | Date, locale: Locale = 'tr'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: dateLocales[locale] });
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(d, new Date());
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
