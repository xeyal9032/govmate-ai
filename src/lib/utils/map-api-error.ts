'use client';

import type { ApiErrorBody, ApiErrorCode } from '@/lib/utils/api-error-codes';
import { API_ERROR_CODES, inferErrorCode } from '@/lib/utils/api-error-codes';

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

/** API errorCode veya mesajdan i18n hata metni üretir */
export function mapApiError(
  body: ApiErrorBody | string,
  t: TranslateFn
): string {
  const error = typeof body === 'string' ? body : body.error;
  const errorCode =
    typeof body === 'string'
      ? inferErrorCode(body)
      : body.errorCode ?? inferErrorCode(error);

  const params = typeof body === 'string' ? undefined : body.params;

  switch (errorCode) {
    case API_ERROR_CODES.DOCUMENT_LIMIT:
      return t('errors.planLimit.documentLimit');
    case API_ERROR_CODES.LETTER_LIMIT:
      return t('errors.planLimit.letterLimit');
    case API_ERROR_CODES.PLAN_PDF_EXPORT:
      return t('errors.planLimit.pdfExport');
    case API_ERROR_CODES.PLAN_TRANSLATION:
      return t('errors.planLimit.translation');
    case API_ERROR_CODES.PLAN_REMINDERS:
      return t('errors.planLimit.reminders');
    case API_ERROR_CODES.UNAUTHORIZED:
      return t('errors.unauthorized');
    case API_ERROR_CODES.FILE_TOO_LARGE: {
      const size = params?.size ?? error.match(/(\d+)\s*MB/i)?.[1];
      return t('errors.fileTooLarge', { size: size ? `${size} MB` : '?' });
    }
    case API_ERROR_CODES.UNSUPPORTED_FILE:
      return t('errors.unsupportedFileType');
    case API_ERROR_CODES.ANALYSIS_FAILED:
      return t('errors.analysisFailed');
    case API_ERROR_CODES.UPLOAD_FAILED:
      return t('errors.uploadFailed');
    case API_ERROR_CODES.PDF_FAILED:
      return t('errors.pdfFailed');
    default:
      if (error.includes('HEIC')) {
        return t('documents.upload.heicNotSupported');
      }
      if (error.includes('Dosya çok büyük') || error.toLowerCase().includes('too large')) {
        const match = error.match(/(\d+)\s*MB/i);
        return t('errors.fileTooLarge', { size: match?.[1] ? `${match[1]} MB` : '?' });
      }
      if (error.includes('Desteklenmeyen') || error.includes('Unsupported')) {
        return t('errors.unsupportedFileType');
      }
      if (error.includes('File content does not match')) {
        return t('errors.unsupportedFileType');
      }
      return error || t('errors.generic');
  }
}

export function mapApiErrorCode(code: ApiErrorCode, t: TranslateFn): string {
  return mapApiError({ error: '', errorCode: code }, t);
}
