import type { AnalysisResult, LetterType, ResponseType } from '@/types/database';

const DIRECT_MAP: Partial<Record<ResponseType, LetterType>> = {
  simple_reply: 'simple_reply',
  formal_letter: 'formal_letter',
  appointment_request: 'appointment_request',
  objection: 'objection',
  clarification_request: 'clarification_request',
};

/** AI analizine göre önerilen mektup türü */
export function getRecommendedLetterType(
  analysis: AnalysisResult | null | undefined
): LetterType | null {
  if (!analysis) return 'formal_letter';

  if (analysis.recommended_response_type === 'no_response_needed') {
    return null;
  }

  const requiredCount =
    analysis.required_documents?.filter((d) => !d.optional).length ?? 0;

  if (
    requiredCount >= 1 &&
    (analysis.recommended_response_type === 'formal_letter' ||
      analysis.recommended_response_type === 'clarification_request')
  ) {
    return 'document_submission';
  }

  const mapped = DIRECT_MAP[analysis.recommended_response_type];
  return mapped ?? 'formal_letter';
}

export function isLetterType(value: string | null): value is LetterType {
  return [
    'simple_reply',
    'formal_letter',
    'appointment_request',
    'document_submission',
    'deadline_extension',
    'clarification_request',
    'objection',
  ].includes(value ?? '');
}
