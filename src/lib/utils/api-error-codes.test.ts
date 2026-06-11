import { describe, expect, it } from 'vitest';
import { API_ERROR_CODES, inferErrorCode } from '@/lib/utils/api-error-codes';

describe('inferErrorCode', () => {
  it('belge limiti mesajını eşleştirir', () => {
    expect(inferErrorCode('Monthly document limit reached')).toBe(
      API_ERROR_CODES.DOCUMENT_LIMIT
    );
  });

  it('mektup limiti mesajını eşleştirir', () => {
    expect(inferErrorCode('Letter generation limit reached')).toBe(
      API_ERROR_CODES.LETTER_LIMIT
    );
  });

  it('PDF export mesajını eşleştirir', () => {
    expect(
      inferErrorCode('PDF export is not available on your current plan.')
    ).toBe(API_ERROR_CODES.PLAN_PDF_EXPORT);
  });

  it('bilinmeyen mesajda undefined döner', () => {
    expect(inferErrorCode('Something else')).toBeUndefined();
  });
});
