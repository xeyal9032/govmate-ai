/** API yanıtlarında kullanılan hata kodları — client i18n ile eşleştirilir */
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  DOCUMENT_LIMIT: 'DOCUMENT_LIMIT',
  LETTER_LIMIT: 'LETTER_LIMIT',
  PLAN_PDF_EXPORT: 'PLAN_PDF_EXPORT',
  PLAN_TRANSLATION: 'PLAN_TRANSLATION',
  PLAN_REMINDERS: 'PLAN_REMINDERS',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE: 'UNSUPPORTED_FILE',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  PDF_FAILED: 'PDF_FAILED',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export interface ApiErrorBody {
  error: string;
  errorCode?: ApiErrorCode;
  params?: Record<string, string | number>;
}

/** Eski İngilizce mesajları errorCode'a çevirir (geriye uyumluluk) */
export function inferErrorCode(message: string): ApiErrorCode | undefined {
  if (message.includes('Monthly document limit')) return API_ERROR_CODES.DOCUMENT_LIMIT;
  if (message.includes('Letter generation limit')) return API_ERROR_CODES.LETTER_LIMIT;
  if (message.includes('PDF export is not available')) return API_ERROR_CODES.PLAN_PDF_EXPORT;
  if (message.includes('Translation feature is not available')) return API_ERROR_CODES.PLAN_TRANSLATION;
  if (message.includes('Email reminders are not available')) return API_ERROR_CODES.PLAN_REMINDERS;
  if (message === 'Unauthorized') return API_ERROR_CODES.UNAUTHORIZED;
  return undefined;
}
