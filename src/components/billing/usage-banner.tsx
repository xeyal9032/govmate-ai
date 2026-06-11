'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getUsageSummary } from '@/actions/billing';
import { AlertTriangle, Info } from 'lucide-react';

interface UsageSummary {
  documentsUsed: number;
  documentsLimit: number;
  lettersUsed: number;
  lettersLimit: number;
  maxFileSizeMb: number;
  documentsRemaining: number;
  lettersRemaining: number;
  currentPlan: string;
}

interface UsageBannerProps {
  /** Hangi kotayı vurgulayacağız */
  variant?: 'documents' | 'letters' | 'all';
  className?: string;
}

function formatLimit(used: number, limit: number): string {
  if (limit === -1) return `${used} / ∞`;
  return `${used} / ${limit}`;
}

export function UsageBanner({ variant = 'all', className }: UsageBannerProps) {
  const t = useTranslations('billing.usageBanner');
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsageSummary()
      .then((data) => setUsage(data as UsageSummary | null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !usage) return null;

  const docAtLimit =
    usage.documentsLimit !== -1 && usage.documentsRemaining <= 0;
  const letterAtLimit =
    usage.lettersLimit !== -1 && usage.lettersRemaining <= 0;

  const showDoc = variant === 'all' || variant === 'documents';
  const showLetter = variant === 'all' || variant === 'letters';

  const atLimit =
    (showDoc && docAtLimit) || (showLetter && letterAtLimit);

  return (
    <Alert
      variant={atLimit ? 'destructive' : 'default'}
      className={className}
    >
      {atLimit ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Info className="h-4 w-4" />
      )}
      <AlertTitle>{atLimit ? t('limitReached') : t('title')}</AlertTitle>
      <AlertDescription className="space-y-2">
        <ul className="text-sm space-y-1">
          {showDoc && (
            <li>
              {t('documents', {
                count: formatLimit(usage.documentsUsed, usage.documentsLimit),
              })}
            </li>
          )}
          {showLetter && (
            <li>
              {t('letters', {
                count: formatLimit(usage.lettersUsed, usage.lettersLimit),
              })}
            </li>
          )}
          {(variant === 'all' || variant === 'documents') && (
            <li>{t('maxFileSize', { size: usage.maxFileSizeMb })}</li>
          )}
        </ul>
        {atLimit && (
          <Link href="/dashboard/billing">
            <Button type="button" size="sm" variant="secondary">
              {t('upgrade')}
            </Button>
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
}
