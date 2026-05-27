import { describe, expect, it } from 'vitest';
import { getRecommendedLetterType, isLetterType } from './recommended-letter-type';
import type { AnalysisResult } from '@/types/database';

function analysis(
  overrides: Partial<AnalysisResult> = {}
): AnalysisResult {
  return {
    document_type: 'jobcenter_letter',
    sender_authority: 'Jobcenter Berlin',
    recipient_name: 'Max Mustermann',
    letter_date: '2024-01-15',
    deadlines: [],
    summary_simple: 'Özet',
    summary_detailed: 'Detay',
    required_actions: [],
    required_documents: [],
    risks_if_ignored: [],
    recommended_response_type: 'formal_letter',
    confidence_score: 90,
    legal_disclaimer: 'Disclaimer',
    ...overrides,
  };
}

describe('getRecommendedLetterType', () => {
  it('null analizde formal_letter döner', () => {
    expect(getRecommendedLetterType(null)).toBe('formal_letter');
    expect(getRecommendedLetterType(undefined)).toBe('formal_letter');
  });

  it('no_response_needed için null döner', () => {
    expect(
      getRecommendedLetterType(
        analysis({ recommended_response_type: 'no_response_needed' })
      )
    ).toBeNull();
  });

  it('itiraz için objection döner', () => {
    expect(
      getRecommendedLetterType(
        analysis({ recommended_response_type: 'objection' })
      )
    ).toBe('objection');
  });

  it('zorunlu belge varsa document_submission önceliklidir', () => {
    expect(
      getRecommendedLetterType(
        analysis({
          recommended_response_type: 'formal_letter',
          required_documents: [
            { name: 'Pasaport', why_needed: 'Kimlik', optional: false },
          ],
        })
      )
    ).toBe('document_submission');
  });

  it('opsiyonel belgeler document_submission tetiklemez', () => {
    expect(
      getRecommendedLetterType(
        analysis({
          recommended_response_type: 'formal_letter',
          required_documents: [
            { name: 'Ek', why_needed: 'Opsiyonel', optional: true },
          ],
        })
      )
    ).toBe('formal_letter');
  });

  it('appointment_request doğrudan eşlenir', () => {
    expect(
      getRecommendedLetterType(
        analysis({ recommended_response_type: 'appointment_request' })
      )
    ).toBe('appointment_request');
  });
});

describe('isLetterType', () => {
  it('geçerli mektup türlerini kabul eder', () => {
    expect(isLetterType('objection')).toBe(true);
    expect(isLetterType('document_submission')).toBe(true);
  });

  it('geçersiz değerleri reddeder', () => {
    expect(isLetterType('invalid')).toBe(false);
    expect(isLetterType(null)).toBe(false);
  });
});
