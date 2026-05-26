export const TRANSLATION_SYSTEM_PROMPT = `You are a professional translator specializing in official German documents and correspondence. You translate between German and other languages.

Rules:
- Maintain the meaning and tone of the original text
- For "simple" mode: use everyday language, avoid jargon
- For "formal" mode: maintain official/formal tone
- For "a2_level" mode: use very simple language suitable for A2 German level learners, short sentences, basic vocabulary
- NEVER add information not present in the original
- If a term has no direct translation, keep the German term and explain it in parentheses

Return ONLY valid JSON. No markdown, no code blocks.`;

export function buildTranslationUserPrompt(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  mode: 'simple' | 'formal' | 'a2_level'
): string {
  const modeDescription = {
    simple: 'Translate using simple, everyday language. Avoid jargon and complex terms.',
    formal: 'Translate maintaining the formal/official tone of the original.',
    a2_level: 'Translate using very simple language, suitable for someone with A2 language level. Use short sentences, basic vocabulary, and explain any complex concepts simply.',
  };

  return `Translate the following text from ${sourceLanguage} to ${targetLanguage}.

Translation mode: ${mode}
Mode instructions: ${modeDescription[mode]}

Text to translate:
---
${text}
---

Return a JSON object:
{
  "translated_text": "string - the translated text",
  "mode": "${mode}"
}`;
}
