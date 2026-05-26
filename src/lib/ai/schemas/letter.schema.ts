import { z } from 'zod';

export const letterResponseSchema = z.object({
  subject: z.string(),
  german_body: z.string(),
  explanation_in_user_language: z.string(),
  disclaimer: z.string(),
});

export type LetterResponseSchema = z.infer<typeof letterResponseSchema>;

export const translationResponseSchema = z.object({
  translated_text: z.string(),
  mode: z.string(),
});

export type TranslationResponseSchema = z.infer<typeof translationResponseSchema>;

export const templateFillResponseSchema = z.object({
  filled_letter: z.string(),
  subject: z.string(),
});

export type TemplateFillResponseSchema = z.infer<typeof templateFillResponseSchema>;

export const deadlineExtractionResponseSchema = z.object({
  deadlines: z.array(
    z.object({
      date: z.string(),
      reason: z.string(),
      urgency: z.enum(['low', 'medium', 'high', 'critical']),
      original_text: z.string().optional(),
    })
  ),
  has_deadlines: z.boolean(),
});

export type DeadlineExtractionResponseSchema = z.infer<typeof deadlineExtractionResponseSchema>;
