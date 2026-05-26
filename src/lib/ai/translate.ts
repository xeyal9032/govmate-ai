import { getOpenAIClient } from './client';
import {
  TRANSLATION_SYSTEM_PROMPT,
  buildTranslationUserPrompt,
} from './prompts/translation';
import { translationResponseSchema } from './schemas/letter.schema';
import type { AITranslationRequest, AITranslationResponse } from '@/types/ai';

const MAX_RETRIES = 3;

export async function translateText(request: AITranslationRequest): Promise<AITranslationResponse> {
  const openai = getOpenAIClient();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: TRANSLATION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildTranslationUserPrompt(
              request.text,
              request.sourceLanguage,
              request.targetLanguage,
              request.mode
            ),
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No AI response received');

      const parsed = JSON.parse(content);
      return translationResponseSchema.parse(parsed);
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  }

  throw new Error('Unexpected error');
}
