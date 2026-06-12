import { describe, expect, it } from 'vitest';
import {
  AI_MODEL_OPTIONS,
  DEFAULT_AI_MODEL,
  DEFAULT_TRANSLATION_MODEL,
  sanitizeAiModel,
} from '@/lib/ai/model-options';
import { clearAiSettingsCache } from '@/lib/ai/settings';

describe('ai model options', () => {
  it('varsayılan modeller tanımlı', () => {
    expect(DEFAULT_AI_MODEL).toBe('gpt-4o');
    expect(DEFAULT_TRANSLATION_MODEL).toBe('gpt-4o-mini');
  });

  it('model seçenekleri izin listesinde', () => {
    const values = AI_MODEL_OPTIONS.map((o) => o.value);
    expect(values).toContain(DEFAULT_AI_MODEL);
    expect(values).toContain(DEFAULT_TRANSLATION_MODEL);
  });

  it('geçersiz model fallback döner', () => {
    expect(sanitizeAiModel('invalid-model', DEFAULT_AI_MODEL)).toBe(DEFAULT_AI_MODEL);
    expect(sanitizeAiModel('gpt-4o-mini', DEFAULT_AI_MODEL)).toBe('gpt-4o-mini');
  });

  it('önbellek temizlenebilir', () => {
    clearAiSettingsCache();
    expect(true).toBe(true);
  });
});
