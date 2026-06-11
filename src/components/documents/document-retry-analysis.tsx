'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getApiBaseUrl, readApiErrorBody } from '@/lib/utils/api-response';
import { mapApiError } from '@/lib/utils/map-api-error';

interface DocumentRetryAnalysisProps {
  documentId: string;
  targetLanguage?: string;
}

export function DocumentRetryAnalysis({
  documentId,
  targetLanguage = 'tr',
}: DocumentRetryAnalysisProps) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/ai/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, targetLanguage }),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const body = await readApiErrorBody(res, t('errors.analysisFailed'));
        throw new Error(mapApiError(body, (key, values) => t(key, values)));
      }

      toast.success(t('documents.detail.retrySuccess'));
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('errors.analysisFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Alert variant="destructive">
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{t('documents.detail.analysisFailed')}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={loading}
          className="shrink-0 bg-background"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {loading
            ? t('documents.detail.retryingAnalysis')
            : t('documents.detail.retryAnalysis')}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
