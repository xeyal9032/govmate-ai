import { getOpenAIClient } from './client';
import {
  DOCUMENT_ANALYSIS_SYSTEM_PROMPT,
  buildDocumentAnalysisUserPrompt,
} from './prompts/document-analysis';
import { analysisResultSchema } from './schemas/document-analysis.schema';
import type { AnalysisResult } from '@/types/database';

const MAX_RETRIES = 3;

export async function analyzeDocument(
  documentText: string,
  targetLanguage: string,
  fileUrl?: string,
  mimeType?: string,
  visionImages?: string[]
): Promise<AnalysisResult> {
  const openai = getOpenAIClient();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const messages: Parameters<typeof openai.chat.completions.create>[0]['messages'] = [
        { role: 'system', content: DOCUMENT_ANALYSIS_SYSTEM_PROMPT },
      ];

      const userPrompt = buildDocumentAnalysisUserPrompt(documentText, targetLanguage);

      if (visionImages && visionImages.length > 0) {
        messages.push({
          role: 'user',
          content: [
            ...visionImages.map((url) => ({
              type: 'image_url' as const,
              image_url: { url, detail: 'high' as const },
            })),
            { type: 'text' as const, text: userPrompt },
          ],
        });
      } else if (fileUrl && mimeType?.startsWith('image/')) {
        messages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: fileUrl, detail: 'high' },
            },
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        });
      } else {
        messages.push({
          role: 'user',
          content: userPrompt,
        });
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No AI response received');

      const parsed = JSON.parse(content);
      const validated = analysisResultSchema.parse(parsed);

      return validated as AnalysisResult;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error('Document analysis failed after all retries:', error);
        throw new Error(
          `Document analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      console.warn(`Analysis attempt ${attempt}/${MAX_RETRIES} failed, retrying...`);
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error('Unexpected error');
}
