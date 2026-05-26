'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguage', targetLanguage);

      setState(prev => ({ ...prev, progress: 30 }));

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || t('errors.uploadFailed'));
      }

      const { documentId } = await uploadRes.json();
      setState(prev => ({ ...prev, uploading: false, analyzing: true, progress: 50 }));

      const analyzeRes = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, targetLanguage }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || t('errors.analysisFailed'));
      }

      setState(prev => ({ ...prev, progress: 100, analyzing: false }));
      const result = await analyzeRes.json();

      toast.success(t('documents.upload.analysisComplete'));
      return { documentId, analysis: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.generic');
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
