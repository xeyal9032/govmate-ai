import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers';
import { getDirection } from '@/lib/utils/language';
import type { Locale } from '@/lib/utils/language';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

import trMessages from '../../../messages/tr.json';
import enMessages from '../../../messages/en.json';
import deMessages from '../../../messages/de.json';
import azMessages from '../../../messages/az.json';
import ruMessages from '../../../messages/ru.json';
import ukMessages from '../../../messages/uk.json';
import arMessages from '../../../messages/ar.json';

const allMessages: Record<string, typeof trMessages> = {
  tr: trMessages, en: enMessages, de: deMessages,
  az: azMessages, ru: ruMessages, uk: ukMessages, ar: arMessages,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = allMessages[locale] || allMessages.tr;
  const dir = getDirection(locale as Locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
