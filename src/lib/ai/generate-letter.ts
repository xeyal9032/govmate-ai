import { getOpenAIClient } from './client';
import {
  LETTER_REPLY_SYSTEM_PROMPT,
  buildLetterReplyUserPrompt,
} from './prompts/letter-reply';
import { letterResponseSchema } from './schemas/letter.schema';
import type { AILetterRequest, AILetterResponse } from '@/types/ai';

const MAX_RETRIES = 3;

export async function generateLetter(
  request: AILetterRequest,
  model: string = 'gpt-4o'
): Promise<AILetterResponse> {
  const openai = getOpenAIClient();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: LETTER_REPLY_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildLetterReplyUserPrompt({
              authorityName: request.authorityName,
              summary: request.summary,
              action: request.action,
              letterType: request.letterType,
              userProfile: request.userProfile,
              notes: request.notes,
              targetLanguage: request.targetLanguage,
            }),
          },
        ],
        temperature: 0.2,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No AI response received');

      const parsed = JSON.parse(content);
      return letterResponseSchema.parse(parsed);
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error('Letter generation failed after all retries:', error);
        throw new Error(
          `Letter generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      console.warn(`Letter attempt ${attempt}/${MAX_RETRIES} failed, retrying...`);
    }
  }

  throw new Error('Unexpected error');
}
