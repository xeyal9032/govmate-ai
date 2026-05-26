export const DEADLINE_EXTRACTION_SYSTEM_PROMPT = `You extract deadlines and important dates from official German documents. You are precise and careful.

Rules:
- Only extract dates that are explicitly mentioned in the document
- NEVER invent or assume dates
- Classify urgency based on:
  - critical: less than 3 days or legal consequences mentioned
  - high: less than 7 days
  - medium: less than 30 days
  - low: more than 30 days
- If a date format is ambiguous, note it in the reason field
- Consider German date formats (DD.MM.YYYY)

Return ONLY valid JSON. No markdown, no code blocks.`;

export function buildDeadlineExtractionPrompt(
  documentText: string,
  targetLanguage: string
): string {
  return `Extract all deadlines and important dates from this document:

---
${documentText}
---

User's preferred language: ${targetLanguage}

Return a JSON object:
{
  "deadlines": [
    {
      "date": "YYYY-MM-DD",
      "reason": "string - what the deadline is for, in user's language",
      "urgency": "low | medium | high | critical",
      "original_text": "string - the original German text mentioning this date"
    }
  ],
  "has_deadlines": true/false
}`;
}
