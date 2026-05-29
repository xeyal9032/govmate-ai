'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { getApiBaseUrl, readApiError, readApiJson } from '@/lib/utils/api-response';

interface UploadState {
  uploading: boolean;
  analyzing: boolean;
  progress: number;
  error: string | null;
}

export function useUpload() {
  const t = useTranslations();
  const [state, setState] = useState<UploadState>({
    uploading: false,
    analyzing: false,
    progress: 0,
    error: null,
  });

  const uploadAndAnalyze = useCallback(async (
    file: File,
    targetLanguage: string
  ) => {
    setState({ uploading: true, analyzing: false, progress: 10, error: null });

    const baseUrl = getApiBaseUrl();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguage', targetLanguage);

      setState(prev => ({ ...prev, progress: 30 }));

      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      if (!uploadRes.ok) {
        const fallback = t('errors.uploadFailed');
        if (uploadRes.status === 401) {
          throw new Error(t('errors.unauthorized'));
        }
        const message = await readApiError(uploadRes, fallback);
        throw new Error(message);
      }

      const { documentId } = await readApiJson<{ documentId: string }>(uploadRes);
      setState(prev => ({ ...prev, uploading: false, analyzing: true, progress: 50 }));

      const analyzeRes = await fetch(`${baseUrl}/api/ai/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, targetLanguage }),
        credentials: 'same-origin',
      });

      if (!analyzeRes.ok) {
        const fallback = t('errors.analysisFailed');
        if (analyzeRes.status === 401) {
          throw new Error(t('errors.unauthorized'));
        }
        const message = await readApiError(analyzeRes, fallback);
        throw new Error(message);
      }

      setState(prev => ({ ...prev, progress: 100, analyzing: false }));
      const result = await readApiJson<{ success: boolean; analysis: unknown }>(analyzeRes);

      toast.success(t('documents.upload.analysisComplete'));
      return { documentId, analysis: result };
    } catch (error) {
      let message = t('errors.generic');
      if (error instanceof Error) {
        if (error.message === 'JSON_PARSE' || error.message === 'EMPTY_RESPONSE') {
          message = t('errors.jsonParseFailed');
        } else {
          message = error.message;
        }
      }
      setState(prev => ({ ...prev, error: message, uploading: false, analyzing: false }));
      toast.error(message);
      return null;
    }
  }, [t]);

  const reset = useCallback(() => {
    setState({ uploading: false, analyzing: false, progress: 0, error: null });
  }, []);

  return { ...state, uploadAndAnalyze, reset };
}
