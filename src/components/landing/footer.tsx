'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AlertTriangle, Heart, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative overflow-hidden border-t">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-muted/60" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Yasal uyarı */}
        <div className="mb-12 flex items-start gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-50/60 p-5 shadow-sm dark:bg-yellow-950/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200/80">
            {t('landing.disclaimer')}
          </p>
        </div>

        {/* Ana footer içeriği */}
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Sol: Logo + açıklama */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <span className="text-lg font-bold">{t('common.appName')}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          {/* Orta: Linkler */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('legal.legalNotice')}
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/legal/privacy"
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                {t('legal.privacy')}
              </Link>
              <Link
                href="/legal/terms"
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                {t('legal.terms')}
              </Link>
              <Link
                href="/legal/disclaimer"
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                {t('legal.legalNotice')}
              </Link>
            </nav>
          </div>

          {/* Sağ: İletişim / Hakkında */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t('landing.hero.ctaSecondary')}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('landing.authorities.subtitle')}
            </p>
          </div>
        </div>

        {/* Alt çizgi + copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('common.appName')}
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> in Germany
          </p>
        </div>
      </div>
    </footer>
  );
}
