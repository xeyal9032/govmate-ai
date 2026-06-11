import { describe, expect, it } from 'vitest';
import { getPlanFeatureDescriptors } from '@/lib/utils/plan-feature-labels';
import type { PlanLimit } from '@/types/database';

function mockLimit(overrides: Partial<PlanLimit>): PlanLimit {
  return {
    id: '1',
    plan: 'free',
    monthly_document_limit: 20,
    monthly_letter_limit: 2,
    max_file_size_mb: 20,
    translation_enabled: false,
    reminders_enabled: false,
    pdf_export_enabled: false,
    ...overrides,
  } as PlanLimit;
}

describe('getPlanFeatureDescriptors', () => {
  it('free plan limitlerini üretir', () => {
    const items = getPlanFeatureDescriptors(mockLimit({}));
    expect(items.some((i) => i.key === 'documents' && i.params?.count === 20)).toBe(
      true
    );
    expect(items.some((i) => i.key === 'letters' && i.params?.count === 2)).toBe(true);
    expect(items.some((i) => i.key === 'translation')).toBe(false);
  });

  it('pro plan sınırsız mektup ve özellikleri içerir', () => {
    const items = getPlanFeatureDescriptors(
      mockLimit({
        plan: 'pro',
        monthly_letter_limit: -1,
        translation_enabled: true,
        pdf_export_enabled: true,
        reminders_enabled: true,
      })
    );
    expect(items.some((i) => i.key === 'unlimitedLetters')).toBe(true);
    expect(items.some((i) => i.key === 'pdfExport')).toBe(true);
  });
});
