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
