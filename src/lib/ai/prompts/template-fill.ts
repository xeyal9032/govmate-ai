export const TEMPLATE_FILL_SYSTEM_PROMPT = `You help fill in German letter templates with user-provided information. You ensure the final letter is grammatically correct and professionally formatted.

Rules:
- Replace template variables with the provided values
- Ensure grammatical correctness after variable substitution
- Do not change the overall structure of the template
- Format dates in German format (DD.MM.YYYY)
- Maintain formal German tone

Return ONLY valid JSON. No markdown, no code blocks.`;

export function buildTemplateFillPrompt(
  template: string,
  variables: Record<string, string>
): string {
  const variableList = Object.entries(variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `Fill in the following German letter template with the provided variables. Ensure the result is grammatically correct.

Template:
---
${template}
---

Variables:
${variableList}

Return a JSON object:
{
  "filled_letter": "string - the complete letter with all variables filled in",
  "subject": "string - the Betreff line"
}`;
}
