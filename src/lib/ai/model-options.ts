/** Client ve server tarafında paylaşılan AI model sabitleri */

export const DEFAULT_AI_MODEL = 'gpt-4o';
export const DEFAULT_TRANSLATION_MODEL = 'gpt-4o-mini';

export const AI_MODEL_OPTIONS = [
  { value: 'gpt-4o', labelKey: 'aiModelGpt4o' },
  { value: 'gpt-4o-mini', labelKey: 'aiModelGpt4oMini' },
  { value: 'gpt-4.1', labelKey: 'aiModelGpt41' },
  { value: 'gpt-4.1-mini', labelKey: 'aiModelGpt41Mini' },
] as const;

export type AiModelValue = (typeof AI_MODEL_OPTIONS)[number]['value'];

export const ALLOWED_AI_MODELS = new Set<string>(AI_MODEL_OPTIONS.map((o) => o.value));

export function sanitizeAiModel(value: string | undefined, fallback: string): string {
  if (value && ALLOWED_AI_MODELS.has(value)) return value;
  return fallback;
}
