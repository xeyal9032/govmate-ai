'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, PenLine } from 'lucide-react';
import { getRecommendedLetterType } from '@/lib/letters/recommended-letter-type';
import type { AnalysisResult } from '@/types/database';

interface AnalysisLetterCtaProps {
  documentId: string;
  authorityName?: string | null;
  analysisJson?: AnalysisResult | null;
}

export function AnalysisLetterCta({
  documentId,
  authorityName,
  analysisJson,
}: AnalysisLetterCtaProps) {
  const t = useTranslations('documents.detail');
  const tLetters = useTranslations('letters');

  const recommendedType = getRecommendedLetterType(analysisJson ?? null);
  const sender =
    analysisJson?.sender_authority || authorityName || null;

  const baseHref = `/dashboard/letters/new?documentId=${documentId}`;
  const autoHref = recommendedType
    ? `${baseHref}&letterType=${recommendedType}&auto=1`
    : baseHref;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <h3 className="font-semibold">{t('createLetterTitle')}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('createLetterDescription')}
            </p>
            {sender && (
              <p className="text-sm">
                <span className="text-muted-foreground">{t('authority')}: </span>
                <span className="font-medium">{sender}</span>
              </p>
            )}
            {recommendedType && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t('recommendedTypeLabel')}:
                </span>
                <Badge variant="secondary">
                  {tLetters(`generate.types.${recommendedType}` as 'generate.types.simple_reply')}
                </Badge>
              </div>
            )}
            {!recommendedType && (
              <p className="text-sm text-muted-foreground">{t('noResponseNeededHint')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:min-w-[200px] shrink-0">
            {recommendedType ? (
              <Link
                href={autoHref}
                className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {t('createLetterButtonAuto')}
              </Link>
            ) : (
              <Link
                href={baseHref}
                className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }), 'w-full')}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t('createLetterButton')}
              </Link>
            )}
            {recommendedType && (
              <Link
                href={baseHref}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
              >
                <PenLine className="mr-2 h-3.5 w-3.5" />
                {t('customizeLetter')}
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
