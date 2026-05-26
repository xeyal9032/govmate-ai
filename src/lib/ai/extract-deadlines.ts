import { getOpenAIClient } from './client';
import {
  DEADLINE_EXTRACTION_SYSTEM_PROMPT,
  buildDeadlineExtractionPrompt,
} from './prompts/deadline-extraction';
import { deadlineExtractionResponseSchema } from './schemas/letter.schema';

const MAX_RETRIES = 3;

export async function extractDeadlines(
  documentText: string,
  targetLanguage: string
) {
  const openai = getOpenAIClient();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: DEADLINE_EXTRACTION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: buildDeadlineExtractionPrompt(documentText, targetLanguage),
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No AI response received');

      const parsed = JSON.parse(content);
      return deadlineExtractionResponseSchema.parse(parsed);
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error('Deadline extraction failed after all retries:', error);
        throw new Error(
          `Deadline extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      console.warn(`Deadline attempt ${attempt}/${MAX_RETRIES} failed, retrying...`);
    }
  }

  throw new Error('Unexpected error');
}
