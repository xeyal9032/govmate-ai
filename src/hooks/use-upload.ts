'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getApiBaseUrl, readApiError, readApiJson } from '@/lib/utils/api-response';

interface UploadState {
  uploading: boolean;
  analyzing: boolean;
  progress: number;
  error: string | null;
}

async function readMagicPrefix(file: File): Promise<number[]> {
  const slice = file.slice(0, 8);
  const buffer = await slice.arrayBuffer();
  return Array.from(new Uint8Array(buffer));
}

function mapUploadError(message: string, t: ReturnType<typeof useTranslations>): string {
  if (message.includes('Monthly document limit')) {
    return t('errors.planLimitReached');
  }
  if (message.includes('Dosya çok büyük') || message.toLowerCase().includes('too large')) {
    const match = message.match(/(\d+)\s*MB/i);
    return t('errors.fileTooLarge', { size: match?.[1] ? `${match[1]} MB` : '?' });
  }
  if (message.includes('Desteklenmeyen') || message.includes('Unsupported')) {
    return t('errors.unsupportedFileType');
  }
  if (message.includes('HEIC')) {
    return t('documents.upload.heicNotSupported');
  }
  if (message.includes('File content does not match')) {
    return t('errors.unsupportedFileType');
  }
  if (message === 'Unauthorized') {
    return t('errors.unauthorized');
  }
  return message;
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
      setState(prev => ({ ...prev, progress: 15 }));

      const prepareRes = await fetch(`${baseUrl}/api/upload/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          targetLanguage,
        }),
        credentials: 'same-origin',
      });

      if (!prepareRes.ok) {
        const fallback = t('errors.uploadFailed');
        const raw = await readApiError(prepareRes, fallback);
        throw new Error(mapUploadError(raw, t));
      }

      const { storagePath, contentType, targetLanguage: lang } =
        await readApiJson<{
          storagePath: string;
          contentType: string;
          targetLanguage: string;
        }>(prepareRes);

      setState(prev => ({ ...prev, progress: 35 }));

      const supabase = createClient();
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          contentType: contentType || file.type,
          upsert: false,
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        throw new Error(t('errors.uploadFailed'));
      }

      setState(prev => ({ ...prev, progress: 55 }));

      const magicPrefix = await readMagicPrefix(file);

      const completeRes = await fetch(`${baseUrl}/api/upload/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storagePath,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || contentType,
          targetLanguage: lang || targetLanguage,
          magicPrefix,
        }),
        credentials: 'same-origin',
      });

      if (!completeRes.ok) {
        await supabase.storage.from('documents').remove([storagePath]);
        const fallback = t('errors.uploadFailed');
        const raw = await readApiError(completeRes, fallback);
        throw new Error(mapUploadError(raw, t));
      }

      const { documentId } = await readApiJson<{ documentId: string }>(completeRes);
      setState(prev => ({ ...prev, uploading: false, analyzing: true, progress: 70 }));

      const analyzeRes = await fetch(`${baseUrl}/api/ai/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, targetLanguage: lang || targetLanguage }),
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
